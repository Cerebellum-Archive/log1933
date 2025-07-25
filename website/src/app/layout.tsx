import type { Metadata } from 'next'
import { Inter, Special_Elite } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })
const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
});

export const metadata: Metadata = {
  title: 'Ernest K. Gann 1933 Logbook',
  description: "A 1933 world tour logbook from Ernest K. Gann, digitized and enhanced.",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
