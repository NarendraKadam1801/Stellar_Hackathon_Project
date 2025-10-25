"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { WalletData } from "./wallet-data"
import { useNGOAuth } from "@/lib/ngo-auth-context"

export function Header() {
  const { error } = useSelector((state: RootState) => state.wallet)
  const { isAuthenticated, ngoProfile } = useNGOAuth()

  return (
    <>
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AB</span>
            </div>
            <span className="font-bold text-lg text-foreground">AidBridge</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/explore" className="text-foreground hover:text-primary transition">
              Explore
            </Link>
            {isAuthenticated && (
              <Link href="/ngo-dashboard" className="text-foreground hover:text-primary transition">
                NGO Dashboard
              </Link>
            )}
            <Link href="/verify" className="text-foreground hover:text-primary transition">
              Verify
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && ngoProfile && (
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">NGO</p>
                <p className="text-sm font-semibold text-foreground">{ngoProfile.name}</p>
              </div>
            )}
            <WalletData />
          </div>
        </div>
        {error && <div className="bg-red-50 border-t border-red-200 px-4 py-2 text-sm text-red-600">{error}</div>}
      </header>
    </>
  )
}
