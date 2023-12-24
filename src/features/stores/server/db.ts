import { and, desc, eq, sql } from 'drizzle-orm';
import { products, stores } from 'drizzle/schema';

import { db } from '@/libs/server/db';

export async function findStoryById({ storeId }: { storeId: number }) {
    return await db.query.stores.findFirst({
        where: eq(stores.id, storeId),
    });
}
export async function findStoryByIdAndProductId({
    productId,
    storeId,
}: {
    productId: number;
    storeId: number;
}) {
    return await db.query.stores.findFirst({
        where: and(eq(products.id, productId), eq(products.storeId, storeId)),
    });
}

export async function getAllStoresIdsWithProducts() {
    return db
        .select({
            id: stores.id,
        })
        .from(stores)
        .leftJoin(products, eq(products.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(stores.active), desc(sql<number>`count(*)`));
}

export type GetStoresByUserId = {
    id: number;
    name: string;
    description: null | string;
    stripeAccountId: null | string;
};

export async function getStoresByUserId({
    userId,
}: {
    userId: string;
}): Promise<GetStoresByUserId[]> {
    return db
        .select({
            id: stores.id,
            name: stores.name,
            description: stores.description,
            stripeAccountId: stores.stripeAccountId,
        })
        .from(stores)
        .leftJoin(products, eq(products.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(stores.stripeAccountId), desc(sql<number>`count(*)`))
        .where(eq(stores.userId, userId));
}
