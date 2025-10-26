export const walletConnectors = {
  freighter: {
    name: "Freighter",
    icon: "🔐",
    isInstalled: () => typeof window !== "undefined" && !!window.stellar,
    connect: async () => {
      if (!window.stellar) throw new Error("Freighter not installed")
      const response = await window.stellar.requestAccess({ domain: "aidbridge.app" })
      if (response.error) throw new Error(response.error.message)
      return response.publicKey
    },
    signTransaction: async (tx: string) => {
      if (!window.stellar) throw new Error("Freighter not available")
      const response = await window.stellar.signTransaction(tx, {
        networkPassphrase: "Test SDF Network ; September 2015",
      })
      if (response.error) throw new Error(response.error.message)
      return response.signedXDR
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
