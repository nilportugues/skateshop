import { and, asc, desc, eq, gte, inArray, like, lte, sql } from 'drizzle-orm';
import { type Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';
import * as React from 'react';

import { SeedProducts } from '@/features/product/client/components/dashboard.button.seed-products';
import { ProductsDataTable } from '@/features/product/client/components/dashboard.shell.products-table';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker } from '@/components/date-range-picker';
import { env } from '@/env.mjs';
import { db } from '@/libs/server/db';
import { type Product, products } from '@/libs/server/db/schema';
import { dashboardProductsSearchParamsSchema } from '@/libs/server/params.validations';
import { findStoreById } from '@/features/stores/server/db';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Products',
    description: 'Manage your products',
};

interface ProductsPageProps {
    params: {
        storeId: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function ProductsPage({
    params,
    searchParams,
}: ProductsPageProps) {
    const storeId = Number(params.storeId);

    // Parse search params using zod schema
    const { page, per_page, sort, name, category, from, to } =
        dashboardProductsSearchParamsSchema.parse(searchParams);

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
    const [column, order] = (sort?.split('.') as [
        keyof Product | undefined,
        'asc' | 'desc' | undefined,
    ]) ?? ['createdAt', 'desc'];

    const categories = (category?.split('.') as Product['category'][]) ?? [];

    const fromDay = from ? new Date(from) : undefined;
    const toDay = to ? new Date(to) : undefined;

    // Transaction is used to ensure both queries are executed in a single transaction
    noStore();

    const transaction = db.transaction(async (tx) => {
        const items = await tx
            .select({
                id: products.id,
                name: products.name,
                category: products.category,
                price: products.price,
                inventory: products.inventory,
                rating: products.rating,
                createdAt: products.createdAt,
            })
            .from(products)
            .limit(limit)
            .offset(offset)
            .where(
                and(
                    eq(products.storeId, storeId),
                    // Filter by name
                    name ? like(products.name, `%${name}%`) : undefined,
                    // Filter by category
                    categories.length > 0
                        ? inArray(products.category, categories)
                        : undefined,
                    // Filter by createdAt
                    fromDay && toDay
                        ? and(
                              gte(products.createdAt, fromDay),
                              lte(products.createdAt, toDay),
                          )
                        : undefined,
                ),
            )
            .orderBy(
                column && column in products
                    ? order === 'asc'
                        ? asc(products[column])
                        : desc(products[column])
                    : desc(products.createdAt),
            );

        const count = await tx
            .select({
                count: sql<number>`count(${products.id})`,
            })
            .from(products)
            .where(
                and(
                    eq(products.storeId, storeId),
                    // Filter by name
                    name ? like(products.name, `%${name}%`) : undefined,
                    // Filter by category
                    categories.length > 0
                        ? inArray(products.category, categories)
                        : undefined,
                    // Filter by createdAt
                    fromDay && toDay
                        ? and(
                              gte(products.createdAt, fromDay),
                              lte(products.createdAt, toDay),
                          )
                        : undefined,
                ),
            )
            .then((res) => res[0]?.count ?? 0);

        return {
            items,
            count,
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                <DateRangePicker align="end" />
            </div>
            <SeedProducts storeId={storeId} count={4} />
            <React.Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={6}
                        isNewRowCreatable={true}
                        isRowsDeletable={true}
                    />
                }
            >
                <ProductsDataTable
                    transaction={transaction}
                    limit={limit}
                    storeId={storeId}
                />
            </React.Suspense>
        </div>
    );
}
