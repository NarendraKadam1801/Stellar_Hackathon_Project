import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authApi } from "@/lib/api-client"

interface NGOProfile {
  Id: string
  NgoName: string
  Email: string
  RegNumber: string
  Description: string
  createdAt: string
}

interface NGOAuthState {
  isAuthenticated: boolean
  ngoProfile: NGOProfile | null
  isLoading: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null
}

const initialState: NGOAuthState = {
  isAuthenticated: false,
  ngoProfile: null,
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
}

export const loginNGO = createAsyncThunk(
  "ngoAuth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(email, password)
      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      return rejectWithValue(message)
    }
  },
)

export const signupNGO = createAsyncThunk(
  "ngoAuth/signup",
  async (ngoData: {
    ngoName: string
    regNumber: string
    description: string
    email: string
    phoneNo: string
    password: string
  }, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(ngoData)
      return response
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
      state.accessToken = null
      state.refreshToken = null
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
        state.ngoProfile = action.payload.userData
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
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
        state.ngoProfile = action.payload.userData
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
      })
      .addCase(signupNGO.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logoutNGO, clearNGOError } = ngoAuthSlice.actions
export default ngoAuthSlice.reducer
