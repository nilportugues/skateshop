'use server';

import { currentUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { type z } from 'zod';

import { calculateOrderAmount } from '@/features/stripe/client/utils/checkout';
import { stripe } from '@/features/stripe/server/libs/stripe';
import { getStripeAccount } from '@/features/stripe/server/stripe.services';
import {
    createPaymentIntentSchema,
    getStripeAccountSchema,
    manageSubscriptionSchema,
} from '@/features/stripe/stripe.validation';

import { absoluteUrl, getUserEmail } from '@/libs/client/utils';
import { db } from '@/libs/server/db';
import { carts, payments } from '@/libs/server/db/schema';
import type { CheckoutItem } from '@/types';

// Managing stripe subscriptions for a user
export async function manageSubscription(
    rawInput: z.infer<typeof manageSubscriptionSchema>,
) {
    const input = manageSubscriptionSchema.parse(rawInput);

    const billingUrl = absoluteUrl('/dashboard/billing');

    const user = await currentUser();

    if (!user) {
        throw new Error('User not found.');
    }

    const email = getUserEmail(user);

    // If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
    if (input.isSubscribed && input.stripeCustomerId && input.isCurrentPlan) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: input.stripeCustomerId,
            return_url: billingUrl,
        });

        return {
            url: stripeSession.url,
        };
    }

    // If the user is not subscribed to a plan, we create a Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'auto',
        customer_email: email,
        line_items: [
            {
                price: input.stripePriceId,
                quantity: 1,
            },
        ],
        metadata: {
            userId: user.id,
        },
    });

    return {
        url: stripeSession.url,
    };
}

// Connecting a Stripe account to a store
export async function createAccountLink(
    rawInput: z.infer<typeof getStripeAccountSchema>,
) {
    const input = getStripeAccountSchema.parse(rawInput);

    const { isConnected, payment, account } = await getStripeAccount(input);

    if (isConnected) {
        throw new Error('Store already connected to Stripe.');
    }

    // Delete the existing account if details have not been submitted
    if (account && !account.details_submitted) {
        await stripe.accounts.del(account.id);
    }

    const stripeAccountId =
        payment?.stripeAccountId ?? (await createStripeAccount());

    const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: absoluteUrl(`/dashboard/stores/${input.storeId}`),
        return_url: absoluteUrl(`/dashboard/stores/${input.storeId}`),
        type: 'account_onboarding',
    });

    if (!accountLink?.url) {
        throw new Error(
            'Error creating Stripe account link, please try again.',
        );
    }

    return { url: accountLink.url };

    async function createStripeAccount(): Promise<string> {
        const account = await stripe.accounts.create({ type: 'standard' });

        if (!account) {
            throw new Error('Error creating Stripe account.');
        }

        // If payment record exists, we update it with the new account id
        if (payment) {
            await db.update(payments).set({
                stripeAccountId: account.id,
            });
        } else {
            await db.insert(payments).values({
                storeId: input.storeId,
                stripeAccountId: account.id,
            });
        }

        return account.id;
    }
}

// Modified from: https://github.com/jackblatch/OneStopShop/blob/main/server-actions/stripe/payment.ts
// Creating a payment intent for a store
export async function createPaymentIntent(
    rawInput: z.infer<typeof createPaymentIntentSchema>,
): Promise<{ clientSecret: string | null }> {
    try {
        const input = createPaymentIntentSchema.parse(rawInput);

        const { isConnected, payment } = await getStripeAccount(input);

        if (!isConnected || !payment) {
            throw new Error('Store not connected to Stripe.');
        }

        if (!payment.stripeAccountId) {
            throw new Error('Stripe account not found.');
        }

        const cartId = Number(cookies().get('cartId')?.value);

        const checkoutItems: CheckoutItem[] = input.items.map((item) => ({
            productId: item.id,
            price: Number(item.price),
            quantity: item.quantity,
        }));

        const metadata = {
            cartId: isNaN(cartId) ? '' : cartId,
            // Stripe metadata values must be within 500 characters string
            items: JSON.stringify(checkoutItems),
        };

        const { total, fee } = calculateOrderAmount(input.items);

        // Update the cart with the payment intent id and client secret if it exists
        // if (!isNaN(cartId)) {
        //   const cart = await db.query.carts.findFirst({
        //     columns: {
        //       paymentIntentId: true,
        //       clientSecret: true,
        //     },
        //     where: eq(carts.id, cartId),
        //   })

        //   if (cart?.clientSecret && cart.paymentIntentId) {
        //     await stripe.paymentIntents.update(
        //       cart.paymentIntentId,
        //       {
        //         amount: total,
        //         application_fee_amount: fee,
        //         metadata,
        //       },
        //       {
        //         stripeAccount: payment.stripeAccountId,
        //       }
        //     )
        //     return { clientSecret: cart.clientSecret }
        //   }
        // }

        // Create a payment intent if it doesn't exist
        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount: total,
                application_fee_amount: fee,
                currency: 'usd',
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            },
            {
                stripeAccount: payment.stripeAccountId,
            },
        );

        // Update the cart with the payment intent id and client secret
        if (paymentIntent.status === 'requires_payment_method') {
            await db
                .update(carts)
                .set({
                    paymentIntentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                })
                .where(eq(carts.id, cartId));
        }

        return {
            clientSecret: paymentIntent.client_secret,
        };
    } catch (err) {
        console.error(err);
        return {
            clientSecret: null,
        };
    }
}
