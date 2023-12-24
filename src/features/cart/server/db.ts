import { eq } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { carts } from '@/lib/server/db/schema';

export async function deleteCartById({ cartId }: { cartId: string }) {
    await db.delete(carts).where(eq(carts.id, Number(cartId)));
}

export async function findCartById({ cartId }: { cartId: string }) {
    return await db.query.carts.findFirst({
        columns: {
            items: true,
            closed: true,
            paymentIntentId: true,
            clientSecret: true,
        },
        where: eq(carts.id, Number(cartId)),
    });
}

export async function updateCartItemsById({
    cartId,
    items,
}: {
    cartId: string;
    items: any[];
}) {
    return await db
        .update(carts)
        .set({
            items: items,
        })
        .where(eq(carts.id, Number(cartId)));
}
