"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { DonateModal } from "@/components/donate-modal"
import { SimpleDonateModal } from "@/components/simple-donate-modal"
import { WalletTransferModal } from "@/components/wallet-transfer-modal"
import { DonationsList } from "@/components/donations-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Heart, Share2, MapPin, Loader2, Wallet } from "lucide-react"
import { postsApi } from "@/lib/api-client"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const [isWalletTransferOpen, setIsWalletTransferOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        const response = await postsApi.getById(params.id)
        if (response.success) {
          setTask(response.data)
        } else {
          setError(response.message || "Failed to fetch task")
        }
      } catch (err) {
        setError("Failed to fetch task")
        console.error("Error fetching task:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading task...</span>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">{error || "Task not found"}</p>
        </div>
      </div>
    )
  }

  const goal = parseFloat(task.NeedAmount) || 0
  const raised = 0 // Will be calculated from donations
  const progressPercent = goal > 0 ? (raised / goal) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <img
                src={task.ImgCid ? `https://gateway.pinata.cloud/ipfs/${task.ImgCid}` : "/placeholder.svg"}
                alt={task.Title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />

              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{task.Title}</h1>
                    <p className="text-lg text-muted-foreground">NGO</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? "bg-red-50" : ""}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {task.Location && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    {task.Location}
                  </div>
                )}

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">₹{raised.toLocaleString()} raised</span>
                    <span className="text-muted-foreground">₹{goal.toLocaleString()} goal</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">0 donors</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="donations">Donations</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground">{task.Description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="donations" className="mt-6">
                  <DonationsList postId={task._id} />
                </TabsContent>

                <TabsContent value="expenses" className="mt-6">
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No expenses recorded yet</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Donate Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Amount needed</p>
                  <p className="text-3xl font-bold text-primary">₹{(goal - raised).toLocaleString()}</p>
                </div>

                <Button
                  onClick={() => setIsDonateOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90 mb-3"
                  size="lg"
                >
                  Donate Securely
                </Button>

                <Button
                  onClick={() => setIsWalletTransferOpen(true)}
                  variant="outline"
                  className="w-full bg-transparent mb-3"
                  size="lg"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet Transfer
                </Button>

                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Share Task
                </Button>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Verified by blockchain</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donors</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proofs Uploaded</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified Amount</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimpleDonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} task={task} />
      <WalletTransferModal 
        isOpen={isWalletTransferOpen} 
        onClose={() => setIsWalletTransferOpen(false)} 
        task={task} 
      />
    </div>
  )
}
