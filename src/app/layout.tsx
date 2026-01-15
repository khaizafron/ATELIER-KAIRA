import "./globals.css"
import type { Metadata } from "next"
import { Caveat } from "next/font/google"

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hand",
})

export const metadata: Metadata = {
  title: "Atelier Kaira",
  description: "Wardrobe for your softer days.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={caveat.variable}>
      <head>
        {/* ✅ Google Brand Identity / Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Atelier Kaira",
              url: "https://www.atelierkaira.com",
              logo: "https://atelierkaira.com/logo.png",
              sameAs: [
                "https://www.instagram.com/atelier.kaira",
                "https://tiktok.com/@atelier.kaira"
              ]
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
