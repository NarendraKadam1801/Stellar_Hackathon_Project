"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { paymentApi } from "@/lib/api-client"

interface SimpleDonateModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
}

export function SimpleDonateModal({ isOpen, onClose, task }: SimpleDonateModalProps) {
  const [step, setStep] = useState<"amount" | "confirm" | "success" | "error">("amount")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")

  const presetAmounts = [50, 100, 200, 500]

  // Get task ID from different possible field names
  const getTaskId = () => {
    console.log("Task object:", task) // Debug log
    return task?._id || task?.id || task?.Id || ""
  }

  // Get task title from different possible field names
  const getTaskTitle = () => {
    return task?.Title || task?.title || "Task"
  }

  const handleConfirm = async () => {
    const taskId = getTaskId()
    
    if (!taskId) {
      setError("Task ID not found")
      setStep("error")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Create a mock transaction ID for testing
      const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Verify donation with backend using payment API
      const verifyResponse = await paymentApi.verifyDonation({
        TransactionId: mockTransactionId,
        postID: taskId,
        Amount: Number.parseFloat(amount),
      })

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Failed to verify donation")
      }

      setTxHash(mockTransactionId)
      setStep("success")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Donation failed"
      setError(message)
      setStep("error")
      console.error("Donation error:", message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep("amount")
    setAmount("")
    setTxHash("")
    setError("")
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
            {step === "error" && "Donation Failed"}
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? "default" : "outline"}
                    onClick={() => setAmount(preset.toString())}
                    className="text-sm"
                  >
                    ₹{preset}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("confirm")}
              disabled={!amount}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Amount (INR)</p>
              <p className="text-2xl font-bold text-foreground">₹{amount}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Task</p>
              <p className="font-semibold text-foreground">{getTaskTitle()}</p>
            </div>

            <Button onClick={handleConfirm} disabled={isProcessing} className="w-full bg-primary hover:bg-primary/90">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Donation...
                </>
              ) : (
                "Confirm Donation"
              )}
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Donation Amount</p>
              <p className="text-3xl font-bold text-foreground">₹{amount}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-left">
              <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
              <p className="font-mono text-xs text-foreground break-all">{txHash}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Donation recorded successfully!
              </p>
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
                <p className="font-semibold text-red-900">Donation Failed</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
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
