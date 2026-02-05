import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FunnelBuilder - Visual Upsell Funnel Creator',
  description: 'Create and manage powerful upsell funnels with our intuitive drag-and-drop builder. No coding required.',
  generator: 'v0.app',
  keywords: ['funnel', 'upsell', 'sales', 'builder', 'visual'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
