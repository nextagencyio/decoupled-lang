import './globals.css'
import ApolloProvider from './components/providers/ApolloProvider'
import { Viewport, type Metadata } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  const port = process.env.PORT || '3000'
  const host = process.env.HOST || 'localhost'
  return `http://${host}:${port}`
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Decoupled News',
    template: '%s | Decoupled News'
  },
  description: 'Multilingual news site powered by Drupal and Next.js. Demonstrating translation support with English, Spanish, and French content.',
  keywords: ['Drupal', 'Next.js', 'GraphQL', 'Multilingual', 'i18n', 'Translation'],
  authors: [{ name: 'Decoupled Team' }],
  creator: 'Decoupled',
  publisher: 'Decoupled',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className="font-sans">
        <ApolloProvider>
          {children}
        </ApolloProvider>
      </body>
    </html>
  )
}
