"use client"

import { useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { disconnectWallet } from "@/lib/redux/slices/wallet-slice"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { WalletSelector } from "./wallet-selector"
import { useNGOAuth } from "@/lib/ngo-auth-context"

export function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const { isConnected, publicKey, balance, isConnecting, error, walletType } = useSelector(
    (state: RootState) => state.wallet,
  )
  const { isAuthenticated, ngoProfile } = useNGOAuth()
  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false)

  const handleWalletConnect = () => {
    if (!isConnected) {
      setWalletSelectorOpen(true)
    } else {
      dispatch(disconnectWallet())
    }
  }

  const displayAddress = publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : ""

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
            {isConnected && (
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-sm font-semibold text-foreground">{balance.toFixed(2)} XLM</p>
              </div>
            )}
            {isConnected && walletType && (
              <div className="text-xs text-muted-foreground hidden sm:block px-2 py-1 bg-gray-100 rounded">
                {walletType.charAt(0).toUpperCase() + walletType.slice(1)}
              </div>
            )}
            <Button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              variant={isConnected ? "default" : "outline"}
              className={isConnected ? "bg-accent hover:bg-accent/90" : ""}
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : isConnected ? `${displayAddress}` : "Connect Wallet"}
            </Button>
          </div>
        </div>
        {error && <div className="bg-red-50 border-t border-red-200 px-4 py-2 text-sm text-red-600">{error}</div>}
      </header>

      <WalletSelector isOpen={walletSelectorOpen} onClose={() => setWalletSelectorOpen(false)} />
    </>
  )
}
