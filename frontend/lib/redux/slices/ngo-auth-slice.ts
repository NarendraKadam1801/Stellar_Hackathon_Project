import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface NGOProfile {
  id: string
  name: string
  email: string
  registrationNumber: string
  description: string
  logo?: string
  createdAt: Date
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
        
        // Set cookies for authentication
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`
        
        // Convert backend user data to frontend format
        const ngoProfile: NGOProfile = {
          id: userData.Id,
          name: userData.NgoName,
          email: userData.Email,
          registrationNumber: userData.RegNumber,
          description: userData.Description,
          createdAt: new Date(userData.createdAt || Date.now()),
        }
        
        // Store NGO profile in cookie
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
  async (ngoData: Omit<NGOProfile, "id" | "createdAt"> & { password: string; phoneNo: string }, { rejectWithValue }) => {
    try {
      const { apiService } = await import("@/lib/api-service")
      const response = await apiService.signup({
        ngoName: ngoData.name,
        regNumber: ngoData.registrationNumber,
        description: ngoData.description,
        email: ngoData.email,
        phoneNo: ngoData.phoneNo,
        password: ngoData.password,
      })
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, userData } = response.data
        
        // Set cookies for authentication
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`
        
        // Convert backend user data to frontend format
        const ngoProfile: NGOProfile = {
          id: userData.Id,
          name: userData.NgoName,
          email: userData.Email,
          registrationNumber: userData.RegNumber,
          description: userData.Description,
          createdAt: new Date(userData.createdAt || Date.now()),
        }
        
        // Store NGO profile in cookie
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
      // Clear cookies
      document.cookie = "accessToken=; path=/; max-age=0"
      document.cookie = "refreshToken=; path=/; max-age=0"
      document.cookie = "ngo_profile=; path=/; max-age=0"
      
      state.isAuthenticated = false
      state.ngoProfile = null
      state.error = null
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
