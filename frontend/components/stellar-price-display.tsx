"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

interface StellarPriceProps {
  amount: number
  showLabel?: boolean
}

export function StellarPriceDisplay({ amount, showLabel = true }: StellarPriceProps) {
  const [stellarPrice, setStellarPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=inr")
        const data = await response.json()
        setStellarPrice(data.stellar.inr)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch Stellar price:", error)
        setStellarPrice(15) // Fallback price
        setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading || !stellarPrice) {
    return <span className="text-xs text-muted-foreground">Loading XLM price...</span>
  }

  const stellarAmount = amount / stellarPrice

  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="h-4 w-4 text-accent" />
      <div className="text-sm">
        {showLabel && <span className="text-muted-foreground">≈ </span>}
        <span className="font-bold text-foreground">{stellarAmount.toFixed(4)} XLM</span>
        <span className="text-xs text-muted-foreground ml-1">(₹{stellarPrice.toFixed(2)}/XLM)</span>
      </div>
    </div>
  )
}
