import './globals.css'
import Watermark from './components/Watermark'
import WhatsAppButton from './components/WhatsAppButton'
import Analytics from './components/Analytics'
import CookieBanner from './components/CookieBanner'
import JsonLd from './components/JsonLd'
import { SITE } from '@/lib/site'
import { pageMetadata, organizationSchema, websiteSchema } from '@/lib/seo'

const DEFAULT_TITLE = 'Building Contractor in Lagos & Build From Abroad | Artemis'
const DEFAULT_DESCRIPTION =
  'Lagos building contractor since 2010 (RC 1484495). Design and build, renovation and diaspora projects with live site cameras, stage-checked payments and open-book BOQs.'

const base = pageMetadata({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, path: '/' })

export const metadata = {
  ...base,
  metadataBase: new URL(SITE.url),
  title: { default: DEFAULT_TITLE, template: '%s | Artemis Atelier' },
  // Pages set their own canonical and og:url; don't inherit the homepage ones
  alternates: undefined,
  openGraph: { ...base.openGraph, url: undefined },
  applicationName: SITE.name,
  // Search Console (Google) and Bing Webmaster Tools ownership tags:
  // set NEXT_PUBLIC_GSC_VERIFICATION / NEXT_PUBLIC_BING_VERIFICATION in Vercel
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION || process.env.NEXT_PUBLIC_BING_VERIFICATION
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : {}),
          ...(process.env.NEXT_PUBLIC_BING_VERIFICATION ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } } : {}),
        },
      }
    : {}),
}

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. crxlauncher) add
    // attributes to <html> before React loads, which is harmless
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Watermark />
        {children}
        <WhatsAppButton />
        <CookieBanner />
        <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID || process.env.GA_ID || ''} />
      </body>
    </html>
  )
}
