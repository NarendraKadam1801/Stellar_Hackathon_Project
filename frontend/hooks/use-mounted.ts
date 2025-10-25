import { useEffect, useState } from "react"

/**
 * Hook to check if component is mounted on client side
 * Prevents hydration mismatches in Next.js
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}


