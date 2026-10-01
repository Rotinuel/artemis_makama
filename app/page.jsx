import Navigation from './components/Navigation'
import HeroSlideshow from './components/HeroSlideshow'
import NewsSection from './components/NewsSection'
import ProjectStoriesSection from './components/ProjectStoriesSection'
import CareersSection from './components/CareersSection'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import WhyBuildWithUs from './components/Why'
import { SITE } from '@/lib/site'

export const metadata = {
  alternates: { canonical: '/' },
}

// Tells Google and AI assistants who we are, where, and what we do
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: 'AAL',
  url: `${SITE.url}/`,
  logo: `${SITE.url}/logo-bg.png`,
  image: `${SITE.url}${SITE.ogImage}`,
  description: SITE.description,
  foundingDate: SITE.founded,
  telephone: SITE.phoneE164,
  ...(SITE.email ? { email: SITE.email } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  },
  areaServed: ['Lagos', 'Nigeria'],
  knowsAbout: ['Residential construction', 'Renovation', 'Architectural design', 'Project management', 'Diaspora home building'],
  sameAs: SITE.social,
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />
      <Navigation variant='hero' />
      <HeroSlideshow />
      <WhyBuildWithUs />
      <ProjectStoriesSection />
      <CareersSection/>
      <NewsSection />
      <Footer />
      <CookieBanner />
    </>
  )
}
