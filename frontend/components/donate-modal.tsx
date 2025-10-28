"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Loader2, TrendingUp, AlertCircle } from "lucide-react"
import { convertRsToXlm, convertXlmToRs } from "@/lib/exchange-rates"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { processDonation, fetchExchangeRate, clearDonationError } from "@/lib/redux/slices/donation-slice"
import { signTransaction } from "@/lib/redux/slices/wallet-slice"

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
}

export function DonateModal({ isOpen, onClose, task }: DonateModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isConnected, publicKey, walletType } = useSelector((state: RootState) => state.wallet)
  const { isDonating, error: donationError, exchangeRate, currentDonation } = useSelector((state: RootState) => state.donation)
  
  const [step, setStep] = useState<"amount" | "confirm" | "success" | "error">("amount")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<'INR' | 'XLM'>('INR')
  const [txHash, setTxHash] = useState("")

  const presetAmounts = [50, 100, 200, 500]
  const stellarAmount = currency === 'INR' && amount ? convertRsToXlm(Number.parseFloat(amount), exchangeRate) : Number.parseFloat(amount) || 0
  const inrAmount = currency === 'XLM' && amount ? convertXlmToRs(Number.parseFloat(amount), exchangeRate) : Number.parseFloat(amount) || 0

  useEffect(() => {
    // Fetch exchange rate when modal opens
    if (isOpen) {
      dispatch(fetchExchangeRate())
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    // Handle donation success
    if (currentDonation && currentDonation.transactionHash) {
      setTxHash(currentDonation.transactionHash)
      setStep("success")
    }
  }, [currentDonation])

  useEffect(() => {
    // Handle donation error
    if (donationError) {
      setStep("error")
    }
  }, [donationError])

  // Log task data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('DonateModal received task data:', {
        taskId: task?.id,
        walletAddresses: {
          WalletAddr: task?.WalletAddr,
          walletAddr: task?.walletAddr,
          walletAddress: task?.walletAddress,
          WalletAddress: task?.WalletAddress,
        },
        hasValidWalletAddress: Boolean(
          task?.WalletAddr || 
          task?.walletAddr || 
          task?.walletAddress || 
          task?.WalletAddress
        )
      });
    }
  }, [isOpen, task]);

  const handleConfirm = async () => {
    if (!isConnected || !publicKey || !walletType) {
      console.error('Wallet not connected or missing public key');
      return;
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      return
    }

    // Clear any previous errors
    dispatch(clearDonationError())

    // Create sign transaction function for Freighter
    const signTransactionFunction = async (transactionXDR: string) => {
      const result = await dispatch(signTransaction(transactionXDR))
      if (result.type.endsWith('rejected')) {
        throw new Error(result.payload as string)
      }
      return result.payload as string
    }

    // Get receiver wallet address from task data with fallbacks
    const receiverWalletAddress = task.WalletAddr || task.walletAddr || task.walletAddress || task.WalletAddress;
    
    console.log('Processing donation with wallet address:', {
      receiverWalletAddress,
      taskId: task.id,
      walletType,
      publicKey
    });
    
    if (!receiverWalletAddress) {
      console.error("Task data:", task)
      alert("Error: NGO wallet address not found in task data. Please contact support.")
      return
    }
    
    // Additional validation for Stellar public key format (starts with G and is 56 chars long)
    if (!receiverWalletAddress.startsWith('G') || receiverWalletAddress.length !== 56) {
      console.error("Invalid wallet address format:", receiverWalletAddress)
      alert("Error: Invalid NGO wallet address format. It should start with 'G' and be 56 characters long.")
      return
    }
    
    console.log("Sending donation to NGO wallet:", receiverWalletAddress)
    
    // Process donation through Redux
    dispatch(processDonation({
      amount: Number.parseFloat(amount),
      currency,
      taskId: typeof task.id === 'string' ? task.id : String(task.id), // Handle both string and number IDs
      publicKey,
      receiverPublicKey: receiverWalletAddress, // Pass NGO's wallet address from post data
      signTransaction: signTransactionFunction,
    }))
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    setTxHash("")
    setCurrency('INR')
    dispatch(clearDonationError())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "amount" && "Enter Donation Amount"}
            {step === "confirm" && "Confirm Donation"}
            {step === "success" && "Donation Successful"}
            {step === "error" && "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4">
            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">Please connect your wallet to donate</p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-foreground">Amount</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      currency === 'INR' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    disabled={!isConnected}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('XLM')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      currency === 'XLM' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    disabled={!isConnected}
                  >
                    XLM
                  </button>
                </div>
              </div>
              
              <Input
                type="number"
                placeholder={`Enter amount in ${currency}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
                disabled={!isConnected}
                step="0.0000001"
              />
              
              {amount && (
                <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {currency === 'INR' ? 'Stellar Equivalent' : 'INR Equivalent'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>Live Rate</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 transition-all duration-300">
                    {currency === 'INR' 
                      ? `${stellarAmount.toFixed(4)} XLM`
                      : `₹${inrAmount.toFixed(2)}`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    1 XLM = ₹{exchangeRate.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {(currency === 'INR' ? presetAmounts : [1, 2, 5, 10]).map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? "default" : "outline"}
                    onClick={() => setAmount(preset.toString())}
                    className="text-sm"
                    disabled={!isConnected}
                  >
                    {currency === 'INR' ? `₹${preset}` : `${preset} XLM`}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("confirm")}
              disabled={!amount || !isConnected}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Amount ({currency})</p>
              <p className="text-2xl font-bold text-foreground">
                {currency === 'INR' ? `₹${amount}` : `${amount} XLM`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-muted-foreground">
                Amount ({currency === 'INR' ? 'Stellar' : 'INR'})
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {currency === 'INR' 
                  ? `${stellarAmount.toFixed(4)} XLM`
                  : `₹${inrAmount.toFixed(2)}`
                }
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Exchange Rate: 1 XLM = ₹{exchangeRate.toFixed(2)}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Task</p>
              <p className="font-semibold text-foreground">{task.title}</p>
            </div>

            <Button onClick={handleConfirm} disabled={isDonating} className="w-full bg-primary hover:bg-primary/90">
              {isDonating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Transaction...
                </>
              ) : (
                "Sign with Wallet"
              )}
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-accent" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Donation Amount ({currency})</p>
              <p className="text-3xl font-bold text-foreground">
                {currency === 'INR' ? `₹${amount}` : `${amount} XLM`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-muted-foreground">
                Donation Amount ({currency === 'INR' ? 'Stellar' : 'INR'})
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {currency === 'INR' 
                  ? `${stellarAmount.toFixed(4)} XLM`
                  : `₹${inrAmount.toFixed(2)}`
                }
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-left">
              <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
              <p className="font-mono text-xs text-foreground break-all">{txHash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                View on Stellar Expert
              </a>
            </div>

            <div className="space-y-2">
              <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
                Done
              </Button>
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Transaction Failed</p>
                <p className="text-sm text-red-700 mt-1">{donationError}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => setStep("confirm")} className="w-full bg-primary hover:bg-primary/90">
                Try Again
              </Button>
              <Button onClick={handleClose} variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
