"use client"

import { useState, useEffect, use } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { DonateModal } from "@/components/donate-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { StellarPriceDisplay } from "@/components/stellar-price-display"
import { Heart, Share2, MapPin, Loader2 } from "lucide-react"
import { apiService, type Post, type Donation } from "@/lib/api-service"
import { mockTasks } from "@/lib/mock-data"

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [task, setTask] = useState<any>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch real data from API
  useEffect(() => {
    const loadTaskData = async () => {
      try {
        setIsLoading(true)
        
        // Get all posts and find the one matching the ID
        const postsResponse = await apiService.getPosts()
        
        if (postsResponse.success && postsResponse.data) {
          // Find the task with matching ID
          const foundTask = postsResponse.data.find((p: Post) => p._id === resolvedParams.id)
          
          if (foundTask) {
            console.log('Raw task data from API:', foundTask);
            
            const needAmount = typeof foundTask.NeedAmount === 'string' 
              ? parseInt(foundTask.NeedAmount) 
              : foundTask.NeedAmount;
            
            const collectedAmount = foundTask.CollectedAmount || 0;
            
            const taskData = {
              _id: foundTask._id,
              id: foundTask._id,
              Title: foundTask.Title,
              title: foundTask.Title,
              NgoRef: foundTask.NgoRef,
              ngo: foundTask.NgoRef,
              Description: foundTask.Description,
              description: foundTask.Description,
              NeedAmount: needAmount,
              goal: needAmount,
              CollectedAmount: collectedAmount,
              raised: collectedAmount,
              ImgCid: foundTask.ImgCid || '',
              image: foundTask.ImgCid || '/placeholder.jpg',
              Type: foundTask.Type,
              category: foundTask.Type,
              Location: foundTask.Location,
              location: foundTask.Location,
              WalletAddr: foundTask.WalletAddr,
              // Add fallback to other possible wallet address fields
              walletAddr: foundTask.walletAddr,
              walletAddress: foundTask.walletAddress,
              WalletAddress: foundTask.WalletAddress,
              createdAt: foundTask.createdAt,
              updatedAt: foundTask.updatedAt,
            };
            
            console.log('Processed task data with wallet address:', {
              taskId: taskData.id,
              walletAddresses: {
                WalletAddr: taskData.WalletAddr,
                walletAddr: taskData.walletAddr,
                walletAddress: taskData.walletAddress,
                WalletAddress: taskData.WalletAddress,
              },
              hasValidWalletAddress: Boolean(
                taskData.WalletAddr || 
                taskData.walletAddr || 
                taskData.walletAddress || 
                taskData.WalletAddress
              )
            });
            
            setTask(taskData);
          }

          // Fetch donations for this task
          try {
            const donationsResponse = await apiService.getDonationsByPostId(foundTask._id)
            if (donationsResponse.success && donationsResponse.data) {
              setDonations(donationsResponse.data)
            }
          } catch (err) {
            console.log("No donations found for this task")
          }

          // Fetch expenses for this task
          try {
            const expensesResponse = await apiService.getExpensesByPostId(foundTask._id)
            if (expensesResponse.success && expensesResponse.data) {
              const prevTxn = expensesResponse.data.prevTxn
              if (prevTxn) {
                setExpenses(Array.isArray(prevTxn) ? prevTxn : [prevTxn])
              }
            }
          } catch (err) {
            console.log("No expenses found for this task")
          }
        }
      } catch (err) {
        console.error("Error loading task data:", err)
        // Fallback to mock data - try to find by string ID first, then number
        let mockTask = mockTasks.find((t) => t.id.toString() === resolvedParams.id)
        if (!mockTask) {
          // Try by number if resolvedParams.id is a number
          if (!isNaN(Number.parseInt(resolvedParams.id))) {
            mockTask = mockTasks.find((t) => t.id === Number.parseInt(resolvedParams.id))
          }
        }
        if (!mockTask) {
          mockTask = mockTasks[0]
        }
        console.log("Using mock task:", mockTask)
        setTask(mockTask)
      } finally {
        setIsLoading(false)
      }
    }

    loadTaskData()
  }, [resolvedParams.id])

  if (isLoading || !task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto py-12 px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <p className="mt-4 text-lg">Loading task details...</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">Task not found</h2>
              <p className="mt-2 text-muted-foreground">The requested task could not be found.</p>
              <Button className="mt-4" variant="outline" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Safely format numbers, handling undefined/null/NaN
  const formatNumber = (num?: number | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return num.toLocaleString();
  }

  // Safely calculate progress percentage
  const calculateProgress = () => {
    const raised = task.CollectedAmount || task.raised || 0;
    const goal = task.NeedAmount || task.goal || 1; // Default to 1 to avoid division by zero
    return Math.min(Math.round((raised / goal) * 100), 100);
  }

  const progressPercent = calculateProgress();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <img
                src={task.ImgCid || task.image || '/placeholder.jpg'}
                alt={task.Title || task.title || 'Task image'}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />

              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                      {task.Title || task.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">{task.ngo}</p>
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

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{task.Location || task.location || 'Location not specified'}</span>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">₹{formatNumber(task.CollectedAmount || task.raised)} raised</span>
                    <span className="text-muted-foreground">of ₹{formatNumber(task.NeedAmount || task.goal)} goal</span>
                  </div>
                  <Progress 
                    value={progressPercent} 
                    className="h-2" 
                  />
                  <p className="text-sm text-muted-foreground mt-2">{task.donors} donors</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="donations">Donations</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="proofs">Proofs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {task.Description || task.description || 'No description available.'}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="donations" className="mt-6">
                  <div className="space-y-4">
                    {donations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No donations yet. Be the first to donate!
                      </div>
                    ) : (
                      donations.map((donation, index) => (
                        <div key={donation._id || index} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-foreground">Donation Received</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(donation.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="font-semibold text-primary">₹{donation.Amount.toLocaleString()}</p>
                          </div>
                          <div className="mb-2">
                            <StellarPriceDisplay amount={donation.Amount} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Transaction: {donation.currentTxn?.substring(0, 20)}...
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="expenses" className="mt-6">
                  <div className="space-y-4">
                    {expenses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No expense records yet.
                      </div>
                    ) : (
                      expenses.map((expense, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-foreground">Expense Record</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Verified</span>
                          </div>
                          <p className="text-xs text-muted-foreground break-all">
                            Transaction Data: {JSON.stringify(expense).substring(0, 100)}...
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="proofs" className="mt-6">
                  <div className="space-y-4">
                    {donations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No verified proofs yet.
                      </div>
                    ) : (
                      donations.map((proof, index) => (
                        <div key={proof._id || index} className="border border-border rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-foreground">Proof Verified</p>
                              <p className="text-sm text-muted-foreground">
                                Amount: ₹{proof.Amount.toLocaleString()}
                              </p>
                            </div>
                            <span className="text-xs bg-accent text-white px-2 py-1 rounded">Verified</span>
                          </div>
                          <div className="mb-2">
                            <StellarPriceDisplay amount={proof.Amount} />
                          </div>
                          <p className="text-xs text-muted-foreground break-all">
                            TX: {proof.currentTxn?.substring(0, 30)}...
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Donate Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Amount needed</p>
                  <div className="text-2xl font-bold">
                    {Math.floor((((task.CollectedAmount || task.raised || 0) / (task.NeedAmount || task.goal || 1)) * 100) || 0)}%
                  </div>
                  <p className="text-lg font-bold text-primary">₹{(task.NeedAmount || task.goal || 0 - (task.CollectedAmount || task.raised || 0)).toLocaleString()}</p>
                </div>

                <Button
                  onClick={() => setIsDonateOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90 mb-3"
                  size="lg"
                >
                  Donate Securely
                </Button>

                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Share Task
                </Button>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">Verified by blockchain</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Donors</span>
                      <span className="font-semibold">{donations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proofs Uploaded</span>
                      <span className="font-semibold">{donations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Raised</span>
                      <div className="text-2xl font-bold">₹{formatNumber(task.CollectedAmount || task.raised || 0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonateModal 
        isOpen={isDonateOpen} 
        onClose={() => {
          setIsDonateOpen(false);
          // Reset any donation state if needed
        }} 
        task={{
          ...task,
          // Ensure wallet address is passed with consistent casing
          WalletAddr: task.WalletAddr || task.walletAddr || task.walletAddress || task.WalletAddress,
          // Ensure we have a string ID
          id: task._id || task.id,
        }} 
      />
    </div>
  )
}
