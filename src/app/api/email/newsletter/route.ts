import { currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { joinNewsletterSchema } from '@/features/emails/email.validation';
import NewsletterWelcomeEmail from '@/features/emails/templates/newsletter-welcome-email';

import { db } from '@/lib/server/db';
import { emailPreferences } from '@/lib/server/db/schema';
import { resend } from '@/lib/server/resend';

import { env } from '@/env.mjs';

export async function POST(req: Request) {
    const input = joinNewsletterSchema.parse(await req.json());

    try {
        const emailPreference = await db.query.emailPreferences.findFirst({
            where: eq(emailPreferences.email, input.email),
        });

        if (emailPreference?.newsletter) {
            return new Response(
                'You are already subscribed to the newsletter.',
                {
                    status: 409,
                },
            );
        }

        const user = await currentUser();

        const subject = input.subject ?? 'Welcome to our newsletter';

        // If email preference exists, update it and send the email
        if (emailPreference) {
            await db
                .update(emailPreferences)
                .set({
                    newsletter: true,
                })
                .where(eq(emailPreferences.email, input.email));

            await resend.emails.send({
                from: env.EMAIL_FROM_ADDRESS,
                to: input.email,
                subject,
                react: NewsletterWelcomeEmail({
                    firstName: user?.firstName ?? undefined,
                    fromEmail: env.EMAIL_FROM_ADDRESS,
                    token: emailPreference.token,
                }),
            });
        } else {
            // If email preference does not exist, create it and send the email
            await resend.emails.send({
                from: env.EMAIL_FROM_ADDRESS,
                to: input.email,
                subject,
                react: NewsletterWelcomeEmail({
                    firstName: user?.firstName ?? undefined,
                    fromEmail: env.EMAIL_FROM_ADDRESS,
                    token: input.token,
                }),
            });

            await db.insert(emailPreferences).values({
                email: input.email,
                token: input.token,
                userId: user?.id,
                newsletter: true,
            });
        }

        return new Response(null, { status: 200 });
    } catch (err) {
        console.error(err);

        if (err instanceof z.ZodError) {
            return new Response(err.message, { status: 422 });
        }

        if (err instanceof Error) {
            return new Response(err.message, { status: 500 });
        }

        return new Response('Something went wrong', { status: 500 });
    }
}
