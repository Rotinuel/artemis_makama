import Navigation from './components/Navigation'
import HeroSlideshow from './components/HeroSlideshow'
import NewsSection from './components/NewsSection'
import ProjectStoriesSection from './components/ProjectStoriesSection'
import CareersSection from './components/CareersSection'
import Footer from './components/Footer'
import WhyBuildWithUs from './components/Why'
import Faq from './components/content/Faq'
import Testimonials from './components/content/Testimonials'
import { MoneyProtection, InspectionOptions } from './components/infographics/Infographics'
import { pageMetadata } from '@/lib/seo'
import { homeFaqs } from '@/lib/content/process'

// Statically generated; the news strip refreshes every 10 minutes
export const revalidate = 600

export const metadata = pageMetadata({
  title: 'Building Contractor in Lagos & Build From Abroad | Artemis',
  description: 'Lagos building contractor since 2010 (RC 1484495). Design and build, renovation and diaspora projects with live site cameras, stage-checked payments and open-book BOQs.',
  path: '/',
})

export default function HomePage() {
  return (
    <>
      <Navigation variant='hero' />
      <HeroSlideshow />
      <WhyBuildWithUs />
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-10 md:py-12">
          <MoneyProtection />
          <InspectionOptions />
        </div>
      </section>
      <ProjectStoriesSection />
      <Testimonials />
      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-6 py-20 md:py-24">
          <Faq faqs={homeFaqs} title="Questions we are often asked" />
        </div>
      </section>
      <CareersSection/>
      <NewsSection />
      <Footer />
    </>
  )
}
