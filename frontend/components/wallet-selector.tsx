"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { connectWallet } from "@/lib/redux/slices/wallet-slice"
import { X } from "lucide-react"
import type { WalletType } from "@/lib/wallet-types"

interface WalletSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (walletType: WalletType) => void
}

export function WalletSelector({ isOpen, onClose, onSelect }: WalletSelectorProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isConnecting, error } = useSelector((state: RootState) => state.wallet)
  const [selectedError, setSelectedError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const handleConnect = async (walletType: WalletType) => {
    setSelectedError(null)
    setDebugInfo("")
    
    // Debug info for Freighter
    if (walletType === "freighter") {
      const debug = {
        windowStellar: !!(window as any).stellar,
        windowFreighter: !!(window as any).freighter,
        windowFreighterApi: !!(window as any).freighterApi,
        windowStellarFreighter: !!(window as any).StellarFreighter,
        userAgent: navigator.userAgent,
        location: window.location.hostname
      }
      setDebugInfo(`Debug: stellar=${debug.windowStellar}, freighter=${debug.windowFreighter}, freighterApi=${debug.windowFreighterApi}, StellarFreighter=${debug.windowStellarFreighter}`)
    }
    
    try {
      await dispatch(connectWallet(walletType)).unwrap()
      if (onSelect) {
        onSelect(walletType)
      }
      onClose()
    } catch (err) {
      setSelectedError(err instanceof Error ? err.message : "Connection failed")
    }
  }

  if (!isOpen) return null

  const walletList: Array<{ id: WalletType; name: string; icon: string; description: string }> = [
    {
      id: "freighter",
      name: "Freighter",
      icon: "🔐",
      description: "Browser extension wallet for Stellar",
    },
    {
      id: "albedo",
      name: "Albedo",
      icon: "🎭",
      description: "Secure browser extension wallet",
    },
    {
      id: "stellar-expert",
      name: "Stellar Expert Signer",
      icon: "⭐",
      description: "Web-based transaction signer",
    },
    {
      id: "lobstr",
      name: "LOBSTR Vault",
      icon: "🏦",
      description: "Mobile and web wallet",
    },
    {
      id: "ledger",
      name: "Ledger",
      icon: "💳",
      description: "Hardware wallet support",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Connect Wallet</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {walletList.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
              className="w-full p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{wallet.name}</div>
                  <div className="text-sm text-gray-600">{wallet.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {(error || selectedError) && (
          <div className="px-6 pb-6">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error || selectedError}
            </div>
          </div>
        )}

        {debugInfo && (
          <div className="px-6 pb-6">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {debugInfo}
            </div>
          </div>
        )}

        <div className="px-6 pb-6 border-t pt-6">
          <p className="text-xs text-gray-600">
            Don't have a wallet? Download Freighter or another Stellar wallet to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
