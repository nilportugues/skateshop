"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { carts } from "@/db/schema"
import { type z } from "zod"

import {
  cartItemSchema,
  deleteCartItemSchema,
  deleteCartItemsSchema,
} from "@/features/cart/cart.validation"
import { deleteCartById, findCartById, updateCartItemsById } from "./db"
import { addCartCookie, deleteCartCookie, getCartCookie } from "./cookies"
import { findProductById } from "@/features/product/server/db"

export async function addToCart(rawInput: z.infer<typeof cartItemSchema>) {
  const input = cartItemSchema.parse(rawInput)

  const product = await findProductById({productId: input.productId})
  if (!product) {
    throw new Error("Product not found, please try again.")
  }

  if (product.inventory < input.quantity) {
    throw new Error("Product is out of stock, please try again later.")
  }

  const cartId = getCartCookie();
  if (!cartId) {
    const cart = await db.insert(carts).values({
      items: [input],
    })

    addCartCookie({cartId: cart.insertId})
    revalidatePath("/")
    return
  }

  const cart = await findCartById({cartId})
  if (!cart) {
    deleteCartCookie();
    await deleteCartById({cartId})
    throw new Error("Cart not found, please try again.")
  }

  // If cart is closed, delete it and create a new one
  if (cart.closed) {
    await deleteCartById({cartId})    

    const newCart = await db.insert(carts).values({
      items: [input],
    })

    addCartCookie({cartId: newCart.insertId})
    revalidatePath("/")
    return
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  )

  if (cartItem) {
    cartItem.quantity += input.quantity
  } else {
    cart.items?.push(input)
  }

  await updateCartItemsById({cartId, items: cart.items ?? []});
  revalidatePath("/")
}


export async function updateCartItem(rawInput: z.infer<typeof cartItemSchema>) {
  const input = cartItemSchema.parse(rawInput)

  const cartId = getCartCookie()
  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.")
  }

  const cart = await findCartById({cartId})
  if (!cart) {
    throw new Error("Cart not found, please try again.")
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  )

  if (!cartItem) {
    throw new Error("CartItem not found, please try again.")
  }

  if (input.quantity === 0) {
    cart.items =
      cart.items?.filter((item) => item.productId !== input.productId) ?? []
  } else {
    cartItem.quantity = input.quantity
  }

  await updateCartItemsById({cartId, items: cart.items ?? []});
  revalidatePath("/")
}

export async function deleteCart() {
  const cartId = getCartCookie();
  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.")
  }

  await deleteCartById({cartId})
}

export async function deleteCartItem(
  rawInput: z.infer<typeof deleteCartItemSchema>
) {
  const input = deleteCartItemSchema.parse(rawInput)

  const cartId = getCartCookie();
  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.")
  }

  const cart = await findCartById({cartId})
  if (!cart) return
  
  cart.items = cart.items?.filter((item) => item.productId !== input.productId) ?? []
  await updateCartItemsById({cartId, items: cart.items ?? []});

  revalidatePath("/")
}

export async function deleteCartItems(
  rawInput: z.infer<typeof deleteCartItemsSchema>
) {
  const input = deleteCartItemsSchema.parse(rawInput)

  const cartId = getCartCookie();
  if (!cartId) {
    throw new Error("cartId not found, please try again.")
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.")
  }

  const cart = await findCartById({cartId})
  if (!cart) return

  cart.items = cart.items?.filter((item) => !input.productIds.includes(item.productId)) ?? []
  await updateCartItemsById({cartId, items: cart.items ?? []});

  revalidatePath("/")
}
