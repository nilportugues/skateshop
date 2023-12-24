import { ProductCard } from '@/features/stores/client/components/card.product';

import { type Product } from '@/lib/server/db/schema';

import { ScrollArea } from '@/components/ui/scroll-area';

type RelatedProductsProps = {
    store?: { id: number; name: string };
    otherProducts?: Pick<
        Product,
        'id' | 'name' | 'price' | 'images' | 'category' | 'inventory' | 'rating'
    >[];
};

export function RelatedProducts({
    store,
    otherProducts,
}: RelatedProductsProps) {
    return (
        <>
            {store && otherProducts && otherProducts.length > 0 ? (
                <div className="space-y-6 overflow-hidden">
                    <h2 className="line-clamp-1 flex-1 text-2xl font-bold">
                        More products from {store.name}
                    </h2>
                    <ScrollArea orientation="horizontal" className="pb-3.5">
                        <div className="flex gap-4">
                            {otherProducts.map((product) => (
                                <ProductCard
                                    key={String(product.id)}
                                    product={product}
                                    className="min-w-[260px]"
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            ) : null}
        </>
    );
}
