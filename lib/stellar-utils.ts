// This simulates Stellar SDK functionality without requiring the actual package

// Mock Stellar SDK classes and functions
const Networks = {
  TESTNET_NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
}

const BASE_FEE = "100"

class Server {
  constructor(private url: string) {}

  async loadAccount(publicKey: string) {
    // Mock account data
    return {
      id: publicKey,
      account_id: publicKey,
      balances: [
        {
          balance: "1000.0000000",
          asset_type: "native",
        },
      ],
      sequence: "1",
    }
  }

  async submitTransaction(signedTx: any) {
    // Mock transaction submission
    return {
      hash: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ledger: Math.floor(Math.random() * 1000000),
      successful: true,
    }
  }
}

class TransactionBuilder {
  private operations: any[] = []
  private memo: any = null
  private timeout = 30

  constructor(
    private account: any,
    private options: any,
  ) {}

  addMemo(memo: any) {
    this.memo = memo
    return this
  }

  addOperation(operation: any) {
    this.operations.push(operation)
    return this
  }

  setTimeout(timeout: number) {
    this.timeout = timeout
    return this
  }

  build() {
    return {
      toEnvelope: () => ({
        toXDR: () => `mock_xdr_${Date.now()}`,
      }),
    }
  }
}

const Operation = {
  payment: (options: any) => ({
    type: "payment",
    ...options,
  }),
}

const Asset = {
  native: () => ({
    code: "XLM",
    issuer: null,
  }),
}

const Memo = {
  text: (text: string) => ({
    type: "text",
    value: text,
  }),
}

// NGO wallet address (hardcoded for demo - in production this would be dynamic)
const NGO_WALLET_ADDRESS = "GBUQWP3BOUZX34ULNQG23RQ6F4BVXEYMJUCHUZI7VCZE7FDCVXWH6HUP"

const server = new Server("https://horizon-testnet.stellar.org")
const networkPassphrase = Networks.TESTNET_NETWORK_PASSPHRASE

export async function submitDonationTransaction(
  publicKey: string,
  amount: string,
  taskId: string,
  signTransaction: (tx: string) => Promise<string>,
) {
  try {
    // Get account details
    const account = await server.loadAccount(publicKey)

    // Create transaction
    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: networkPassphrase,
    })
      .addMemo(Memo.text(`Donation-${taskId}`))
      .addOperation(
        Operation.payment({
          destination: NGO_WALLET_ADDRESS,
          asset: Asset.native(),
          amount: amount,
        }),
      )
      .setTimeout(30)
      .build()

    // Sign transaction
    const signedTx = await signTransaction(transaction.toEnvelope().toXDR())

    // Submit to network
    const result = await server.submitTransaction(signedTx)

    return {
      success: true,
      hash: result.hash,
      ledger: result.ledger,
    }
  } catch (error) {
    console.error("[v0] Transaction error:", error)
    throw error
  }
}

export async function getAccountBalance(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey)
    const nativeBalance = account.balances.find((b: any) => b.asset_type === "native")
    return nativeBalance ? Number.parseFloat(nativeBalance.balance) : 0
  } catch (error) {
    console.error("[v0] Balance fetch error:", error)
    return 0
  }
}
