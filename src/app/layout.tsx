import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "مُستخلَص | SubConPay",
  description: "منصة إدارة مستخلصات مقاولي الباطن في قطاع التشييد السعودي",
  manifest: "/manifest.json",
  themeColor: "#1e40af",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  )
}
