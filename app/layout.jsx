import './globals.css'
import Watermark from './components/Watermark'

export const metadata = {
  title: 'Artemis Atelier Ltd: A Global Design, Architecture,' +
      ' Engineering, Planning Firm',
  description: 'Artemis Atelier Ltd is a global design, architecture,' +
      ' engineering and planning firm.',
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
      </body>
    </html>
  )
}
