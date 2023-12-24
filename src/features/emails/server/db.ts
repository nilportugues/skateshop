import { eq } from 'drizzle-orm';

import { db } from '@/lib/server/db';
import { emailPreferences } from '@/lib/server/db/schema';

export async function getEmailPreferencesByToken({ token }: { token: string }) {
    return await db.query.emailPreferences.findFirst({
        where: eq(emailPreferences.token, token),
    });
}
