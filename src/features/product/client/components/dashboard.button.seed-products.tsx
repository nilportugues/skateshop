'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { seedProducts } from '@/features/product/server/product.server-actions';

import { cn } from '@/lib/client/utils';

import { Icons } from '@/components/icons';
import { Button, type ButtonProps } from '@/components/ui/button';

interface SeedProductsProps extends ButtonProps {
    storeId: number;
    count?: number;
}

export function SeedProducts({
    storeId,
    count,
    className,
    ...props
}: SeedProductsProps) {
    const [isPending, startTransition] = React.useTransition();

    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    return (
        <Button
            className={cn(className)}
            size="sm"
            onClick={() => {
                startTransition(async () => {
                    await seedProducts({
                        storeId,
                        count,
                    });
                    toast.success('Products seeded successfully.');
                });
            }}
            {...props}
            disabled={isPending}
        >
            {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            (Dev-only) Seed products
        </Button>
    );
}
