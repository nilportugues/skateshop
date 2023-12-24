import { allPages, allPosts } from 'contentlayer/generated';

import { type MetadataRoute } from 'next';

import { productCategories } from '@/features/product/config/products';

import { absoluteUrl } from '@/lib/client/utils';
import { buildAllProductUrls, buildAllStoreUrls } from '@/features/sitemap/server/sitemap.service';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    
    const storesRoutes = await buildAllStoreUrls();
    const productsRoutes = await buildAllProductUrls();

    const categoriesRoutes = productCategories.map((category) => ({
        url: absoluteUrl(`/categories/${category.title}`),
        lastModified: new Date().toISOString(),
    }));

    const subcategoriesRoutes = productCategories
        .map((category) =>
            category.subcategories.map((subcategory) => ({
                url: absoluteUrl(
                    `/categories/${category.title}/${subcategory.slug}`,
                ),
                lastModified: new Date().toISOString(),
            })),
        )
        .flat();

    const pagesRoutes = allPages.map((page) => ({
        url: absoluteUrl(`${page.slug}`),
        lastModified: new Date().toISOString(),
    }));

    const postsRoutes = allPosts.map((post) => ({
        url: absoluteUrl(`${post.slug}`),
        lastModified: new Date().toISOString(),
    }));

    const routes = [
        '',
        '/products',
        '/stores',
        '/build-a-board',
        '/blog',
        '/dashboard/account',
        '/dashboard/stores',
        '/dashboard/billing',
        '/dashboard/purchases',
    ].map((route) => ({
        url: absoluteUrl(route),
        lastModified: new Date().toISOString(),
    }));

    return [
        ...routes,
        ...storesRoutes,
        ...productsRoutes,
        ...categoriesRoutes,
        ...subcategoriesRoutes,
        ...pagesRoutes,
        ...postsRoutes,
    ];
}
