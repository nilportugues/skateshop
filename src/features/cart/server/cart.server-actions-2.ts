import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';

import { db } from '@/db';
import { carts, products, stores } from '@/db/schema';
import type { CartLineItem } from '@/types';

import { getCartCookie } from './cookies';
import { findCartById } from './db';

export async function getCart(input?: {
    storeId: number;
}): Promise<CartLineItem[]> {
    const cartId = getCartCookie();

    //--service logic
    if (!cartId || isNaN(Number(cartId))) return [];
    const cart = await findCartById({ cartId: String(cartId) });

    const productIds = cart?.items?.map((item) => item.productId) ?? [];
    if (productIds.length === 0) return [];

    const uniqueProductIds = [...new Set(productIds)];

    const cartLineItems = await db
        .select({
            id: products.id,
            name: products.name,
            images: products.images,
            category: products.category,
            subcategory: products.subcategory,
            price: products.price,
            inventory: products.inventory,
            storeId: products.storeId,
            storeName: stores.name,
            storeStripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .leftJoin(stores, eq(stores.id, products.storeId))
        .where(
            and(
                inArray(products.id, uniqueProductIds),
                input?.storeId
                    ? eq(products.storeId, input.storeId)
                    : undefined,
            ),
        )
        .groupBy(products.id)
        .orderBy(desc(stores.stripeAccountId), asc(products.createdAt))
        .execute()
        .then((items) => {
            return items.map((item) => {
                const quantity = cart?.items?.find(
                    (cartItem) => cartItem.productId === item.id,
                )?.quantity;

                return {
                    ...item,
                    quantity: quantity ?? 0,
                };
            });
        });

    return cartLineItems;
    //-end serivce logic
}

export async function getUniqueStoreIds() {
    const cartId = getCartCookie();

    //--service logic
    if (!cartId || isNaN(Number(cartId))) return [];

    try {
        //findStoreIdsByCartId
        const cart = await db
            .selectDistinct({ storeId: products.storeId })
            .from(carts)
            .leftJoin(
                products,
                sql`JSON_CONTAINS(carts.items, JSON_OBJECT('productId', products.id))`,
            )
            .groupBy(products.storeId)
            .where(eq(carts.id, Number(cartId)));

        const storeIds = cart
            .map((item) => Number(item.storeId))
            .filter((id) => id);

        return storeIds;
    } catch (err) {
        console.error(err);
        return [];
    }
    //-end serivce logic
}

export async function getCartItems(input: { cartId?: number }) {
    if (!input.cartId || isNaN(input.cartId)) return [];

    try {
        const cart = await findCartById({ cartId: String(input.cartId) });
        return cart?.items;
    } catch (err) {
        console.error(err);
        return [];
    }
}
