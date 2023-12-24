import { type MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/client/utils';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: absoluteUrl('/sitemap.xml'),
    };
}
