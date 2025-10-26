// Stellar SDK utilities for Next.js
// Using dynamic imports to avoid SSR issues

import { 
  submitDonationTransactionFallback,
  getAccountBalanceFallback,
  createStellarAccountFallback
} from './stellar-utils-fallback'

let StellarSDK: any = null

// Dynamically import Stellar SDK
async function getStellarSDK() {
  if (!StellarSDK) {
    try {
      StellarSDK = await import('stellar-sdk')
    } catch (error) {
      console.error('Failed to import Stellar SDK:', error)
      return null
    }
  }
  return StellarSDK
}

export async function submitDonationTransaction(
  senderPublicKey: string,
  receiverAddress: string,
  amount: string,
  taskId: string,
  signTransaction: (tx: string) => Promise<string>,
) {
  try {
    const SDK = await getStellarSDK()
    
    // If SDK is not available, use fallback
    if (!SDK) {
      console.warn('Stellar SDK not available, using fallback')
      return await submitDonationTransactionFallback(
        senderPublicKey,
        receiverAddress,
        amount,
        taskId,
        signTransaction
      )
    }

    const { Server, TransactionBuilder, Operation, Asset, Memo, Networks, BASE_FEE } = SDK

    console.log('Creating donation transaction:', {
      senderPublicKey,
      receiverAddress,
      amount,
      taskId
    })

    // Initialize Stellar server for testnet
    const server = new Server('https://horizon-testnet.stellar.org')
    const networkPassphrase = Networks.TESTNET_NETWORK_PASSPHRASE

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
    // If real transaction fails, try fallback
    console.warn('Real transaction failed, trying fallback')
    return await submitDonationTransactionFallback(
      senderPublicKey,
      receiverAddress,
      amount,
      taskId,
      signTransaction
    )
  }
}

export async function getAccountBalance(publicKey: string) {
  try {
    const SDK = await getStellarSDK()
    
    // If SDK is not available, use fallback
    if (!SDK) {
      return await getAccountBalanceFallback(publicKey)
    }

    const { Server } = SDK
    
    const server = new Server('https://horizon-testnet.stellar.org')
    const account = await server.loadAccount(publicKey)
    const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native')
    return nativeBalance ? Number.parseFloat(nativeBalance.balance) : 0
  } catch (error) {
    console.error('Balance fetch error:', error)
    // If real balance fetch fails, try fallback
    return await getAccountBalanceFallback(publicKey)
  }
}

export async function createStellarAccount() {
  try {
    const SDK = await getStellarSDK()
    
    // If SDK is not available, use fallback
    if (!SDK) {
      return await createStellarAccountFallback()
    }

    const { Keypair } = SDK
    
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
    // If real account creation fails, try fallback
    return await createStellarAccountFallback()
  }
}
