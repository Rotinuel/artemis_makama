import JsonLd from '../components/JsonLd'
import { pageMetadata, breadcrumbSchema } from '@/lib/seo'
import { SITE } from '@/lib/site'

// The contact page is a client component, so its SEO metadata lives here
export const metadata = pageMetadata({
    title: 'Contact Artemis Atelier | Building Contractor in Lagos',
    description: 'Call or WhatsApp +234 803 350 2393, email info@artemisatelierltd.com, or book a free 20-minute call in your time zone. Studio: Anthony Village, Lagos.',
    path: '/contact',
})

export default function ContactLayout({ children }) {
    return (
        <>
            <JsonLd data={[
                breadcrumbSchema([{ name: 'Contact', path: '/contact' }]),
                {
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    url: `${SITE.url}/contact`,
                    about: { '@id': `${SITE.url}/#organization` },
                },
            ]} />
            {children}
        </>
    )
}
