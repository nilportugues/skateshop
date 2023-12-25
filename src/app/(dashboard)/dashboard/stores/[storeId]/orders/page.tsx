import { and, asc, desc, eq, gte, inArray, like, lte, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as React from 'react';

import { OrdersDataTable } from '@/features/stripe/client/components/dashboard.datatable.orders';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker } from '@/components/date-range-picker';
import { env } from '@/env.mjs';
import { db } from '@/libs/server/db';
import { type Order, orders } from '@/libs/server/db/schema';
import { ordersSearchParamsSchema } from '@/libs/server/params.validations';
import { findStoreById } from '@/features/stores/server/db';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Orders',
    description: 'Manage your orders',
};

interface OrdersPageProps {
    params: {
        storeId: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function OrdersPage({
    params,
    searchParams,
}: OrdersPageProps) {
    const storeId = Number(params.storeId);

    const { page, per_page, sort, customer, status, from, to } =
        ordersSearchParamsSchema.parse(searchParams);

    const store = await findStoreById({ storeId });
    if (!store) {
        notFound();
    }

    // Fallback page for invalid page numbers
    const pageAsNumber = Number(page);
    const fallbackPage =
        isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    // Number of items per page
    const perPageAsNumber = Number(per_page);
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;
    // Column and order to sort by
    const [column, order] = (sort.split('.') as [
        keyof Order | undefined,
        'asc' | 'desc' | undefined,
    ]) ?? ['createdAt', 'desc'];

    const statuses = status ? status.split('.') : [];

    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    // Transaction is used to ensure both queries are executed in a single transaction
    const transaction = db.transaction(async (tx) => {
        const items = await tx
            .select({
                id: orders.id,
                storeId: orders.storeId,
                quantity: orders.quantity,
                amount: orders.amount,
                paymentIntentId: orders.stripePaymentIntentId,
                status: orders.stripePaymentIntentStatus,
                customer: orders.email,
                createdAt: orders.createdAt,
            })
            .from(orders)
            .limit(limit)
            .offset(offset)
            .where(
                and(
                    eq(orders.storeId, storeId),
                    // Filter by email
                    customer ? like(orders.email, `%${customer}%`) : undefined,
                    // Filter by status
                    statuses.length > 0
                        ? inArray(orders.stripePaymentIntentStatus, statuses)
                        : undefined,
                    // Filter by createdAt
                    fromDay && toDay
                        ? and(
                              gte(orders.createdAt, fromDay),
                              lte(orders.createdAt, toDay),
                          )
                        : undefined,
                ),
            )
            .orderBy(
                column && column in orders
                    ? order === 'asc'
                        ? asc(orders[column])
                        : desc(orders[column])
                    : desc(orders.createdAt),
            );

        const count = await tx
            .select({
                count: sql<number>`count(*)`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.storeId, storeId),
                    // Filter by email
                    customer ? like(orders.email, `%${customer}%`) : undefined,
                    // Filter by status
                    statuses.length > 0
                        ? inArray(orders.stripePaymentIntentStatus, statuses)
                        : undefined,
                    // Filter by createdAt
                    fromDay && toDay
                        ? and(
                              gte(orders.createdAt, fromDay),
                              lte(orders.createdAt, toDay),
                          )
                        : undefined,
                ),
            )
            .execute()
            .then((res) => res[0]?.count ?? 0);

        return {
            items,
            count,
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                <DateRangePicker align="end" />
            </div>
            <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
                <OrdersDataTable
                    transaction={transaction}
                    limit={limit}
                    storeId={storeId}
                />
            </React.Suspense>
        </div>
    );
}
