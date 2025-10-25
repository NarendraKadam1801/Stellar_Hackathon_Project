"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2, Upload } from "lucide-react"

interface UploadProofModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
}

export function UploadProofModal({ isOpen, onClose, task }: UploadProofModalProps) {
  const [step, setStep] = useState<"form" | "uploading" | "success">("form")
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    file: null as File | null,
  })
  const [ipfsCid, setIpfsCid] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, file: e.target.files[0] })
    }
  }

  const handleSubmit = async () => {
    setStep("uploading")
    // Simulate IPFS upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIpfsCid("QmXxxx" + Math.random().toString(16).slice(2, 10))
    setStep("success")
  }

  const handleClose = () => {
    setStep("form")
    setFormData({ amount: "", description: "", file: null })
    setIpfsCid("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "form" && "Upload Proof"}
            {step === "uploading" && "Uploading to IPFS..."}
            {step === "success" && "Proof Uploaded Successfully"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            {task && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Task</p>
                <p className="font-semibold text-sm text-foreground">{task.title}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Amount Used (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Describe how funds were used"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Receipt/Proof File</label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition">
                <input type="file" onChange={handleFileChange} className="hidden" id="file-input" />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                </label>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formData.amount || !formData.description || !formData.file}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Upload Proof
            </Button>
          </div>
        )}

        {step === "uploading" && (
          <div className="space-y-4 text-center py-8">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <p className="text-muted-foreground">Uploading to IPFS...</p>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-accent" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount Verified</p>
              <p className="text-2xl font-bold text-foreground">₹{formData.amount}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-left">
              <p className="text-xs text-muted-foreground mb-1">IPFS CID</p>
              <p className="font-mono text-xs text-foreground break-all">{ipfsCid}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              Your proof has been uploaded and will be verified by the blockchain
            </p>

            <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
