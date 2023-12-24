'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function NextProductButton({
    nextProductId,
    storeId,
}: {
    nextProductId?: number;
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
                            `/dashboard/stores/${storeId}/products/${nextProductId}`,
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
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Next product</span>
        </Button>
    );
}
