import { db } from "@/db";
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm"
import { Order, stores, orders } from "@/db/schema";

export async function findOrderById({orderId}: {orderId: number}) {
    return  db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.id, orderId)),
    })
  }


export type FindOrdersByEmailAndStore = Awaited<typeof findOrdersByEmailAndStore>;

export async function findOrdersByEmailAndStore(
  {email, store, statuses, column, order, limit, offset}:  {email: string, store?: string, statuses: string[], column?: keyof Order, order?: "asc" | "desc", limit: number, offset: number}) {
  const data =  await db
    .select({
      id: orders.id,
      email: orders.email,
      items: orders.items,
      amount: orders.amount,
      status: orders.stripePaymentIntentStatus,
      createdAt: orders.createdAt,
      storeId: orders.storeId,
      store: stores.name,
    })
    .from(orders)
    .leftJoin(stores, eq(orders.storeId, stores.id))
    .limit(limit)
    .offset(offset)
    .where(
      and(
        eq(orders.email, email),
        // Filter by store
        typeof store === "string"
          ? like(stores.name, `%${store}%`)
          : undefined,
        // Filter by status
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
          : undefined
      )
    )
    .orderBy(
      column && column in orders
        ? order === "asc"
          ? asc(orders[column])
          : desc(orders[column])
        : desc(orders.createdAt)
    )

    return data;
}


export async function countOrdersByEmailAndStore({email, store, statuses}: {email: string, store: string | undefined, statuses: string[]}) {
  return await db
    .select({
      count: sql<number> `count(*)`,
    })
    .from(orders)
    .leftJoin(stores, eq(orders.storeId, stores.id))
    .where(
      and(
        eq(orders.email, email),
        // Filter by store
        typeof store === "string"
          ? like(stores.name, `%${store}%`)
          : undefined,
        // Filter by status
        statuses.length > 0
          ? inArray(orders.stripePaymentIntentStatus, statuses)
          : undefined
      )
    )
    .then((res) => res[0]?.count ?? 0)
}
