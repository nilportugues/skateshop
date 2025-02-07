import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Products } from '@/features/product/client/components/dashboard.products';
import { getProducts } from '@/features/product/server/product';

import { getStores } from '@/features/stores/store';

import { Breadcrumbs } from '@/components/pagers/breadcrumbs';
import { Shell } from '@/components/shells/shell';
import { Separator } from '@/components/ui/separator';
import { env } from '@/env.mjs';
import { products, stores } from '@/libs/server/db/schema';
import { findStoreById } from '@/features/stores/server/db';

interface StorePageProps {
    params: {
        storeId: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

async function getStoreFromParams(params: StorePageProps['params']) {
    const storeId = Number(params.storeId);
    return await findStoreById({ storeId });
}

export async function generateMetadata({
    params,
}: StorePageProps): Promise<Metadata> {
    const store = await getStoreFromParams(params);

    if (!store) {
        return {};
    }

    return {
        metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
        title: store.name,
        description: store.description,
    };
}

export default async function StorePage({
    params,
    searchParams,
}: StorePageProps) {
    const store = await getStoreFromParams(params);

    if (!store) {
        notFound();
    }

    const { page, per_page, store_page } = searchParams;

    // Products transaction
    const limit = typeof per_page === 'string' ? parseInt(per_page) : 8;
    const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

    const productsTransaction = await getProducts({
        limit: limit,
        offset: offset,
        store_ids: String(store.id),
    });

    const pageCount = Math.ceil(productsTransaction.count / limit);

    // Stores transaction
    const storesLimit = 25;
    const storesOffset =
        typeof store_page === 'string'
            ? (parseInt(store_page) - 1) * storesLimit
            : 0;

    const storesTransaction = await getStores({
        limit: storesLimit,
        offset: storesOffset,
        sort: 'name.asc',
    });

    const storePageCount = Math.ceil(storesTransaction.count / storesLimit);

    return (
        <Shell>
            <Breadcrumbs
                segments={[
                    {
                        title: 'Stores',
                        href: '/stores',
                    },
                    {
                        title: store.name,
                        href: `/store/${store.id}`,
                    },
                ]}
            />
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                <div className="flex w-full flex-col gap-4">
                    <div className="space-y-2">
                        <h2 className="line-clamp-1 text-2xl font-bold">
                            {store.name}
                        </h2>
                        <p className="text-base text-muted-foreground">
                            {store.description}
                        </p>
                    </div>
                    <Separator className="my-1.5" />
                    <Products
                        products={productsTransaction.items}
                        pageCount={pageCount}
                        categories={Object.values(products.category.enumValues)}
                        stores={storesTransaction.items}
                        storePageCount={storePageCount}
                    />
                </div>
            </div>
        </Shell>
    );
}
