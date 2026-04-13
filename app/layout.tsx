import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'endpnt URL Preview API',
  description: 'Extract rich link previews from any URL with our fast and reliable API.',
  keywords: 'API, URL preview, link preview, metadata extraction, Open Graph, Twitter Card',
  authors: [{ name: 'endpnt.dev' }],
  creator: 'endpnt.dev',
  publisher: 'endpnt.dev',
  openGraph: {
    title: 'endpnt URL Preview API',
    description: 'Extract rich link previews from any URL with our fast and reliable API.',
    url: 'https://preview.endpnt.dev',
    siteName: 'endpnt URL Preview API',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'endpnt URL Preview API',
    description: 'Extract rich link previews from any URL with our fast and reliable API.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          {children}
        </div>
      </body>
    </html>
  )
}