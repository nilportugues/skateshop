'use client';

import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { NextProductButton } from '../../server/components/buttons/next-product-button';

interface ProductPagerProps {
    storeId: number;
    nextProductId?: number;
    prevProductId?: number;
}

function PreviousProductButton({
    prevProductId,
    storeId,
}: {
    prevProductId?: number;
    storeId: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    return (
        <Button
            
            variant="ghost"
            size="icon"
            onClick={() => {
                startTransition(async () => {
                    try {
                        router.push(
                            `/dashboard/stores/${storeId}/products/${prevProductId}`,
                        );
                    } catch (error) {
                        error instanceof Error
                            ? toast.error(error.message)
                            : toast.error(
                                  'Something went wrong, please try again.',
                              );
                    }
                });
            }}
            disabled={isPending}
        >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Previous product</span>
        </Button>
    );
}

export function ProductPager({
    storeId,
    prevProductId,
    nextProductId,
}: ProductPagerProps) {
    return (
        <div className="flex space-x-0.5">
            {prevProductId && (
                <PreviousProductButton {...{ storeId, prevProductId }} />
            )}
            {nextProductId && (
                <NextProductButton {...{ storeId, nextProductId }} />
            )}
        </div>
    );
}
