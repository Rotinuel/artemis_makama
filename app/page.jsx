import Navigation from './components/Navigation'
import HeroSlideshow from './components/HeroSlideshow'
import NewsSection from './components/NewsSection'
import ProjectStoriesSection from './components/ProjectStoriesSection'
import CareersSection from './components/CareersSection'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import WhyBuildWithUs from './components/Why'

export default function HomePage() {
  return (
    <>
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
