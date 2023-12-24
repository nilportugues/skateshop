'use client';

import * as React from 'react';

import { createAccountLink } from '@/features/stripe/server/stripe.server-actions';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { catchError } from '@/libs/client/utils';

interface ConnectToStripeButtonProps {
    storeId: number;
}

export function ConnectStoreToStripeButton({
    storeId,
}: ConnectToStripeButtonProps) {
    const [isPending, startTransaction] = React.useTransition();

    return (
        <Button
            aria-label="Connect to Stripe"
            onClick={() => {
                startTransaction(async () => {
                    try {
                        const connection = await createAccountLink({ storeId });
                        window.location.href = connection.url;
                    } catch (err) {
                        catchError(err);
                    }
                });
            }}
            disabled={isPending}
        >
            {isPending && (
                <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                />
            )}
            Connect to Stripe
        </Button>
    );
}
