import { configureStore } from "@reduxjs/toolkit"
import walletReducer from "./slices/wallet-slice"
import uiReducer from "./slices/ui-slice"
import ngoAuthReducer from "./slices/ngo-auth-slice"
import postsReducer from "./slices/posts-slice"
import donationsReducer from "./slices/donations-slice"

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    ui: uiReducer,
    ngoAuth: ngoAuthReducer,
    posts: postsReducer,
    donations: donationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
