import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UpdateProductForm } from '@/features/product/client/components/dashboard.form.update-product';
import { ProductPager } from '@/features/product/client/components/pager.product';
import {
    getNextProductId,
    getPreviousProductId,
} from '@/features/product/server/product';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { env } from '@/env.mjs';
import { findProductByIdAndStoreId } from '@/features/product/server/db';

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

    const product = await findProductByIdAndStoreId({storeId, productId});
    if (!product) {
        notFound();
    }

    let nextProductId;
    try {
        nextProductId = await getNextProductId({
            id: productId,
            storeId: storeId,
        });
    } catch (e) {
        nextProductId = undefined;
    }

    let prevProductId;
    try {
        prevProductId = await getPreviousProductId({
            id: productId,
            storeId: storeId,
        });
    } catch (e) {
        prevProductId = undefined;
    }

    return (
        <Card>
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between space-x-2">
                    <CardTitle as="h2" className="text-2xl">
                        Update product
                    </CardTitle>
                    <ProductPager
                        storeId={storeId}
                        nextProductId={nextProductId}
                        prevProductId={prevProductId}
                    />
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
