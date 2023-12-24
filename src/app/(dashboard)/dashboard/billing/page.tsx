import { currentUser } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { BillingInfo } from '@/features/stripe/client/components/dashboard.billing-info';
import { BillingPageHeader } from '@/features/stripe/client/components/dashboard.billing-page-header';
import { SubscriptionPlans } from '@/features/stripe/client/components/dashboard.billing-subscription-plans';
import { getSubscriptionPlan } from '@/features/stripe/server/stripe.services';

import { Shell } from '@/components/shells/shell';
import { env } from '@/env.mjs';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Billing',
    description: 'Manage your billing and subscription',
};

export default async function BillingPage() {
    const user = await currentUser();

    if (!user) {
        redirect('/signin');
    }

    const subscriptionPlan = await getSubscriptionPlan(user.id);

    return (
        <Shell variant="sidebar" as="div">
            <BillingPageHeader />
            <BillingInfo subscriptionPlan={subscriptionPlan} />
            <SubscriptionPlans subscriptionPlan={subscriptionPlan} />
        </Shell>
    );
}
