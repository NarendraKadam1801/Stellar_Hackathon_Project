"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2 } from "lucide-react"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "Education",
  })

  const handleSubmit = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)
    setStep("success")
  }

  const handleClose = () => {
    setStep("form")
    setFormData({ title: "", description: "", goal: "", category: "Education" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "form" && "Create New Task"}
            {step === "success" && "Task Created Successfully"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Task Title</label>
              <Input
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Describe your task"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Goal Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter goal amount"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full mt-2 px-3 py-2 border border-border rounded-md text-foreground"
              >
                <option>Education</option>
                <option>Health</option>
                <option>Relief</option>
                <option>Environment</option>
              </select>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isProcessing || !formData.title || !formData.goal}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
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
              <p className="text-sm text-muted-foreground mb-1">Task Created</p>
              <p className="font-semibold text-foreground">{formData.title}</p>
            </div>

            <p className="text-sm text-muted-foreground">Your task is now live and donors can start contributing!</p>

            <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
