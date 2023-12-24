import { eq } from 'drizzle-orm';

import { db } from '@/libs/server/db';
import { emailPreferences } from '@/libs/server/db/schema';

export async function getEmailPreferencesByToken({ token }: { token: string }) {
    return await db.query.emailPreferences.findFirst({
        where: eq(emailPreferences.token, token),
    });
}
