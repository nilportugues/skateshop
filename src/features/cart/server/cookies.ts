import { cookies } from 'next/headers';

export function getCartCookie() {
    const cookieStore = cookies();
    const cartId = cookieStore.get('cartId')?.value;
    return cartId;
}

export function addCartCookie({ cartId }: { cartId: number | string }) {
    const cookieStore = cookies();
    // Note: .set() is only available in a Server Action or Route Handler
    cookieStore.set('cartId', String(cartId));
}

export function deleteCartCookie() {
    const cookieStore = cookies();
    cookieStore.set({
        name: 'cartId',
        value: '',
        expires: new Date(0),
    });
}
