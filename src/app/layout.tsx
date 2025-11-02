import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter, Cormorant_Garamond } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: 'Christian & Sara - Matrimonio',
  description: 'Sito del matrimonio con countdown, agenda, RSVP e lista nozze.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${cormorant.variable} min-h-screen antialiased font-sans`}>
        {children}
      </body>
    </html>
  )
}
