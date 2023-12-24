import { currentUser } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AddStoreForm } from '@/features/stores/client/components/dashboard.form.add-store';

import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from '@/components/page-header';
import { PageHeaderBlock } from '@/components/page-header.block';
import { Shell } from '@/components/shells/shell';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { env } from '@/env.mjs';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'New Store',
    description: 'Add a new store',
};

export default async function NewStorePage() {
    const user = await currentUser();

    if (!user) {
        redirect('/signin');
    }

    return (
        <Shell variant="sidebar">
            <PageHeaderBlock
                size="sm"
                title="New Store"
                description="Add a new store to your account"
            />

            <Card
                as="section"
                id="new-store-page-form-container"
                aria-labelledby="new-store-page-form-heading"
            >
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Add store</CardTitle>
                    <CardDescription>
                        Add a new store to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddStoreForm userId={user.id} />
                </CardContent>
            </Card>
        </Shell>
    );
}
