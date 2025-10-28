"use client"

import * as React from "react"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { WalletData } from "./wallet-data"
import { StellarPriceDisplay } from "./stellar-price-display"
import { logoutNGO } from "@/lib/redux/slices/ngo-auth-slice"
import { disconnectWallet } from "@/lib/redux/slices/wallet-slice"
import { clearAllBrowserData } from "@/lib/logout-utils"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMounted, setIsMounted] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { error, isConnected: walletConnected } = useSelector((state: RootState) => state.wallet)
  const { isAuthenticated: ngoAuthenticated, ngoProfile } = useSelector((state: RootState) => state.ngoAuth)
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNGOLogout = () => {
    // Clear NGO authentication
    dispatch(logoutNGO())
    // Redirect to home
    router.push('/')
  }

  const handleFullLogout = () => {
    // Clear all browser data
    clearAllBrowserData()
    // Clear Redux state
    dispatch(logoutNGO())
    dispatch(disconnectWallet())
    // Redirect to home
    router.push('/')
  }

  // Don't render anything on the server for authenticated content
  if (!isMounted) {
    return (
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AB</span>
            </div>
            <span className="font-bold text-lg text-foreground">AidBridge</span>
          </Link>
          
          {/* Loading state for navigation */}
          <div className="hidden md:flex gap-8">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-3">
            <StellarPriceDisplay />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
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
          <Link href="/features" className="text-foreground hover:text-primary transition">
            Features
          </Link>
          {ngoAuthenticated ? (
            <Link href="/ngo-dashboard" className="text-foreground hover:text-primary transition">
              NGO Dashboard
            </Link>
          ) : (
            <Link href="/verify" className="text-foreground hover:text-primary transition">
              Verify
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Only show price in dashboard where needed */}
          {typeof window !== 'undefined' && window.location.pathname.includes('dashboard') && (
            <StellarPriceDisplay showPrice={true} />
          )}
          
          {/* NGO Authentication Section */}
          {ngoAuthenticated && ngoProfile && (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">NGO</p>
                <p className="text-sm font-semibold text-foreground">{ngoProfile.name}</p>
              </div>
              <Button
                onClick={handleNGOLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                title="Logout NGO"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
          
          {/* User Wallet Section - Only show if NOT NGO authenticated */}
          {!ngoAuthenticated && <WalletData />}
        </div>
      </div>
      {error && <div className="bg-red-50 border-t border-red-200 px-4 py-2 text-sm text-red-600">{error}</div>}
    </header>
  )
}
