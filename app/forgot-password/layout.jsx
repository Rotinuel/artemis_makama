// Account page: keep it out of search results.
export const metadata = {
    title: { absolute: 'Forgot password | Artemis Atelier' },
    robots: { index: false, follow: false },
}

export default function Layout({ children }) {
    return children
}
