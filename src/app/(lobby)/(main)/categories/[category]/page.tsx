import type { Metadata } from 'next';

import { Products } from '@/features/product/client/components/dashboard.products';
import { getProducts } from '@/features/product/server/product';

import { getStores } from '@/features/stores/store';

import { PageHeaderBlock } from '@/components/page-header.block';
import { Shell } from '@/components/shells/shell';
import { env } from '@/env.mjs';
import { toTitleCase } from '@/libs/client/utils';
import { type Product } from '@/libs/server/db/schema';
import { productsSearchParamsSchema } from '@/libs/server/params.validations';

interface CategoryPageProps {
    params: {
        category: Product['category'];
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
    return {
        metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
        title: toTitleCase(params.category),
        description: `Buy products from the ${params.category} category`,
    };
}

export default async function CategoryPage({
    params,
    searchParams,
}: CategoryPageProps) {
    const { category } = params;
    const {
        page,
        per_page,
        sort,
        subcategories,
        price_range,
        store_ids,
        store_page,
        active,
    } = productsSearchParamsSchema.parse(searchParams);

    // Products transaction
    const limit = typeof per_page === 'string' ? parseInt(per_page) : 8;
    const offset = typeof page === 'string' ? (parseInt(page) - 1) * limit : 0;

    const productsTransaction = await getProducts({
        limit,
        offset,
        sort: typeof sort === 'string' ? sort : null,
        categories: category,
        subcategories: typeof subcategories === 'string' ? subcategories : null,
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
                title={toTitleCase(category)}
                description={`Buy ${category} from the best stores`}
            />

            <Products
                products={productsTransaction.items}
                pageCount={pageCount}
                category={category}
                stores={storesTransaction.items}
                storePageCount={storePageCount}
            />
        </Shell>
    );
}
