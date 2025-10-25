"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { connectWallet } from "@/lib/redux/slices/wallet-slice"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { WalletSelector } from "./wallet-selector"

interface ConnectButtonProps {
  label?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ConnectButton({ 
  label = "Connect Wallet", 
  variant = "outline",
  size = "default",
  className = ""
}: ConnectButtonProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isConnecting } = useSelector((state: RootState) => state.wallet)
  const [walletSelectorOpen, setWalletSelectorOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setWalletSelectorOpen(true)}
        disabled={isConnecting}
        variant={variant}
        size={size}
        className={className}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : label}
      </Button>

      <WalletSelector 
        isOpen={walletSelectorOpen} 
        onClose={() => setWalletSelectorOpen(false)} 
      />
    </>
  )
}


