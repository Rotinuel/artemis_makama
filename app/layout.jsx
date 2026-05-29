import './globals.css'

export const metadata = {
  title: 'AAL: A Global Design, Architecture,' +
      ' Engineering, Planning Firm',
  description: 'AAL is a global design, architecture,' +
      ' engineering and planning firm. Our people collaborate across a network of 27 offices on three continents.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
