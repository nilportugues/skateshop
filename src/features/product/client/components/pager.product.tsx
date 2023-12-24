'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import {
    getNextProductId,
    getPreviousProductId,
} from '@/features/product/server/product';

import { Button } from '@/components/ui/button';
import { type Product } from '@/db/schema';

import { NextProductButton } from '../../server/components/buttons/next-product-button';

interface ProductPagerProps {
    product: Product;
}

function PreviousProductButton({ product }: { product: Product }) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => {
                startTransition(async () => {
                    try {
                        const prevProductId = await getPreviousProductId({
                            id: product.id,
                            storeId: product.storeId,
                        });
                        router.push(
                            `/dashboard/stores/${product.storeId}/products/${prevProductId}`,
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

export function ProductPager({ product }: ProductPagerProps) {
    return (
        <div className="flex space-x-0.5">
            <PreviousProductButton product={product} />
            <NextProductButton product={product} />
        </div>
    );
}
