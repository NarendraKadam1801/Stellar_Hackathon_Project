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

  // Don't force auth modal - let users browse freely
  // Auth modal will be shown when they try to donate or create tasks
  return <>{children}</>
}
