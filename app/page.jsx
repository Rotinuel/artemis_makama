import Navigation from './components/Navigation'
import HeroVideo from './components/HeroVideo'
import NewsSection from './components/NewsSection'
import ProjectStoriesSection from './components/ProjectStoriesSection'
import CareersSection from './components/CareersSection'
// import CultureSection from './components/CultureSection'
// import IdeasSection from './components/IdeasSection'
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
      {/* <CultureSection /> */}
      {/* <IdeasSection /> */}
      <Footer />
      <CookieBanner />
    </>
  )
}
