import type { Metadata } from 'next';

import { Products } from '@/features/product/client/components/dashboard.products';
import { getProducts } from '@/features/product/server/product';

import { getStores } from '@/features/stores/store';

import { PageHeaderBlock } from '@/components/page-header.block';
import { Shell } from '@/components/shells/shell';
import { env } from '@/env.mjs';
import { toTitleCase, unslugify } from '@/libs/client/utils';
import { type Product } from '@/libs/server/db/schema';
import { productsSearchParamsSchema } from '@/libs/server/params.validations';

interface SubcategoryPageProps {
    params: {
        category: Product['category'];
        subcategory: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export function generateMetadata({ params }: SubcategoryPageProps): Metadata {
    const subcategory = unslugify(params.subcategory);

    return {
        metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
        title: toTitleCase(subcategory),
        description: `Buy the best ${subcategory}`,
    };
}

export default async function SubcategoryPage({
    params,
    searchParams,
}: SubcategoryPageProps) {
    const { category, subcategory } = params;
    const { page, per_page, sort, price_range, store_ids, store_page, active } =
        productsSearchParamsSchema.parse(searchParams);

    // Products transaction
    const limit = typeof per_page === 'string' ? parseInt(per_page) : 8;
    const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

    const productsTransaction = await getProducts({
        limit,
        offset,
        sort: typeof sort === 'string' ? sort : null,
        categories: category,
        subcategories: subcategory,
        price_range: typeof price_range === 'string' ? price_range : null,
        store_ids: typeof store_ids === 'string' ? store_ids : null,
        active,
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
        sort: 'productCount.desc',
    });

    const storePageCount = Math.ceil(storesTransaction.count / storesLimit);

    return (
        <Shell>
            <PageHeaderBlock
                size="sm"
                title={toTitleCase(unslugify(subcategory))}
                description={`Buy the best ${unslugify(subcategory)}`}
            />

            <Products
                products={productsTransaction.items}
                pageCount={pageCount}
                stores={storesTransaction.items}
                storePageCount={storePageCount}
            />
        </Shell>
    );
}
