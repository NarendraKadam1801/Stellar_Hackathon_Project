import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { WalletType } from "@/lib/wallet-types"
import { walletConnectors } from "@/lib/wallet-connectors"

interface WalletState {
  isConnected: boolean
  publicKey: string | null
  balance: number
  isConnecting: boolean
  error: string | null
  walletType: WalletType | null
}

const initialState: WalletState = {
  isConnected: false,
  publicKey: null,
  balance: 0,
  isConnecting: false,
  error: null,
  walletType: null,
}

export const connectWallet = createAsyncThunk("wallet/connect", async (walletType: WalletType, { rejectWithValue }) => {
  try {
    const connector = walletConnectors[walletType]
    if (!connector) {
      throw new Error("Wallet type not supported")
    }

    const publicKey = await connector.connect()

    // Fetch balance
    const { getAccountBalance } = await import("@/lib/stellar-utils")
    const balance = await getAccountBalance(publicKey)

    return { publicKey, balance, walletType }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect wallet"
    return rejectWithValue(message)
  }
})

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    disconnectWallet: (state) => {
      state.isConnected = false
      state.publicKey = null
      state.balance = 0
      state.error = null
      state.walletType = null
    },
    clearWalletError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.isConnecting = true
        state.error = null
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isConnecting = false
        state.isConnected = true
        state.publicKey = action.payload.publicKey
        state.balance = action.payload.balance
        state.walletType = action.payload.walletType
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isConnecting = false
        state.error = action.payload as string
      })
  },
})

export const { disconnectWallet, clearWalletError } = walletSlice.actions
export default walletSlice.reducer
