import LegalPage from '../components/content/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata = pageMetadata({
    title: 'Website Terms of Use | Artemis Atelier',
    description: 'Terms for using the Artemis Atelier Ltd website, cost guides, material price tracker and client portal.',
    path: '/terms',
})

const page = {
    h1: 'Website terms of use',
    updatedLabel: '2 October 2026',
    breadcrumbs: [{ name: 'Terms', path: '/terms' }],
    blocks: [
        { t: 'p', text: `These terms apply to your use of artemisatelierltd.com, operated by **${SITE.name}** (${SITE.rc}), ${SITE.address.full}. By using the site you accept them.` },
        { t: 'h2', text: 'Information on this site' },
        { t: 'ul', items: [
            '**Cost guides and estimates** are general, indicative ranges for planning. They are not a quotation or offer. Your project’s price is set only in a written bill of quantities and contract.',
            '**Material prices** are indicative market prices from public sources, checked by our team, and change often. Actual prices depend on supplier, brand, quantity and delivery.',
            '**Exchange-rate conversions** use published reference rates on the date shown and are approximate.',
            '**Guides** about land, title and contracts are general information, not legal advice. Instruct a Nigerian lawyer for your transaction.',
        ] },
        { t: 'h2', text: 'Our services' },
        { t: 'p', text: 'Services are provided only under a signed written contract. Statements on this site about stage payments, inspection, insurance and defects periods describe how we normally work; the contract for your project sets the binding terms. Insurance is provided by a licensed insurer under its own policy terms.' },
        { t: 'h2', text: 'Client portal' },
        { t: 'p', text: 'Portal accounts are for our clients and their authorised representatives. Keep your password private. Documents in the portal are confidential to your project.' },
        { t: 'h2', text: 'Intellectual property' },
        { t: 'p', text: 'Designs, drawings, photographs, text and our logo on this site belong to Artemis Atelier Ltd or are used with permission. You may share links and quote short extracts with credit; you may not reuse our designs or images without written permission.' },
        { t: 'h2', text: 'Links' },
        { t: 'p', text: 'We link to other websites (for example news sources, registers and suppliers). We are not responsible for their content.' },
        { t: 'h2', text: 'Liability' },
        { t: 'p', text: 'We take care that the site is accurate but do not guarantee it is complete or error-free. To the extent the law allows, we are not liable for losses from relying on general information on the site rather than advice for your project.' },
        { t: 'h2', text: 'Law' },
        { t: 'p', text: 'These terms are governed by the laws of the Federal Republic of Nigeria and the courts of Lagos State.' },
        { t: 'h2', text: 'Contact' },
        { t: 'p', text: `Questions about these terms: [${SITE.email}](mailto:${SITE.email}) or ${SITE.phone}. See also our [privacy and cookie policy](/privacy).` },
    ],
}

export default function TermsPage() {
    return <LegalPage page={page} />
}
