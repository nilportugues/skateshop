import { getAllProductsFromStoresWithStripeAccounts } from '@/features/product/server/db';

import { getAllStoresIdsWithProducts } from '@/features/stores/server/db';

import { absoluteUrl } from '@/lib/client/utils';

export async function buildAllStoreUrls() {
    const allStores = await getAllStoresIdsWithProducts();
    const storesRoutes = allStores.map((store) => ({
        url: absoluteUrl(`/products?store_ids=${store.id}`),
        lastModified: new Date().toISOString(),
    }));
    return storesRoutes;
}

export async function buildAllProductUrls() {
    const allProducts = await getAllProductsFromStoresWithStripeAccounts();
    const productsRoutes = allProducts.map((product) => ({
        url: absoluteUrl(`/product/${product.id}`),
        lastModified: new Date().toISOString(),
    }));
    return productsRoutes;
}
