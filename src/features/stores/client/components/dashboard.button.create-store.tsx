import Link from 'next/link';

import { getDashboardRedirectPath } from '@/features/stripe/client/utils/subscription';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/libs/client/utils';
import { UserSubscriptionPlan } from '@/types';

export function DashboardCreateStoreButton({
    storeCount,
    subscriptionPlan,
}: {
    storeCount: number;
    subscriptionPlan: UserSubscriptionPlan | null;
}) {
    return (
        <Link
            aria-label="Create store"
            href={getDashboardRedirectPath({
                storeCount: storeCount,
                subscriptionPlan: subscriptionPlan,
            })}
            className={cn(
                buttonVariants({
                    size: 'sm',
                }),
            )}
        >
            Create store
        </Link>
    );
}
