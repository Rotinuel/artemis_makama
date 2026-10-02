import { SITE } from '@/lib/site'

// Served at /robots.txt — lets search engines and AI assistants read the site
export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/portal', '/login', '/forgot-password', '/reset-password', '/auth', '/api', '/downloads/'],
            },
        ],
        sitemap: `${SITE.url}/sitemap.xml`,
        host: SITE.url,
    }
}
