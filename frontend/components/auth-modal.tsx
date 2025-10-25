"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { closeAuthModal, setAuthMode } from "@/lib/redux/slices/ui-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { WalletSelector } from "./wallet-selector"
import { Loader2, AlertCircle, X } from "lucide-react"
import { useNGOAuth } from "@/lib/ngo-auth-context"

export function AuthModal() {
  const dispatch = useDispatch<AppDispatch>()
  const { showAuthModal, authMode } = useSelector((state: RootState) => state.ui)
  const { isLoading: ngoLoading, error: ngoError, login, signup } = useNGOAuth()
  const { isConnecting: walletConnecting } = useSelector((state: RootState) => state.wallet)

  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    ngoName: "",
    registrationNumber: "",
    description: "",
  })

  if (!showAuthModal) return null

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      dispatch(closeAuthModal())
    } catch (error) {
      console.error("[v0] Login error:", error)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await signup({
        name: formData.ngoName,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        description: formData.description,
      })
      dispatch(closeAuthModal())
    } catch (error) {
      console.error("[v0] Signup error:", error)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 relative">
          <button
            onClick={() => dispatch(closeAuthModal())}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {authMode === "login" ? "NGO Login" : "NGO Registration"}
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            {authMode === "login"
              ? "Sign in to manage your tasks and donations"
              : "Create an account to start fundraising"}
          </p>

          {ngoError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{ngoError}</p>
            </div>
          )}

          <form onSubmit={authMode === "login" ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
            {authMode === "signup" && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">NGO Name</label>
                  <Input
                    placeholder="Your organization name"
                    value={formData.ngoName}
                    onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Registration Number</label>
                  <Input
                    placeholder="NGO registration number"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    placeholder="Tell us about your organization"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md text-foreground"
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            {authMode === "signup" && (
              <div>
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={ngoLoading} className="flex-1 bg-primary hover:bg-primary/90">
                {ngoLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {authMode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : authMode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
              {authMode === "signup" && (
                <Button type="button" variant="outline" onClick={() => dispatch(closeAuthModal())} className="flex-1">
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="my-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            onClick={() => setShowWalletSelector(true)}
            disabled={walletConnecting}
            variant="outline"
            className="w-full"
          >
            {walletConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>

          <div className="mt-6 text-center">
            {authMode === "login" ? (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => dispatch(setAuthMode("signup"))}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => dispatch(setAuthMode("login"))}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>

      <WalletSelector isOpen={showWalletSelector} onClose={() => setShowWalletSelector(false)} />
    </>
  )
}
