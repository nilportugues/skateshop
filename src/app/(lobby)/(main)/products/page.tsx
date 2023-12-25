import { type Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

import { Products } from '@/features/product/client/components/dashboard.products';
import { getProducts } from '@/features/product/server/product';

import { getStores } from '@/features/stores/store';

import { PageHeaderBlock } from '@/components/page-header.block';
import { Shell } from '@/components/shells/shell';
import { env } from '@/env.mjs';
import { products } from '@/libs/server/db/schema';
import { productsSearchParamsSchema } from '@/libs/server/params.validations';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Products',
    description: 'Buy products from our stores',
};

interface ProductsPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const {
        page,
        per_page,
        sort,
        categories,
        subcategories,
        price_range,
        store_ids,
        store_page,
        active,
    } = productsSearchParamsSchema.parse(searchParams);

    // Products transaction
    const pageAsNumber = Number(page);
    const fallbackPage =
        isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
    const perPageAsNumber = Number(per_page);
    // Number of items per page
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
    // Number of items to skip
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

    noStore();
    const productsTransaction = await getProducts({
        limit,
        offset,
        sort,
        categories,
        subcategories,
        price_range,
        store_ids,
        active,
    });

    const pageCount = Math.ceil(productsTransaction?.count / limit);

    // Stores transaction
    const storesPageAsNumber = Number(store_page);
    const fallbackStoresPage =
        isNaN(storesPageAsNumber) || storesPageAsNumber < 1
            ? 1
            : storesPageAsNumber;
    const storesLimit = 40;
    const storesOffset =
        fallbackStoresPage > 0 ? (fallbackStoresPage - 1) * storesLimit : 0;

    noStore();
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
                title="Products"
                description="Buy products from our stores"
            />

            <Products
                products={productsTransaction.items}
                pageCount={pageCount}
                categories={Object.values(products.category.enumValues)}
                stores={storesTransaction.items}
                storePageCount={storePageCount}
            />
        </Shell>
    );
}
