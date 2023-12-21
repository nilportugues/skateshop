import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findStoryById({storeId}: {storeId: number}) {
    return await db.query.stores.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: eq(stores.id, storeId),
    })
  }