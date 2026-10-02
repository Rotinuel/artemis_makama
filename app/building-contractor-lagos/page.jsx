import ArticleShell from '../components/content/ArticleShell'
import { contractorLagos } from '@/lib/content/services'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({ title: contractorLagos.title, description: contractorLagos.description, path: contractorLagos.path, image: contractorLagos.hero, imageAlt: contractorLagos.heroAlt })

export default function BuildingContractorLagosPage() {
    return <ArticleShell page={contractorLagos} />
}
