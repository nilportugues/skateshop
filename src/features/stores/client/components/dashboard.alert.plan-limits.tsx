import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DashboardAlertPlanLimits({
    subscriptionPlanName,
    maxProductCount,
    maxStoreCount,
}: {
    subscriptionPlanName?: string;
    maxProductCount: number;
    maxStoreCount: number;
}) {
    return (
        <Alert>
            <RocketIcon className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                You are currently on the{' '}
                <span className="font-semibold">{subscriptionPlanName}</span>{' '}
                plan. You can create up to{' '}
                <span className="font-semibold">{maxStoreCount}</span> stores
                and <span className="font-semibold">{maxProductCount}</span>{' '}
                products on this plan.
            </AlertDescription>
        </Alert>
    );
}
