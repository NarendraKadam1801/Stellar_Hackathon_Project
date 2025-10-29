"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

interface StellarPriceProps {
  showPrice?: boolean;
  onPriceLoad?: (price: number) => void;
}

export function StellarPriceDisplay({ showPrice = false, onPriceLoad }: StellarPriceProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const fetchPrice = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=inr")
        const data = await response.json()
        if (data?.stellar?.inr) {
          setPrice(data.stellar.inr)
          onPriceLoad?.(data.stellar.inr)
        }
      } catch (error) {
        console.error("Error fetching Stellar price:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isMounted && showPrice) {
      fetchPrice()
      const interval = setInterval(fetchPrice, 5 * 60 * 1000) // Update every 5 minutes
      return () => clearInterval(interval)
    }
  }, [isMounted, showPrice, onPriceLoad])

  // Don't render anything if not showing price
  if (!showPrice) {
    return null
  }

  // Don't render anything on server-side
  if (!isMounted) {
    return <div className="h-5 w-24" />
  }

  // If still loading or no price available
  if (isLoading || !price) {
    return <div className="h-5 w-24 bg-muted/20 rounded animate-pulse" />
  }

  // Show the current XLM price in INR
  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="h-4 w-4 text-green-500" />
      <div className="text-sm">
        <span className="font-semibold text-foreground">1 XLM</span>
        <span className="text-xs text-muted-foreground ml-1">= ₹{price.toFixed(2)}</span>
      </div>
    </div>
  )
}
