import Navigation from './components/Navigation'
import HeroVideo from './components/HeroVideo'
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
      <HeroVideo />
      <WhyBuildWithUs />
      <ProjectStoriesSection />
      <CareersSection/>
      <NewsSection />
      <Footer />
      <CookieBanner />
    </>
  )
}
