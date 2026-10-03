import { SITE, absoluteUrl } from './site'
import { TRUST } from './trust'

/**
 * Complete page metadata in one call: unique title, description,
 * self-referencing canonical on the apex host, full Open Graph + Twitter.
 *
 *   export const metadata = pageMetadata({ title: '…', description: '…', path: '/about' })
 *
 * `title` is used exactly as given (no brand suffix added), so keep it ~60
 * characters and include the brand once if you want it.
 */
export function pageMetadata({ title, description, path = '/', image, imageAlt, type = 'website', noindex = false, publishedTime, modifiedTime }) {
    const url = absoluteUrl(path)
    const img = image || SITE.ogImage
    const imgUrl = img.startsWith('http') ? img : absoluteUrl(img)
    const images = [{
        url: imgUrl,
        ...(img === SITE.ogImage ? SITE.ogImageSize : {}),
        alt: imageAlt || title,
    }]
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: url },
        openGraph: {
            type,
            url,
            siteName: SITE.name,
            locale: 'en_GB',
            title,
            description,
            images,
            ...(type === 'article' && publishedTime ? { publishedTime } : {}),
            ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            site: '@AALNetwork',
            title,
            description,
            images: [imgUrl],
        },
        ...(noindex ? { robots: { index: false, follow: true } } : {}),
    }
}

/* ───────────── Structured data (schema.org) ───────────── */

export const ORG_ID = `${SITE.url}/#organization`

export function organizationSchema() {
    const regs = TRUST.registrations || []
    return {
        '@context': 'https://schema.org',
        '@type': 'GeneralContractor',
        '@id': ORG_ID,
        name: SITE.name,
        alternateName: ['AAL', SITE.shortName],
        legalName: SITE.name,
        url: `${SITE.url}/`,
        logo: absoluteUrl(SITE.logo),
        image: absoluteUrl(SITE.ogImage),
        description: SITE.description,
        foundingDate: SITE.founded,
        telephone: SITE.phoneE164,
        email: SITE.email,
        identifier: {
            '@type': 'PropertyValue',
            propertyID: 'CAC RC number (Corporate Affairs Commission, Nigeria)',
            value: SITE.rcNumber,
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: SITE.address.street,
            addressLocality: SITE.address.city,
            addressRegion: SITE.address.region,
            addressCountry: SITE.address.country,
        },
        ...(TRUST.geo ? { geo: { '@type': 'GeoCoordinates', ...TRUST.geo } } : {}),
        openingHoursSpecification: [{
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: SITE.hours.opens,
            closes: SITE.hours.closes,
        }],
        priceRange: '₦₦₦',
        currenciesAccepted: 'NGN, GBP, USD',
        areaServed: SITE.areaServed.map(name => ({ '@type': name === 'Nigeria' ? 'Country' : 'AdministrativeArea', name })),
        knowsAbout: [
            'Residential construction', 'Design and build', 'Renovation and interior finishing',
            'Facility management', 'Project management', 'Building a house in Nigeria from abroad',
            'Bills of quantities', 'Construction cost estimating in Nigeria',
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Design and construction services',
            itemListElement: [
                ['Design and build', '/services/design-and-build'],
                ['Renovation and interior finishing', '/services/renovation-and-interior-finishing'],
                ['Facility management and commercial construction', '/services/facility-management-and-commercial'],
                ['Building from abroad (diaspora project management)', '/build-from-abroad'],
            ].map(([name, path]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, url: absoluteUrl(path) } })),
        },
        ...(regs.length ? {
            hasCredential: regs.map(r => ({
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Professional registration',
                name: `${r.body} ${r.number}`,
                recognizedBy: { '@type': 'Organization', name: r.body },
            })),
        } : {}),
        sameAs: [...SITE.social, ...(TRUST.googleBusinessProfileUrl ? [TRUST.googleBusinessProfileUrl] : [])],
    }
}

export function websiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en',
    }
}

/** items: [{ name, path }] — Home is added automatically */
export function breadcrumbSchema(items = []) {
    const all = [{ name: 'Home', path: '/' }, ...items]
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            item: absoluteUrl(it.path),
        })),
    }
}

/** faqs: [{ q, a }] — plain-text answers (inline [links](/x) are stripped) */
export function faqSchema(faqs = []) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
        })),
    }
}

export function articleSchema({ title, description, path, image, published, modified, author }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        mainEntityOfPage: absoluteUrl(path),
        image: absoluteUrl(image || SITE.ogImage),
        datePublished: published,
        dateModified: modified || published,
        author: author
            ? { '@type': 'Person', name: author.name, ...(author.credentials ? { jobTitle: author.credentials } : {}), ...(author.url ? { url: absoluteUrl(author.url) } : {}), worksFor: { '@id': ORG_ID } }
            : { '@type': 'Organization', name: `${SITE.shortName} editorial team`, url: `${SITE.url}/` },
        publisher: { '@id': ORG_ID },
        inLanguage: 'en',
    }
}

export function serviceSchema({ name, description, path, serviceType, areaServed, price }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        serviceType: serviceType || name,
        description,
        url: absoluteUrl(path),
        provider: { '@id': ORG_ID },
        areaServed: (areaServed || SITE.areaServed).map(n => ({ '@type': n === 'Nigeria' ? 'Country' : 'AdministrativeArea', name: n })),
        // Only when prices are published (lib/pricing.js)
        ...(price ? {
            offers: {
                '@type': 'Offer',
                priceCurrency: 'NGN',
                ...(Array.isArray(price.ngn)
                    ? { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'NGN', minPrice: price.ngn[0], maxPrice: price.ngn[1] } }
                    : { price: price.ngn }),
                url: absoluteUrl(path),
            },
        } : {}),
    }
}

export function plainText(s = '') {
    return String(s)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
}
