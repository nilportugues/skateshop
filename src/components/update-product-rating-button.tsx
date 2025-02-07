'use client';

import { HeartIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { toast } from 'sonner';

import { updateProductRating } from '@/features/product/server/product.server-actions';

import { Icons } from '@/components/icons';
import { Button, type ButtonProps } from '@/components/ui/button';
import { catchError, cn } from '@/libs/client/utils';

interface UpdateProductRatingButtonProps extends ButtonProps {
    productId: number;
    rating: number;
}

export function UpdateProductRatingButton({
    productId,
    rating,
    className,
    ...props
}: UpdateProductRatingButtonProps) {
    const [isFavoriting, startFavoriting] = React.useTransition();

    return (
        <Button
            title="Favorite"
            variant="secondary"
            size="icon"
            className={cn('h-8 w-8 shrink-0', className)}
            onClick={() => {
                startFavoriting(async () => {
                    try {
                        await updateProductRating({
                            id: productId,
                            rating: rating + 1,
                        });
                        toast.success('Favorited product.');
                    } catch (err) {
                        catchError(err);
                    }
                });
            }}
            disabled={isFavoriting}
            {...props}
        >
            {isFavoriting ? (
                <Icons.spinner
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                />
            ) : (
                <HeartIcon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">Favorite</span>
        </Button>
    );
}
