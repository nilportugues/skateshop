import { eq } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { stores } from '@/lib/server/db/schema';

export async function findStoryById({ storeId }: { storeId: number }) {
    return await db.query.stores.findFirst({
        columns: {
            id: true,
            name: true,
        },
        where: eq(stores.id, storeId),
    });
}
