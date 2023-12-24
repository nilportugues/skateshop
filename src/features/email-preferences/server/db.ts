import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { emailPreferences } from '@/db/schema';

export async function getEmailPreferencesByToken({ token }: { token: string }) {
    return await db.query.emailPreferences.findFirst({
        where: eq(emailPreferences.token, token),
    });
}
