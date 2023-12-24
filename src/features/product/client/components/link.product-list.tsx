import Link from 'next/link';

export function ProductListLink({
    storeId,
    storeName,
}: {
    storeId?: number;
    storeName?: string;
}) {
    return storeId && storeName ? (
        <Link
            href={`/products?store_ids=${storeId}`}
            className="line-clamp-1 inline-block text-base text-muted-foreground hover:underline"
        >
            {storeName}
        </Link>
    ) : null;
}
