import LegalPage from '../components/content/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata = pageMetadata({
    title: 'Privacy & Cookie Policy | Artemis Atelier',
    description: 'How Artemis Atelier collects, uses and protects personal data from website forms, the client portal and analytics under the Nigeria Data Protection Act.',
    path: '/privacy',
})

// Plain-English policy for review by your legal team before relying on it.
const page = {
    h1: 'Privacy and cookie policy',
    updatedLabel: '2 October 2026',
    breadcrumbs: [{ name: 'Privacy', path: '/privacy' }],
    blocks: [
        { t: 'p', text: `This policy explains how **${SITE.name}** (${SITE.rc}), ${SITE.address.full} (“we”), handles personal data collected through artemisatelierltd.com, our client portal and our communications. We follow the Nigeria Data Protection Act 2023 (NDPA) and the Nigeria Data Protection Regulation. If you are in the UK or EU, we also respect your rights under the UK/EU GDPR.` },
        { t: 'h2', text: 'What we collect' },
        { t: 'ul', items: [
            '**Enquiry and consultation forms:** your name, where you are based, where you plan to build, land status, budget range, WhatsApp number or email, any message, and a preferred call time and time zone.',
            '**Newsletter sign-ups:** your email address and which list you joined.',
            '**Client portal:** your name, email, password (stored encrypted by our authentication provider), and the project records, documents, photos and defect reports we share with you.',
            '**Analytics:** pages visited, device and approximate location, and which buttons were used (for example a WhatsApp click), only with your consent for cookie-based analytics.',
            '**Messages:** what you send us by WhatsApp, email or phone.',
        ] },
        { t: 'h2', text: 'Why we use it, and our lawful basis' },
        { t: 'ul', items: [
            'To reply to your enquiry and arrange your consultation (steps before a contract, at your request).',
            'To deliver your project and run the client portal (performance of a contract).',
            'To send newsletters and price updates you signed up for (consent; you can unsubscribe at any time).',
            'To understand and improve the website (consent for analytics cookies; legitimate interests for cookie-free statistics).',
            'To meet legal, tax and regulatory duties (legal obligation).',
        ] },
        { t: 'p', text: 'We do not sell your data or share it with third parties for their own marketing.' },
        { t: 'h2', text: 'Who processes it for us' },
        { t: 'ul', items: [
            '**Supabase** (database, file storage and logins for the client portal).',
            '**Vercel** (website hosting and cookie-free visitor statistics).',
            '**Google Analytics** (website analytics, only if you accept cookies).',
            '**WhatsApp / Meta** and our email provider when you message us through them.',
        ] },
        { t: 'p', text: 'Some of these providers store data outside Nigeria. Where they do, we rely on their contractual safeguards for international transfers as the NDPA requires.' },
        { t: 'h2', id: 'cookies', text: 'Cookies' },
        { t: 'table', caption: 'Cookies and similar storage', head: ['Name', 'Purpose', 'Type'], rows: [
            ['aal-consent', 'Remembers your cookie choice', 'Essential (browser storage)'],
            ['Supabase auth cookies', 'Keep you signed in to the client portal', 'Essential'],
            ['_ga, _ga_*', 'Google Analytics: counts visits and how pages are used', 'Analytics, only if you accept'],
            ['aal-currency', 'Remembers whether you view costs in ₦, £ or $', 'Preference (browser storage)'],
        ] },
        { t: 'p', text: 'You can change your choice at any time by clearing this site’s data in your browser; the banner will ask again.' },
        { t: 'h2', text: 'How long we keep it' },
        { t: 'ul', items: [
            'Enquiries that do not become projects: up to 24 months, then deleted.',
            'Project and portal records: for the project, the defects liability period and as long as the law requires us to keep business records.',
            'Newsletter: until you unsubscribe.',
        ] },
        { t: 'h2', text: 'Your rights' },
        { t: 'p', text: `You can ask to see, correct, delete or move your data, object to or restrict how we use it, and withdraw consent. Email [${SITE.email}](mailto:${SITE.email}). We reply within 30 days. You may also complain to the Nigeria Data Protection Commission (NDPC), or your local data protection authority if you live outside Nigeria.` },
        { t: 'h2', text: 'Security' },
        { t: 'p', text: 'Data is encrypted in transit, portal files are private and opened through short-lived links, and only staff who need it can see client records.' },
        { t: 'h2', text: 'Contact' },
        { t: 'p', text: `${SITE.name}, ${SITE.address.full}. Email [${SITE.email}](mailto:${SITE.email}), phone ${SITE.phone}.` },
    ],
}

export default function PrivacyPage() {
    return <LegalPage page={page} />
}
