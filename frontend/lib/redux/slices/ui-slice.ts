import { createSlice } from "@reduxjs/toolkit"

interface UIState {
  showAuthModal: boolean
  authMode: "login" | "signup"
}

const initialState: UIState = {
  showAuthModal: true,
  authMode: "login",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.showAuthModal = true
      if (action.payload) {
        state.authMode = action.payload
      }
    },
    closeAuthModal: (state) => {
      state.showAuthModal = false
    },
    setAuthMode: (state, action) => {
      state.authMode = action.payload
    },
  },
})

export const { openAuthModal, closeAuthModal, setAuthMode } = uiSlice.actions
export default uiSlice.reducer
