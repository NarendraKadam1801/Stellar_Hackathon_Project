import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { WalletType } from "@/lib/wallet-types"
import { walletConnectors } from "@/lib/wallet-connectors"
import { 
  isConnected as freighterIsConnected,
  requestAccess as freighterRequestAccess,
  signTransaction as freighterSignTransaction,
  getNetwork as freighterGetNetwork
} from "@stellar/freighter-api"

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
    // Check if Freighter is available
    if (walletType === 'freighter') {
      // Check if Freighter is connected using SDK
      const connectedResult = await freighterIsConnected()
      if (connectedResult.error || !connectedResult.isConnected) {
        throw new Error("Freighter extension is not installed or not available. Please install from https://freighter.app")
      }

      // Request access - this will prompt user to allow the app if not already allowed
      const accessResult = await freighterRequestAccess()
      if (accessResult.error) {
        throw new Error(accessResult.error || "User denied access to Freighter")
      }

      const publicKey = accessResult.address

      if (!publicKey) {
        throw new Error("Failed to get address from Freighter")
      }

      // Store wallet connection in sessionStorage (cleared when browser closes)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('wallet_connected', 'true')
        sessionStorage.setItem('wallet_type', 'freighter')
        sessionStorage.setItem('wallet_publicKey', publicKey)
      }

      // Fetch balance - don't fail connection if balance fetch fails
      let balance = 0
      try {
        const { getAccountBalance } = await import("@/lib/stellar-utils")
        balance = await getAccountBalance(publicKey)
      } catch (error) {
        console.warn("Balance fetch failed, continuing with 0 balance:", error)
      }

      return { publicKey, balance, walletType }
    }

    // Fallback to other wallet connectors
    const connector = walletConnectors[walletType]
    if (!connector) {
      throw new Error("Wallet type not supported")
    }

    const publicKey = await connector.connect()

    // Store wallet connection in sessionStorage (cleared when browser closes)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('wallet_connected', 'true')
      sessionStorage.setItem('wallet_type', walletType)
      sessionStorage.setItem('wallet_publicKey', publicKey)
    }

    // Fetch balance - don't fail connection if balance fetch fails
    let balance = 0
    try {
      const { getAccountBalance } = await import("@/lib/stellar-utils")
      balance = await getAccountBalance(publicKey)
    } catch (error) {
      console.warn("Balance fetch failed, continuing with 0 balance:", error)
    }

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
    restoreWalletState: (state) => {
      // Restore wallet state from sessionStorage on app load
      if (typeof window !== 'undefined') {
        try {
          const isConnected = sessionStorage.getItem('wallet_connected') === 'true'
          const walletType = sessionStorage.getItem('wallet_type')
          const publicKey = sessionStorage.getItem('wallet_publicKey')
          
          if (isConnected && walletType && publicKey) {
            state.isConnected = true
            state.walletType = walletType as any
            state.publicKey = publicKey
            state.error = null
            console.log('Wallet state restored from sessionStorage:', { walletType, publicKey })
          }
        } catch (error) {
          console.error('Error restoring wallet state:', error)
          // Clear potentially corrupted state
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('wallet_connected')
            sessionStorage.removeItem('wallet_type')
            sessionStorage.removeItem('wallet_publicKey')
          }
        }
      }
    },
    disconnectWallet: (state) => {
      // Clear all wallet-related data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wallet_connected')
        localStorage.removeItem('wallet_type')
        localStorage.removeItem('wallet_publicKey')
        localStorage.removeItem('wallet_balance')
        
        // Clear session storage as well
        sessionStorage.removeItem('wallet_state')
        
        // Clear cookies that might store wallet info
        document.cookie = 'wallet_connected=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'wallet_address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      // Reset state
      state.isConnected = false
      state.publicKey = null
      state.balance = 0
      state.walletType = null
      state.error = null
    },
    clearWalletError: (state) => {
      state.error = null
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
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

export const signTransaction = createAsyncThunk(
  "wallet/signTransaction",
  async (transactionXDR: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any
      const walletType = state.wallet.walletType

      if (walletType === 'freighter') {
        // Use Freighter SDK for signing
        const result = await freighterSignTransaction(transactionXDR, {
          networkPassphrase: "Test SDF Network ; September 2015", // Testnet passphrase
        })
        
        if (result.error) {
          throw new Error(result.error || "Transaction signing failed")
        }
        
        return result.signedTxXdr
      } else {
        // Fallback to wallet connectors
        const connector = walletConnectors[walletType]
        if (connector && connector.signTransaction) {
          return await connector.signTransaction(transactionXDR)
        }
        throw new Error("Only Freighter wallet is supported for signing")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign transaction"
      return rejectWithValue(message)
    }
  }
)

export const { restoreWalletState, disconnectWallet, clearWalletError, setBalance, setError } = walletSlice.actions
export default walletSlice.reducer
