import { and, desc, eq, not, sql } from 'drizzle-orm';
import { stores } from 'drizzle/schema';

import { db } from '@/libs/server/db';
import { products } from '@/libs/server/db/schema';
import { Category } from '@/types';

export async function findProductById({ productId }: { productId: number }) {
    return await db.query.products.findFirst({
        where: eq(products.id, productId),
    });
}

export async function findProductByIdAndStoreId({
    productId,
    storeId,
}: {
    productId: number;
    storeId: number;
}) {
    return await db.query.products.findFirst({
        where: and(eq(products.id, productId), eq(products.storeId, storeId)),
    });
}

export async function findRelatedProductsByProductId({
    amount,
    productId,
    storeId,
}: {
    amount: number;
    productId: number;
    storeId: number;
}) {
    return (
        (await db
            .select({
                id: products.id,
                name: products.name,
                price: products.price,
                images: products.images,
                category: products.category,
                inventory: products.inventory,
                rating: products.rating,
            })
            .from(products)
            .limit(amount)
            .where(
                and(
                    eq(products.storeId, storeId),
                    not(eq(products.id, productId)),
                ),
            )
            .orderBy(desc(products.inventory))) ?? []
    );
}

export async function getAllProductsFromStoresWithStripeAccounts() {
    return await db
        .select({
            id: products.id,
        })
        .from(products)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .groupBy(products.id)
        .orderBy(
            desc(sql<number>`count(${stores.stripeAccountId})`),
            desc(sql<number>`count(${products.images})`),
            desc(products.createdAt),
        );
}

export async function getProductCategoryCount({
    name,
}: {
    name: Category['title'];
}) {
    return await db
        .select({
            count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(products)
        .where(eq(products.category, name))
        .execute()
        .then((res) => res[0]?.count ?? 0)
        .catch(() => 0);
}
