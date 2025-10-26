"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { useNGOAuth } from "@/lib/ngo-auth-context"
import { AuthModal } from "./auth-modal"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [mounted, setMounted] = useState(false)
  const walletState = useSelector((state: RootState) => state.wallet)
  const ngoAuth = useNGOAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render auth logic on server or until mounted (prevents hydration issues)
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  const isWalletConnected = walletState?.isConnected ?? false
  const isNGOAuthenticated = ngoAuth?.isAuthenticated ?? false
  const shouldShowAuth = !isWalletConnected && !isNGOAuthenticated

  return (
    <>
      {children}
      {shouldShowAuth && <AuthModal />}
    </>
  )
}

// Named export (primary)
export default AuthGuard