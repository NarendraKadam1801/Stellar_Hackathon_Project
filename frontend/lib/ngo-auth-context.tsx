"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

interface NGOProfile {
  id: string
  name: string
  email: string
  registrationNumber: string
  description: string
  logo?: string
  createdAt: Date
}

interface NGOAuthContextType {
  isAuthenticated: boolean
  ngoProfile: NGOProfile | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (ngoData: Omit<NGOProfile, "id" | "createdAt">) => Promise<void>
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
      // Check if NGO cookie exists
      const cookies = document.cookie.split("; ").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.split("=")
          acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )

      if (cookies.ngo_auth_token && cookies.ngo_profile) {
        const profile = JSON.parse(decodeURIComponent(cookies.ngo_profile))
        setNGOProfile(profile)
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error("[v0] Auth check error:", err)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to verify NGO credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock NGO data - in real app, this would come from backend
      const mockNGO: NGOProfile = {
        id: "ngo-" + Math.random().toString(36).substr(2, 9),
        name: "Education for All Foundation",
        email,
        registrationNumber: "NGO-2024-001",
        description: "Providing quality education to underprivileged children",
        createdAt: new Date(),
      }

      const token = "token_" + Math.random().toString(36).substr(2, 20)
      document.cookie = `ngo_auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      document.cookie = `ngo_profile=${encodeURIComponent(JSON.stringify(mockNGO))}; path=/; max-age=${7 * 24 * 60 * 60}`

      setNGOProfile(mockNGO)
      setIsAuthenticated(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (ngoData: Omit<NGOProfile, "id" | "createdAt">) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to register NGO
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newNGO: NGOProfile = {
        ...ngoData,
        id: "ngo-" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      }

      const token = "token_" + Math.random().toString(36).substr(2, 20)
      document.cookie = `ngo_auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      document.cookie = `ngo_profile=${encodeURIComponent(JSON.stringify(newNGO))}; path=/; max-age=${7 * 24 * 60 * 60}`

      setNGOProfile(newNGO)
      setIsAuthenticated(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    document.cookie = "ngo_auth_token=; path=/; max-age=0"
    document.cookie = "ngo_profile=; path=/; max-age=0"
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
