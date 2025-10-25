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
      // Simulate API call to backend
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

      return mockNGO
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      return rejectWithValue(message)
    }
  },
)

export const signupNGO = createAsyncThunk(
  "ngoAuth/signup",
  async (ngoData: Omit<NGOProfile, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newNGO: NGOProfile = {
        ...ngoData,
        id: "ngo-" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      }

      return newNGO
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
      state.isAuthenticated = false
      state.ngoProfile = null
      state.error = null
    },
    clearNGOError: (state) => {
      state.error = null
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

export const { logoutNGO, clearNGOError } = ngoAuthSlice.actions
export default ngoAuthSlice.reducer
