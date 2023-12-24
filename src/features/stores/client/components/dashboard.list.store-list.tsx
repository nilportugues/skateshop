import * as React from 'react';

import { StoreCard } from '@/features/stores/client/components/card.store';
import { StoreCardSkeleton } from '@/features/stores/client/components/card.store-skeleton';

import { GetStoresByUserId } from '../../server/db';

export function DashboardUserStoreList({
    allStores,
}: {
    allStores: GetStoresByUserId[];
}) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <React.Suspense
                fallback={Array.from({ length: 3 }).map((_, i) => (
                    <StoreCardSkeleton key={i} />
                ))}
            >
                {allStores.map((store) => (
                    <StoreCard
                        key={store.id}
                        store={store}
                        href={`/dashboard/stores/${store.id}`}
                    />
                ))}
            </React.Suspense>
        </section>
    );
}
