import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/lib/redux-provider"
import { AuthGuard } from "@/components/auth-guard"
import { NGOAuthProvider } from "@/lib/ngo-auth-context"
import { WalletStateManager } from "@/components/wallet-state-manager"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AidBridge - Transparent NGO Donations",
  description: "Donate small. Track big. Every rupee verified on the blockchain.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ReduxProvider>
          <WalletStateManager />
          <NGOAuthProvider>
            <AuthGuard>
              {children}
              <Analytics />
            </AuthGuard>
          </NGOAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
