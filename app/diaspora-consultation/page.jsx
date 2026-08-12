import DiasporaConsultationClient from './DiasporaConsultationClient'

const SITE_URL = 'https://artemisatelierltd.com' 
const PAGE_PATH = '/diaspora-consultation'

export const metadata = {
    title: 'Build Your Home in Nigeria From Abroad | Free Consultation — Artemis Atelier',
    description:
        'Nigerians in the diaspora: build your dream home in Nigeria with documented milestones, independent inspection, insured payments and weekly progress reports. Book a free 20-minute consultation.',
    alternates: {
        canonical: `${SITE_URL}${PAGE_PATH}`,
    },
    openGraph: {
        title: 'Build Your Home in Nigeria — Without Nigeria Trust Issues',
        description:
            'Documented milestones, independent inspection and insured payments — monitor your Nigerian construction project from anywhere. Book a free consultation.',
        url: `${SITE_URL}${PAGE_PATH}`,
        siteName: 'Artemis Atelier Ltd',
        images: [
            {
                url: `${SITE_URL}/51.jpg`,
                width: 1200,
                height: 630,
                alt: 'Artemis Atelier construction project',
            },
        ],
        locale: 'en_NG',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Build Your Home in Nigeria — Without Living in Nigeria',
        description:
            'Documented milestones, independent inspection and insured payments. Book a free diaspora consultation with Artemis Atelier.',
        images: [`${SITE_URL}/51.jpg`],
    },
    robots: {
        index: true,
        follow: true,
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Diaspora Construction Project Management',
    provider: {
        '@type': 'GeneralContractor',
        name: 'Artemis Atelier Ltd',
        url: SITE_URL,
    },
    areaServed: {
        '@type': 'Country',
        name: 'Nigeria',
    },
    audience: {
        '@type': 'Audience',
        audienceType: 'Nigerians living abroad planning to build property in Nigeria',
    },
    description:
        'Milestone-based construction management, independent inspection, insured payments and digital project monitoring for Nigerians building from abroad.',
    offers: {
        '@type': 'Offer',
        name: 'Free Diaspora Project Consultation',
        price: '0',
        priceCurrency: 'NGN',
    },
}

export default function DiasporaConsultationPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DiasporaConsultationClient />
        </>
    )
}
