import { currentUser } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AddProductForm } from '@/features/product/client/components/dashboard.form.add-product';

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
    title: 'New Product',
    description: 'Add a new product',
};

interface NewProductPageProps {
    params: {
        storeId: string;
    };
}

export default async function NewProductPage({ params }: NewProductPageProps) {
    const storeId = Number(params.storeId);

    const user = await currentUser();

    if (!user) {
        redirect('/sigin');
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Add product</CardTitle>
                <CardDescription>
                    Add a new product to your store
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AddProductForm storeId={storeId} />
            </CardContent>
        </Card>
    );
}
