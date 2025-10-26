"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import { openAuthModal, setAuthMode } from "@/lib/redux/slices/ui-slice"
import { useNGOAuth } from "@/lib/ngo-auth-context"
import { AuthModal } from "@/components/auth-modal"

export default function NGOAuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useNGOAuth()
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/ngo-dashboard")
      return
    }

    // Get mode from URL query (?mode=signup or ?mode=login)
    const mode = searchParams.get("mode")
    
    // Set auth mode based on URL
    if (mode === "signup") {
      dispatch(setAuthMode("signup"))
    } else {
      dispatch(setAuthMode("login")) // default to login
    }
    
    // Open the modal automatically
    dispatch(openAuthModal())
  }, [searchParams, dispatch, isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">NGO Authentication</h1>
        <p className="text-gray-600 mb-6">
          Use the auth modal to sign up or log in as an NGO. You can also connect your wallet to access donor features.
        </p>
        
        {/* Modal will appear automatically */}
        <AuthModal />
      </div>
    </div>
  )
}