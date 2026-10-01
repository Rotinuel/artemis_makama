import './globals.css'
import Watermark from './components/Watermark'
import WhatsAppButton from './components/WhatsAppButton'
import { SITE } from '@/lib/site'

const DEFAULT_TITLE = 'Build in Lagos from Anywhere | Design & Construction | Artemis Atelier Ltd'
const DEFAULT_DESCRIPTION =
  'Lagos design and construction firm since 2010. Live site cameras, stage-checked payments and open-book costs. Book a free consultation.'

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Artemis Atelier Ltd',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE.name,
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_NG',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: SITE.ogImage, width: 1280, height: 720, alt: 'Residential development designed by Artemis Atelier Ltd' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AALNetwork',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [SITE.ogImage],
  },
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
        <Watermark />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
