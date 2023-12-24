import { and, eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UpdateProductForm } from '@/features/product/client/components/dashboard.form.update-product';
import { ProductPager } from '@/features/product/client/components/pager.product';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { db } from '@/db';
import { products } from '@/db/schema';
import { env } from '@/env.mjs';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Manage Product',
    description: 'Manage your product',
};

interface UpdateProductPageProps {
    params: {
        storeId: string;
        productId: string;
    };
}

export default async function UpdateProductPage({
    params,
}: UpdateProductPageProps) {
    const storeId = Number(params.storeId);
    const productId = Number(params.productId);

    const product = await db.query.products.findFirst({
        where: and(eq(products.id, productId), eq(products.storeId, storeId)),
    });

    if (!product) {
        notFound();
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between space-x-2">
                    <CardTitle as="h2" className="text-2xl">
                        Update product
                    </CardTitle>
                    <ProductPager product={product} />
                </div>
                <CardDescription>
                    Update your product information, or delete it
                </CardDescription>
            </CardHeader>
            <CardContent>
                <UpdateProductForm product={product} />
            </CardContent>
        </Card>
    );
}
