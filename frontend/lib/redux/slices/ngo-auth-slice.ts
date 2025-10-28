import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface NGOProfile {
  id: string
  name: string
  email: string
  registrationNumber: string
  description: string
  logo?: string
  createdAt: string  // ISO string, not Date object (for Redux serialization)
}

interface NGOAuthState {
  isAuthenticated: boolean
  ngoProfile: NGOProfile | null
  isLoading: boolean
  error: string | null
}

const initialState: NGOAuthState = {
  isAuthenticated: false,
  ngoProfile: null,
  isLoading: false,
  error: null,
}

export const loginNGO = createAsyncThunk(
  "ngoAuth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { apiService } = await import("@/lib/api-service")
      const response = await apiService.login({ email, password })
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, userData } = response.data
        
        // Store in localStorage for frontend access
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
        }
        
        // Set cookies for authentication (backend uses these)
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`
        
        // Convert backend user data to frontend format
        const ngoProfile: NGOProfile = {
          id: userData.Id,
          name: userData.NgoName,
          email: userData.Email,
          registrationNumber: userData.RegNumber,
          description: userData.Description,
          createdAt: userData.createdAt || new Date().toISOString(),  // Store as ISO string
        }
        
        // Store NGO profile in localStorage and cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('ngo_profile', JSON.stringify(ngoProfile))
        }
        document.cookie = `ngo_profile=${encodeURIComponent(JSON.stringify(ngoProfile))}; path=/; max-age=${7 * 24 * 60 * 60}`
        
        return ngoProfile
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      return rejectWithValue(message)
    }
  },
)

export const signupNGO = createAsyncThunk(
  "ngoAuth/signup",
  async (ngoData: any, { rejectWithValue }) => {
    try {
      const { apiService } = await import("@/lib/api-service")
      const response = await apiService.signup({
        ngoName: ngoData.ngoName,
        regNumber: ngoData.regNumber,
        description: ngoData.description,
        email: ngoData.email,
        phoneNo: ngoData.phoneNo,
        password: ngoData.password,
      })
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, userData } = response.data
        
        // Store in localStorage for frontend access
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
        }
        
        // Set cookies for authentication (backend uses these)
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`
        
        // Convert backend user data to frontend format
        const ngoProfile: NGOProfile = {
          id: userData.Id,
          name: userData.NgoName,
          email: userData.Email,
          registrationNumber: userData.RegNumber,
          description: userData.Description,
          createdAt: userData.createdAt || new Date().toISOString(),  // Store as ISO string
        }
        
        // Store NGO profile in localStorage and cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('ngo_profile', JSON.stringify(ngoProfile))
        }
        document.cookie = `ngo_profile=${encodeURIComponent(JSON.stringify(ngoProfile))}; path=/; max-age=${7 * 24 * 60 * 60}`
        
        return ngoProfile
      } else {
        throw new Error(response.message || "Signup failed")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed"
      return rejectWithValue(message)
    }
  },
)

const ngoAuthSlice = createSlice({
  name: "ngoAuth",
  initialState,
  reducers: {
    logoutNGO: (state) => {
      // Clear all auth-related data from localStorage and cookies
      if (typeof window !== 'undefined') {
        // Clear authentication data
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('ngo_profile')
        
        // Clear wallet data from localStorage
        localStorage.removeItem('wallet_connected')
        localStorage.removeItem('wallet_type')
        localStorage.removeItem('wallet_publicKey')
        localStorage.removeItem('wallet_balance')
        
        // Clear session storage
        sessionStorage.clear()
      }
      
      // Clear all auth cookies
      const cookieOptions = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      document.cookie = `accessToken=; ${cookieOptions}`
      document.cookie = `refreshToken=; ${cookieOptions}`
      document.cookie = `ngo_profile=; ${cookieOptions}`
      
      // Clear wallet-related cookies
      document.cookie = `wallet_connected=; ${cookieOptions}`
      document.cookie = `wallet_address=; ${cookieOptions}`
      document.cookie = `wallet_type=; ${cookieOptions}`
      
      // Clear all cookies (brute force approach for development)
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        document.cookie = `${name}=; ${cookieOptions}`
      }
      
      // Reset state
      state.isAuthenticated = false
      state.ngoProfile = null
      state.error = null
      
      // Force a full page reload to ensure all state is cleared
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },
    clearNGOError: (state) => {
      state.error = null
    },
    checkNGOCookie: (state) => {
      // Check if NGO is already logged in via cookies
      if (typeof window !== "undefined") {
        const cookies = document.cookie.split("; ").reduce(
          (acc, cookie) => {
            const [key, value] = cookie.split("=")
            acc[key] = value
            return acc
          },
          {} as Record<string, string>,
        )

        if (cookies.accessToken && cookies.ngo_profile) {
          try {
            const profile = JSON.parse(decodeURIComponent(cookies.ngo_profile))
            state.ngoProfile = profile
            state.isAuthenticated = true
          } catch (err) {
            console.error("Error parsing NGO profile from cookie:", err)
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginNGO.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginNGO.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.ngoProfile = action.payload
      })
      .addCase(loginNGO.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(signupNGO.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signupNGO.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.ngoProfile = action.payload
      })
      .addCase(signupNGO.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logoutNGO, clearNGOError, checkNGOCookie } = ngoAuthSlice.actions
export default ngoAuthSlice.reducer
