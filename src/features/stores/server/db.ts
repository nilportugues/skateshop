import { db } from '@/lib/server/db';
import { desc, eq, sql } from 'drizzle-orm';
import { products, stores } from 'drizzle/schema';

export async function findStoryById({ storeId }: { storeId: number }) {
    return await db.query.stores.findFirst({
        columns: {
            id: true,
            name: true,
        },
        where: eq(stores.id, storeId),
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
    .orderBy(desc(stores.active), desc(sql<number> `count(*)`));
}