"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { useNGOAuth } from "@/lib/ngo-auth-context"
import { AuthModal } from "./auth-modal"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  const walletState = useSelector((state: RootState) => state.wallet)
  const ngoAuth = useNGOAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
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
