'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '@/lib/client/utils';

import { Icons } from '@/components/icons';
import {
    Button,
    type ButtonProps,
    buttonVariants,
} from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/use-mounted';

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className, variant, size, ...props }, ref) => {
        const { pending } = useFormStatus();
        const mounted = useMounted();

        if (!mounted)
            return (
                <Skeleton
                    className={cn(
                        buttonVariants({ variant, size, className }),
                        'bg-muted text-muted-foreground',
                    )}
                >
                    {children}
                </Skeleton>
            );

        return (
            <Button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={pending}
                {...props}
            >
                {pending && (
                    <Icons.spinner
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                    />
                )}
                {children}
            </Button>
        );
    },
);
LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
