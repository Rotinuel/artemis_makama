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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <Watermark />
      <body>{children}</body>
    </html>
  )
}
