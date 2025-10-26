import { 
  Server, 
  Keypair, 
  TransactionBuilder, 
  Operation, 
  Asset, 
  Memo, 
  Networks,
  BASE_FEE 
} from 'stellar-sdk'

// Initialize Stellar server for testnet
const server = new Server('https://horizon-testnet.stellar.org')
const networkPassphrase = Networks.TESTNET_NETWORK_PASSPHRASE

export async function submitDonationTransaction(
  senderPublicKey: string,
  receiverAddress: string,
  amount: string,
  taskId: string,
  signTransaction: (tx: string) => Promise<string>,
) {
  try {
    console.log('Creating donation transaction:', {
      senderPublicKey,
      receiverAddress,
      amount,
      taskId
    })

    // Get sender account details
    const senderAccount = await server.loadAccount(senderPublicKey)

    // Create transaction
    const transaction = new TransactionBuilder(senderAccount, {
      fee: BASE_FEE,
      networkPassphrase: networkPassphrase,
    })
      .addMemo(Memo.text(`Donation-${taskId}`))
      .addOperation(
        Operation.payment({
          destination: receiverAddress,
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

    console.log('Transaction submitted successfully:', result)

    return {
      success: true,
      hash: result.hash,
      ledger: result.ledger,
    }
  } catch (error) {
    console.error('Transaction error:', error)
    throw error
  }
}

export async function getAccountBalance(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey)
    const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native')
    return nativeBalance ? Number.parseFloat(nativeBalance.balance) : 0
  } catch (error) {
    console.error('Balance fetch error:', error)
    return 0
  }
}

export async function createStellarAccount() {
  try {
    const keypair = Keypair.random()
    const publicKey = keypair.publicKey()
    const secretKey = keypair.secret()

    // Fund the account with testnet friendbot
    try {
      await fetch(`https://friendbot.stellar.org?addr=${publicKey}`)
    } catch (error) {
      console.warn('Friendbot funding failed:', error)
    }

    return {
      publicKey,
      secretKey,
    }
  } catch (error) {
    console.error('Account creation error:', error)
    throw error
  }
}
