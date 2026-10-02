import ArticleShell from '../components/content/ArticleShell'
import TrustEvidence from '../components/content/TrustEvidence'
import { howWeBuild } from '@/lib/content/process'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({ title: howWeBuild.title, description: howWeBuild.description, path: howWeBuild.path, image: howWeBuild.hero, imageAlt: howWeBuild.heroAlt })

export default function HowWeBuildPage() {
    return <ArticleShell page={howWeBuild} nodes={{ trust: <TrustEvidence /> }} />
}
