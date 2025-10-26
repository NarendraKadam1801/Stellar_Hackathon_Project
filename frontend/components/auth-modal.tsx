"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  const { isLoading: ngoLoading, error: ngoError, login, signup} = useNGOAuth()
  const { isConnecting: walletConnecting } = useSelector((state: RootState) => state.wallet)

  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    ngoName: "",
    phoneNo: "",
    registrationNumber: "",
    description: "",
  })

  // Clear form and error when modal closes or auth mode changes
  useEffect(() => {
    if (!showAuthModal) {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        ngoName: "",
        phoneNo: "",
        registrationNumber: "",
        description: "",
      })
    }
  }, [showAuthModal])

  // useEffect(() => {
  // }, [authMode])

  if (!showAuthModal) return null

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      // Modal will close automatically via AuthGuard when isAuthenticated becomes true
      dispatch(closeAuthModal())
    } catch (error) {
      console.error("Login error:", error)
      // Error is already handled in context
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }

    try {
      await signup({
        ngoName: formData.ngoName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        regNumber: formData.registrationNumber,
        description: formData.description,
        password: formData.password,
      })
      // Modal will close automatically via AuthGuard when isAuthenticated becomes true
      dispatch(closeAuthModal())
    } catch (error) {
      console.error("Signup error:", error)
      // Error is already handled in context
    }
  }

  const handleClose = () => {
    dispatch(closeAuthModal())
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={handleClose}
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
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
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
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
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
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                minLength={6}
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
                  minLength={6}
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={ngoLoading} 
                className="flex-1 bg-primary hover:bg-primary/90"
              >
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
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose} 
                  className="flex-1"
                  disabled={ngoLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            onClick={() => setShowWalletSelector(true)}
            disabled={walletConnecting || ngoLoading}
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
                  type="button"
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
                  type="button"
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