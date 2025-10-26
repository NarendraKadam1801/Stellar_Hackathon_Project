import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  showAuthModal: boolean
  authMode: "login" | "signup"
}

const initialState: UIState = {
  showAuthModal: false, // Changed to false - modal won't auto-show
  authMode: "login",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
  openAuthModal: (state, action: PayloadAction<"login" | "signup" | undefined>) => {
  state.showAuthModal = true
  if (action.payload) {
    state.authMode = action.payload
  }
},

    closeAuthModal: (state) => {
      state.showAuthModal = false
    },
    setAuthMode: (state, action: PayloadAction<"login" | "signup">) => {
      state.authMode = action.payload
    },
  },
})

export const { openAuthModal, closeAuthModal, setAuthMode } = uiSlice.actions
export default uiSlice.reducer // Fixed typo: was "reduce", now "reducer"