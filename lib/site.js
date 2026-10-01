// One place for the business facts used across the site (SEO, schema,
// contact links). Keep these identical to Google Business Profile and
// every directory listing — search engines and AI tools check they match.

export const SITE = {
    name: 'Artemis Atelier Ltd',
    url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.artemisatelierltd.com').replace(/\/$/, ''),
    rc: 'RC 1484495',
    founded: '2010',
    phone: '+234 803 350 2393',
    phoneE164: '+2348033502393',
    whatsapp: '2348033502393', // digits only, for wa.me links
    whatsappMessage: "Hi Artemis, I'd like to discuss a building project in Lagos.",
    email: '', // TODO: add your public email address
    address: {
        street: '70B Olorunlogbon Street, Anthony Village',
        city: 'Lagos',
        region: 'Lagos',
        country: 'NG',
        full: '70B Olorunlogbon Street, Anthony Village, Lagos, Nigeria',
    },
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
}

export const whatsappLink = (text = SITE.whatsappMessage) =>
    `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
