"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { authApi } from "./api-client"

interface NGOProfile {
  Id: string
  NgoName: string
  Email: string
  RegNumber: string
  Description: string
  createdAt: string
  WalletAddr: string // Make sure this is included
}

interface NGOAuthContextType {
  isAuthenticated: boolean
  ngoProfile: NGOProfile | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (ngoData: {
    ngoName: string
    regNumber: string
    description: string
    email: string
    phoneNo: string
    password: string
  }) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const NGOAuthContext = createContext<NGOAuthContextType | undefined>(undefined)

export function NGOAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ngoProfile, setNGOProfile] = useState<NGOProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      // Check if user profile exists in localStorage (set after login/signup)
      const storedProfile = localStorage.getItem("ngo_profile")
      if (storedProfile) {
        const profile = JSON.parse(storedProfile)
        setNGOProfile(profile)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("[v0] Auth check error:", err)
      setIsAuthenticated(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login(email, password)

      // Store profile in localStorage for persistence
      localStorage.setItem("ngo_profile", JSON.stringify(response.userData))

      setNGOProfile(response.userData)
      setIsAuthenticated(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(
    async (ngoData: {
      ngoName: string
      regNumber: string
      description: string
      email: string
      phoneNo: string
      password: string
    }) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await authApi.signup(ngoData)

        // Store profile in localStorage for persistence
        localStorage.setItem("ngo_profile", JSON.stringify(response.userData))

        setNGOProfile(response.userData)
        setIsAuthenticated(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Signup failed"
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const logout = useCallback(() => {
    authApi.logout()
    localStorage.removeItem("ngo_profile")
    setIsAuthenticated(false)
    setNGOProfile(null)
    setError(null)
  }, [])

  return (
    <NGOAuthContext.Provider
      value={{
        isAuthenticated,
        ngoProfile,
        isLoading,
        error,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </NGOAuthContext.Provider>
  )
}

export function useNGOAuth() {
  const context = useContext(NGOAuthContext)
  if (!context) {
    throw new Error("useNGOAuth must be used within NGOAuthProvider")
  }
  return context
}
