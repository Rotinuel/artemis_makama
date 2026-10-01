import { portalStyles } from './portal-styles'

export const metadata = {
    title: 'Client Portal',
    robots: { index: false, follow: false },
}

export default function PortalLayout({ children }) {
    return (
        <div className="pt-root">
            <style>{portalStyles}</style>
            {children}
        </div>
    )
}
