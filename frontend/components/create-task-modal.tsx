"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2, Upload, Image as ImageIcon, X } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { useNGOAuth } from "@/lib/ngo-auth-context"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { ngoProfile } = useNGOAuth()
  const [step, setStep] = useState<"form" | "success">("form")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "Education",
    location: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    if (!ngoProfile) {
      setError("Please login as an NGO to create tasks")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      let imageCid = "/placeholder.jpg" // Default placeholder

      // Upload image to IPFS if provided
      if (formData.image) {
        setIsUploadingImage(true)
        try {
          const uploadResponse = await apiService.uploadToIPFS(formData.image)
          if (uploadResponse.success) {
            imageCid = uploadResponse.data.cid || uploadResponse.data.hash
            console.log("Image uploaded to IPFS:", imageCid)
          } else {
            console.warn("Image upload failed, using placeholder")
          }
        } catch (uploadError) {
          console.error("Image upload error:", uploadError)
          console.warn("Using placeholder image")
        } finally {
          setIsUploadingImage(false)
        }
      }

      const postData = {
        Title: formData.title,
        Type: formData.category,
        Description: formData.description,
        Location: formData.location,
        ImgCid: imageCid,
        NeedAmount: formData.goal,
        WalletAddr: "GBUQWP3BOUZX34ULNQG23RQ6F4BVXEYMJUCHUZI7VCZE7FDCVXWH6HUP", // Default NGO wallet
        // NgoRef will be set by the backend from the JWT token
      }

      const response = await apiService.createPost(postData)
      
      if (response.success) {
        setStep("success")
      } else {
        throw new Error("Failed to create post")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create task"
      setError(message)
      console.error("Create task error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep("form")
    setFormData({ title: "", description: "", goal: "", category: "Education", location: "", image: null })
    setImagePreview(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "form" && "Create New Task"}
            {step === "success" && "Task Created Successfully"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

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
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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

            <div>
              <label className="text-sm font-medium text-foreground">Featured Image</label>
              {imagePreview ? (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Click to upload featured image
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isProcessing || isUploadingImage || !formData.title || !formData.goal || !formData.description}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isUploadingImage ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Uploading Image...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Task...
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
