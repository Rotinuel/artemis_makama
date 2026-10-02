// One place for the business facts used across the site (SEO, schema,
// contact links). Keep these identical to Google Business Profile and
// every directory listing — search engines and AI tools check they match.
//
// Canonical address: the apex domain (https://artemisatelierltd.com).
// www.artemisatelierltd.com should permanently (308) redirect to it —
// set that in Vercel → Project → Settings → Domains.

export const SITE = {
    name: 'Artemis Atelier Ltd',
    shortName: 'Artemis Atelier',
    // Always the apex host, even if NEXT_PUBLIC_SITE_URL still says www
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://artemisatelierltd.com').replace(/\/$/, '').replace('://www.artemisatelierltd.com', '://artemisatelierltd.com'),
    rc: 'RC 1484495',
    rcNumber: '1484495',
    founded: '2010',
    phone: '+234 803 350 2393',
    phoneE164: '+2348033502393',
    whatsapp: '2348033502393', // digits only, for wa.me links
    whatsappMessage: "Hi Artemis, I'd like to discuss a building project in Nigeria.",
    email: 'info@artemisatelierltd.com',
    address: {
        street: '70B Olorunlogbon Street, Anthony Village',
        city: 'Lagos',
        region: 'Lagos',
        postalCode: '',
        country: 'NG',
        full: '70B Olorunlogbon Street, Anthony Village, Lagos, Nigeria',
    },
    // Office hours (Lagos time, WAT = UTC+1, no daylight saving)
    hours: { days: 'Monday to Saturday', opens: '09:00', closes: '17:00', dayCodes: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] },
    // Where the firm works today. Only list places you can show work in.
    areaServed: ['Lagos', 'Ogun State', 'Nigeria'],
    description:
        'Lagos design and construction firm delivering homes, renovations and commercial buildings for clients in Nigeria and abroad, with live site cameras, stage-checked payments and open-book costing.',
    social: [
        'https://www.linkedin.com/company/artemis-atelier-limited/',
        'https://www.instagram.com/artemis_atelierltd/',
        'https://www.facebook.com/AALNetwork',
        'https://www.x.com/AALNetwork',
        'https://www.tiktok.com/@AALNetwork',
        'https://www.youtube.com/user/aalnetwork',
    ],
    ogImage: '/31.jpg',
    ogImageSize: { width: 1280, height: 720 },
    logo: '/logo-bg.png',
}

export const whatsappLink = (text = SITE.whatsappMessage) =>
    `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

export const mailtoLink = (subject = 'Project enquiry', body = '') =>
    `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`

/** Absolute URL on the canonical host */
export const absoluteUrl = (path = '/') => `${SITE.url}${path === '/' ? '' : path.startsWith('/') ? path : `/${path}`}`
