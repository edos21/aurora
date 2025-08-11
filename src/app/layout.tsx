import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Aurora - Lumina',
  description:
    'Plataforma de seguimiento de inversiones personales - Dando luz a tus finanzas',
  keywords: ['inversiones', 'finanzas', 'portfolio', 'análisis financiero'],
  authors: [{ name: 'Lumina Project' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
