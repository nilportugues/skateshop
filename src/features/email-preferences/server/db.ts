import { db } from "@/db";
import { eq } from "drizzle-orm";
import { emailPreferences } from "@/db/schema"

export async function getEmailPreferencesByToken({token}: {token: string}) {
    return await db.query.emailPreferences.findFirst({
      where: eq(emailPreferences.token, token),
    })
  }