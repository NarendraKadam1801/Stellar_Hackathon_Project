"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Task } from "@/types"
import { Tooltip } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useState } from "react"
import { DonationModal } from "./donation-modal"
import { Check, Copy } from "lucide-react"
import { QRCode } from 'react-qr-code'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter()
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    // Convert task to URL-safe string and pass as query parameter
    const taskData = encodeURIComponent(JSON.stringify(task))
    router.push(`/task/${task._id}?taskData=${taskData}`)
  }

  const safeRaised = task.raised ?? 0
  const safeGoal = task.goal ?? 0
  const progressPercent = safeGoal > 0 ? (safeRaised / safeGoal) * 100 : 0
  
  // Calculate remaining amount needed
  const remainingAmount = safeGoal - safeRaised
  
  // Format wallet address for display
  const shortWalletAddr = task.WalletAddr ? 
    `${task.WalletAddr.slice(0, 6)}...${task.WalletAddr.slice(-4)}` : 
    'Not available'

  const handleDonationSuccess = (txHash: string) => {
    // You might want to update the UI or show a success message
    console.log("Donation successful:", txHash)
  }

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event
    
    try {
      await navigator.clipboard.writeText(task.WalletAddr)
      setCopied(true)
      // Reset copy confirmation after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generatePaymentURI = (amount: string) => {
    const params = new URLSearchParams({
      destination: task.WalletAddr,
      amount: amount,
      asset_code: 'XLM',
      memo: `Donation for ${task._id}`,
      memo_type: 'text'
    })
    return `web+stellar:pay?${params.toString()}`
  }

  const handleCreatePaymentRequest = (e: React.MouseEvent) => {
    e.stopPropagation()
    const paymentURI = generatePaymentURI(task.goal.toString())
    setShowDonationModal(true)
  }

  return (
    <>
      <Card 
        onClick={handleClick}
        className="cursor-pointer overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
      >
        <img 
          src={task.image || "/placeholder.svg"} 
          alt={task.title} 
          className="h-48 w-full object-cover rounded-t-lg" 
        />
        <div className="p-4">
          <div className="mb-2 flex justify-between items-start">
            <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{task.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{task.ngo}</p>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>

          {/* Donation Progress Section */}
          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">Raised: ₹{safeRaised.toLocaleString()}</span> 
              <span className="text-muted-foreground">Goal: ₹{safeGoal.toLocaleString()}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progressPercent)}% Funded</span>
              <span>Remaining: ₹{remainingAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Donation Information */}
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Donation Address</span>
              <Tooltip content="Stellar wallet address for donations">
                <Info className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </div>
            <code className="text-xs block truncate">{shortWalletAddr}</code>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleCreatePaymentRequest}
            >
              Request Payment
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCopyAddress}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Wallet Address
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        task={task}
        onSuccess={handleDonationSuccess}
      />

      <Dialog open={showDonationModal} onOpenChange={setShowDonationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Request for {task.title}</DialogTitle>
            <DialogDescription>
              Scan this code with your Stellar wallet to donate
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 p-4">
            <QRCode 
              value={generatePaymentURI(task.goal.toString())}
              size={200}
            />
            
            <div className="text-center">
              <p className="font-medium">Amount: {task.goal} XLM</p>
              <p className="text-sm text-muted-foreground mt-1">To: {shortWalletAddr}</p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = generatePaymentURI(task.goal.toString())
              }}
            >
              Open in Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}