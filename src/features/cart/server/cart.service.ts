import { type z } from 'zod';

import {
    cartItemSchema,
    deleteCartItemSchema,
    deleteCartItemsSchema,
} from '@/features/cart/cart.validation';
import {
    deleteCartById,
    findCartById,
    updateCartItemsById,
} from '@/features/cart/server/db';

import { findProductById } from '@/features/product/server/db';

import { db } from '@/libs/server/db';
import { carts } from '@/libs/server/db/schema';

export async function updateCartItem({
    cartId,
    rawInput,
}: {
    cartId?: string;
    rawInput: z.infer<typeof cartItemSchema>;
}) {
    const input = cartItemSchema.parse(rawInput);

    if (!cartId) {
        throw new Error('cartId not found, please try again.');
    }

    if (isNaN(Number(cartId))) {
        throw new Error('Invalid cartId, please try again.');
    }

    const cart = await findCartById({ cartId });
    if (!cart) {
        throw new Error('Cart not found, please try again.');
    }

    const cartItem = cart.items?.find(
        (item) => item.productId === input.productId,
    );

    if (!cartItem) {
        throw new Error('CartItem not found, please try again.');
    }

    if (input.quantity === 0) {
        cart.items =
            cart.items?.filter((item) => item.productId !== input.productId) ??
            [];
    } else {
        cartItem.quantity = input.quantity;
    }

    await updateCartItemsById({ cartId, items: cart.items ?? [] });
}

export async function deleteCart({ cartId }: { cartId?: string }) {
    try {
        if (!cartId) {
            throw new Error('cartId not found, please try again.');
        }

        if (isNaN(Number(cartId))) {
            throw new Error('Invalid cartId, please try again.');
        }
    } finally {
        // Run the query always to ensure clean up
        await deleteCartById({ cartId: cartId ?? '-1' });
    }
}

export async function deleteCartItem({
    cartId,
    rawInput,
}: {
    cartId?: string;
    rawInput: z.infer<typeof deleteCartItemSchema>;
}) {
    const input = deleteCartItemSchema.parse(rawInput);

    if (!cartId) {
        throw new Error('cartId not found, please try again.');
    }

    if (isNaN(Number(cartId))) {
        throw new Error('Invalid cartId, please try again.');
    }

    const cart = await findCartById({ cartId });
    if (!cart) return;

    cart.items =
        cart.items?.filter((item) => item.productId !== input.productId) ?? [];
    await updateCartItemsById({ cartId, items: cart.items ?? [] });
}

export async function deleteCartItems({
    cartId,
    rawInput,
}: {
    cartId?: string;
    rawInput: z.infer<typeof deleteCartItemsSchema>;
}) {
    if (!cartId) {
        throw new Error('cartId not found, please try again.');
    }

    if (isNaN(Number(cartId))) {
        throw new Error('Invalid cartId, please try again.');
    }

    const cart = await findCartById({ cartId });
    if (!cart) return;

    const input = deleteCartItemsSchema.parse(rawInput);
    cart.items =
        cart.items?.filter(
            (item) => !input.productIds.includes(item.productId),
        ) ?? [];

    await updateCartItemsById({ cartId, items: cart.items ?? [] });
}

export async function createNewCartFromClosedCart({
    cartId,
    rawInput,
}: {
    cartId: string;
    rawInput: z.infer<typeof cartItemSchema>;
}) {
    const input = cartItemSchema.parse(rawInput);

    const product = await findProductById({ productId: input.productId });
    if (!product) {
        throw new Error('Product not found, please try again.');
    }

    if (product.inventory < input.quantity) {
        throw new Error('Product is out of stock, please try again later.');
    }

    await deleteCartById({ cartId });
    const newCart = await db.insert(carts).values({
        items: [input],
    });
    return newCart;
}

export async function addToCartOrIncrementQuantity({
    cartId,
    rawInput,
}: {
    cartId: string;
    rawInput: z.infer<typeof cartItemSchema>;
}) {
    const input = cartItemSchema.parse(rawInput);

    const product = await findProductById({ productId: input.productId });
    if (!product) {
        throw new Error('Product not found, please try again.');
    }

    if (product.inventory < input.quantity) {
        throw new Error('Product is out of stock, please try again later.');
    }

    const cart = await findCartById({ cartId });
    if (!cart) return;

    const cartItem = cart.items?.find(
        (item) => item.productId === input.productId,
    );

    if (cartItem) {
        cartItem.quantity += input.quantity;
    } else {
        cart.items?.push(input);
    }

    await updateCartItemsById({ cartId, items: cart.items ?? [] });
}

export async function createCartAndAddItems({
    rawInput,
}: {
    rawInput: z.infer<typeof cartItemSchema>;
}) {
    const input = cartItemSchema.parse(rawInput);

    const product = await findProductById({ productId: input.productId });
    if (!product) {
        throw new Error('Product not found, please try again.');
    }

    if (product.inventory < input.quantity) {
        throw new Error('Product is out of stock, please try again later.');
    }

    const cart = await db.insert(carts).values({
        items: [input],
    });

    return cart;
}
