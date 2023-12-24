'use server';

import { revalidatePath } from 'next/cache';
import { type z } from 'zod';

import {
    cartItemSchema,
    deleteCartItemSchema,
    deleteCartItemsSchema,
} from '@/features/cart/cart.validation';

import {
    addToCartOrIncrementQuantity,
    createCartAndAddItems,
    createNewCartFromClosedCart,
    deleteCart,
    deleteCartItem,
    deleteCartItems,
    updateCartItem,
} from './cart.service';
import { addCartCookie, deleteCartCookie, getCartCookie } from './cookies';
import { findCartById } from './db';

export async function addToCartAction(
    rawInput: z.infer<typeof cartItemSchema>,
) {
    const cartId = getCartCookie();

    // If cart doesn't exist, create one and add item.
    if (!cartId) {
        const cart = await createCartAndAddItems({ rawInput });
        addCartCookie({ cartId: cart.insertId });
        revalidatePath('/');
        return;
    }

    const cart = await findCartById({ cartId });

    // If cart doesn't exist but we have the cartId cookie, clean up.
    if (!cart) {
        try {
            await deleteCart({ cartId });
        } finally {
            deleteCartCookie();
        }
        return;
    }

    // If cart is closed, delete it and create a new one
    if (cart.closed) {
        const newCart = await createNewCartFromClosedCart({ cartId, rawInput });
        addCartCookie({ cartId: newCart.insertId });
        revalidatePath('/');
        return;
    }

    // If cart exists, add item to cart or increment quantity
    await addToCartOrIncrementQuantity({ cartId, rawInput });
    revalidatePath('/');
    return;
}

export async function updateCartItemAction(
    rawInput: z.infer<typeof cartItemSchema>,
) {
    const cartId = getCartCookie();
    await updateCartItem({ cartId, rawInput });
    revalidatePath('/');
}

export async function deleteCartAction() {
    const cartId = getCartCookie();
    await deleteCart({ cartId });
}

export async function deleteCartItemAction(
    rawInput: z.infer<typeof deleteCartItemSchema>,
) {
    const cartId = getCartCookie();
    await deleteCartItem({ cartId, rawInput });
    revalidatePath('/');
}

export async function deleteCartItemsAction(
    rawInput: z.infer<typeof deleteCartItemsSchema>,
) {
    const cartId = getCartCookie();
    await deleteCartItems({ cartId, rawInput });
    revalidatePath('/');
}
