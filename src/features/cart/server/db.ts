import { db } from "@/db"
import { carts } from "@/db/schema"
import { eq } from "drizzle-orm"


export async function deleteCartById({cartId}: {cartId: string}) {
    await db.delete(carts).where(eq(carts.id, Number(cartId)))
  }
  
  export async function findCartById({cartId}: {cartId: string}) {
    return await db.query.carts.findFirst({
      where: eq(carts.id, Number(cartId)),
    })
  }

export async function updateCartItemsById({cartId, items}: {cartId: string, items: any[]}) {
    return await db
    .update(carts)
    .set({
      items: items,
    })
    .where(eq(carts.id, Number(cartId)))
}  