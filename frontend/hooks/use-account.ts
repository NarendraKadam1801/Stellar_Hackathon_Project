import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

/**
 * Hook to get current wallet account information
 * Returns account data with proper typing
 */
export function useAccount() {
  const { isConnected, publicKey, balance, walletType } = useSelector(
    (state: RootState) => state.wallet,
  )

  if (!isConnected || !publicKey) {
    return null
  }

  return {
    publicKey,
    balance,
    walletType,
    displayName: `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
    shortAddress: `${publicKey.slice(0, 8)}...${publicKey.slice(-6)}`,
    fullAddress: publicKey,
  }
}


