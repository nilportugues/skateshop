'use client';

import { UserProfile as ClerkUserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { type Theme } from '@clerk/types';
import { useTheme } from 'next-themes';

import { Skeleton } from '@/components/ui/skeleton';

const appearance: Theme = {
    baseTheme: undefined,
    variables: {
        borderRadius: '0.25rem',
    },
    elements: {
        card: 'shadow-none',
        navbar: 'hidden',
        navbarMobileMenuButton: 'hidden',
        headerTitle: 'hidden',
        headerSubtitle: 'hidden',
    },
};

export function UserProfile() {
    const { theme } = useTheme();

    return (
        <section
            id="user-account-info"
            aria-labelledby="user-account-info-heading"
            className="w-full overflow-hidden"
        >
            <ClerkUserProfile
                appearance={{
                    ...appearance,
                    baseTheme: theme === 'dark' ? dark : appearance.baseTheme,
                    variables: {
                        ...appearance.variables,
                        colorBackground:
                            theme === 'light' ? '#fafafa' : undefined,
                    },
                }}
            />
        </section>
    );
}

export function LoadingUserProfile() {
    return (
        <section className="grid gap-10 rounded-lg border p-4">
            <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-8 w-52" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-8 w-52" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-8 w-52" />
            </div>
        </section>
    );
}
