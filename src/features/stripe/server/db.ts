import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { orders } from "drizzle/schema";

export async function findOrderById({orderId}: {orderId: number}) {
    return  db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.id, orderId)),
    })
  }