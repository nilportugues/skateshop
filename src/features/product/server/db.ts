import { and, desc, eq, not } from 'drizzle-orm';

import { db } from '@/db';
import { products } from '@/db/schema';

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
