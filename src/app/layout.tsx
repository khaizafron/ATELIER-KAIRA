import "./globals.css"
import type { Metadata } from "next"
import { Caveat } from 'next/font/google'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hand'
})

export const metadata: Metadata = {
  title: "Ximy Vault",
  description: "Curated vintage fashion",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={caveat.variable}>
      <body>{children}</body>
    </html>
  )
}
