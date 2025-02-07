import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AddToCartForm } from '@/features/cart/client/components/form.add-to-cart';

import { ProductImageCarousel } from '@/features/product/client/components/carousel.product-image';
import { ProductListLink } from '@/features/product/client/components/link.product-list';
import { RelatedProducts } from '@/features/product/client/components/list.related-products';
import {
    findProductById,
    findRelatedProductsByProductId,
} from '@/features/product/server/db';

import { findStoreById } from '@/features/stores/server/db';

import { Breadcrumbs } from '@/components/pagers/breadcrumbs';
import { Rating } from '@/components/rating';
import { Shell } from '@/components/shells/shell';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { UpdateProductRatingButton } from '@/components/update-product-rating-button';
import { env } from '@/env.mjs';
import { formatPrice, toTitleCase } from '@/libs/client/utils';

interface ProductPageProps {
    params: {
        productId: string;
    };
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const productId = Number(params.productId);
    const product = await findProductById({ productId });

    if (!product) {
        return {};
    }

    return {
        metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
        title: toTitleCase(product.name),
        description: product.description,
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const productId = Number(params.productId);

    const product = await findProductById({ productId });
    if (!product) {
        notFound();
    }

    const store = await findStoreById({ storeId: product.storeId });
    const otherProducts = store
        ? await findRelatedProductsByProductId({
              productId,
              storeId: product.storeId,
              amount: 4,
          })
        : [];

    return (
        <Shell className="pb-12 md:pb-14">
            <Breadcrumbs
                segments={[
                    {
                        title: 'Products',
                        href: '/products',
                    },
                    {
                        title: toTitleCase(product.category),
                        href: `/products?category=${product.category}`,
                    },
                    {
                        title: product.name,
                        href: `/product/${product.id}`,
                    },
                ]}
            />
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                <ProductImageCarousel
                    className="w-full md:w-1/2"
                    images={product.images ?? []}
                    options={{
                        loop: true,
                    }}
                />
                <Separator className="mt-4 md:hidden" />
                <div className="flex w-full flex-col gap-4 md:w-1/2">
                    <div className="space-y-2">
                        <h2 className="line-clamp-1 text-2xl font-bold">
                            {product.name}
                        </h2>
                        <p className="text-base text-muted-foreground">
                            {formatPrice(product.price)}
                        </p>
                        <ProductListLink
                            {...{
                                storeId: store?.id,
                                storeName: store?.name,
                            }}
                        />
                    </div>
                    <Separator className="my-1.5" />
                    <p className="text-base text-muted-foreground">
                        {product.inventory} in stock
                    </p>
                    <div className="flex items-center justify-between">
                        <Rating rating={Math.round(product.rating / 5)} />
                        <UpdateProductRatingButton
                            productId={product.id}
                            rating={product.rating}
                        />
                    </div>
                    <AddToCartForm productId={productId} showBuyNow={true} />
                    <Separator className="mt-5" />
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="description"
                    >
                        <AccordionItem
                            value="description"
                            className="border-none"
                        >
                            <AccordionTrigger>Description</AccordionTrigger>
                            <AccordionContent>
                                {product.description ??
                                    'No description is available for this product.'}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Separator className="md:hidden" />
                </div>
            </div>
            <RelatedProducts store={store} otherProducts={otherProducts} />
        </Shell>
    );
}
