export const walletConnectors = {
  freighter: {
    name: "Freighter",
    icon: "🔐",
    isInstalled: () => {
      if (typeof window === "undefined") return false
      
      // Check multiple possible Freighter API locations
      const freighterAPIs = [
        (window as any).stellar,
        (window as any).freighter,
        (window as any).freighterApi,
        (window as any).StellarFreighter,
        (window as any).stellarFreighter
      ]
      
      return freighterAPIs.some(api => !!api)
    },
    connect: async () => {
      // Check for modern Freighter API first
      if ((window as any).stellar) {
        const response = await (window as any).stellar.requestAccess({ domain: window.location.hostname })
        if (response.error) throw new Error(response.error.message)
        return response.publicKey
      }
      
      // Fallback to legacy Freighter API
      if ((window as any).freighter) {
        const response = await (window as any).freighter.requestAccess({ domain: window.location.hostname })
        if (response.error) throw new Error(response.error.message)
        return response.publicKey
      }
      
      throw new Error("Freighter not installed")
    },
    signTransaction: async (tx: string) => {
      // Check for modern Freighter API first
      if ((window as any).stellar) {
        const response = await (window as any).stellar.signTransaction(tx, {
          networkPassphrase: "Test SDF Network ; September 2015",
        })
        if (response.error) throw new Error(response.error.message)
        return response.signedXDR
      }
      
      // Fallback to legacy Freighter API
      if ((window as any).freighter) {
        const response = await (window as any).freighter.signTransaction(tx, {
          networkPassphrase: "Test SDF Network ; September 2015",
        })
        if (response.error) throw new Error(response.error.message)
        return response.signedXDR
      }
      
      throw new Error("Freighter not available")
    },
  },

  albedo: {
    name: "Albedo",
    icon: "🎭",
    isInstalled: () => typeof window !== "undefined" && !!window.albedo,
    connect: async () => {
      if (!window.albedo) throw new Error("Albedo not installed")
      const result = await window.albedo.publicKey()
      return result.publicKey
    },
    signTransaction: async (tx: string) => {
      if (!window.albedo) throw new Error("Albedo not available")
      const result = await window.albedo.tx({
        xdr: tx,
        networkPassphrase: "Test SDF Network ; September 2015",
      })
      return result.signed_envelope_xdr
    },
  },

  "stellar-expert": {
    name: "Stellar Expert Signer",
    icon: "⭐",
    isInstalled: () => true, // Web-based, always available
    connect: async () => {
      // Stellar Expert uses a web-based signer
      return new Promise((resolve, reject) => {
        const publicKey = prompt("Enter your Stellar public key:")
        if (publicKey && publicKey.startsWith("G")) {
          resolve(publicKey)
        } else {
          reject(new Error("Invalid public key"))
        }
      })
    },
    signTransaction: async (tx: string) => {
      // For Stellar Expert, we'd typically redirect to their signer
      // For demo purposes, we'll show a message
      alert("Please sign the transaction on Stellar Expert Signer")
      return tx // In production, this would be the signed XDR
    },
  },

  lobstr: {
    name: "LOBSTR Vault",
    icon: "🏦",
    isInstalled: () => true, // Web-based, always available
    connect: async () => {
      return new Promise((resolve, reject) => {
        const publicKey = prompt("Enter your LOBSTR public key:")
        if (publicKey && publicKey.startsWith("G")) {
          resolve(publicKey)
        } else {
          reject(new Error("Invalid public key"))
        }
      })
    },
    signTransaction: async (tx: string) => {
      alert("Please sign the transaction in LOBSTR Vault")
      return tx
    },
  },

  ledger: {
    name: "Ledger",
    icon: "💳",
    isInstalled: () => true, // Can be installed
    connect: async () => {
      return new Promise((resolve, reject) => {
        const publicKey = prompt("Enter your Ledger Stellar public key:")
        if (publicKey && publicKey.startsWith("G")) {
          resolve(publicKey)
        } else {
          reject(new Error("Invalid public key"))
        }
      })
    },
    signTransaction: async (tx: string) => {
      alert("Please sign the transaction on your Ledger device")
      return tx
    },
  },
}

declare global {
  interface Window {
    stellar?: {
      requestAccess: (options: { domain: string }) => Promise<{
        publicKey?: string
        error?: { message: string }
      }>
      signTransaction: (
        tx: string,
        options: { networkPassphrase: string },
      ) => Promise<{
        signedXDR?: string
        error?: { message: string }
      }>
    }
    albedo?: {
      publicKey: () => Promise<{ publicKey: string }>
      tx: (options: {
        xdr: string
        networkPassphrase: string
      }) => Promise<{ signed_envelope_xdr: string }>
    }
  }
}
