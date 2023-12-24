import { currentUser } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import * as React from 'react';

import { DashboardAlertPlanLimits } from '@/features/stores/client/components/dashboard.alert.plan-limits';
import { DashboardCreateStoreButton } from '@/features/stores/client/components/dashboard.button.create-store';
import { DashboardUserStoreList } from '@/features/stores/client/components/dashboard.list.store-list';
import { getStoresByUserId } from '@/features/stores/server/db';

import { getPlanFeatures } from '@/features/stripe/client/utils/subscription';
import { getSubscriptionPlan } from '@/features/stripe/server/stripe.services';

import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from '@/components/page-header';
import { Shell } from '@/components/shells/shell';
import { env } from '@/env.mjs';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Stores',
    description: 'Manage your stores',
};

export default async function StoresPage() {
    const user = await currentUser();
    if (!user) {
        redirect('/signin');
    }

    const allStores = await getStoresByUserId({ userId: user.id });
    const subscriptionPlan = await getSubscriptionPlan(user.id);

    const { maxStoreCount, maxProductCount } = getPlanFeatures(
        subscriptionPlan?.id,
    );

    return (
        <Shell variant="sidebar">
            <PageHeader>
                <div className="flex space-x-4">
                    <PageHeaderHeading size="sm" className="flex-1">
                        Stores
                    </PageHeaderHeading>
                    <DashboardCreateStoreButton
                        {...{ storeCount: allStores.length, subscriptionPlan }}
                    />
                </div>
                <PageHeaderDescription size="sm">
                    Manage your stores
                </PageHeaderDescription>
            </PageHeader>

            <DashboardAlertPlanLimits
                maxProductCount={Number(maxProductCount)}
                maxStoreCount={Number(maxStoreCount)}
                subscriptionPlanName={subscriptionPlan?.name}
            />

            <DashboardUserStoreList allStores={allStores} />
        </Shell>
    );
}
