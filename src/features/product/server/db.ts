import { and, desc, eq, not, sql } from 'drizzle-orm';
import { stores } from 'drizzle/schema';

import { db } from '@/libs/server/db';
import { products } from '@/libs/server/db/schema';

export async function findProductById({ productId }: { productId: number }) {
    return await db.query.products.findFirst({
        columns: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            category: true,
            inventory: true,
            rating: true,
            storeId: true,
        },
        where: eq(products.id, productId),
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
