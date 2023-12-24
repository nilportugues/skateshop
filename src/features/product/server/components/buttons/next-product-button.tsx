'use client';

import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import * as React from 'react';
import { toast } from 'sonner';

import { getNextProductId } from '@/features/product/server/product';

import { Button } from '@/components/ui/button';
import { Product } from '@/db/schema';

export async function NextProductButton({ product }: { product: Product }) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => {
                startTransition(async () => {
                    'use server';
                    try {
                        const nextProductId = await getNextProductId({
                            id: product.id,
                            storeId: product.storeId,
                        });
                        router.push(
                            `/dashboard/stores/${product.storeId}/products/${nextProductId}`,
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
