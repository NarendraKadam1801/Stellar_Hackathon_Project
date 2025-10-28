"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CreateTaskModal } from "@/components/create-task-modal"
import { UploadProofModal } from "@/components/upload-proof-modal"
import { NGOSendPaymentModal } from "@/components/ngo-send-payment-modal"
import { Plus, Upload, CheckCircle2, Clock, Loader2, Send } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { apiService, type Post } from "@/lib/api-service"

// Simple chart component to avoid recharts SSR issues
const SimpleChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="h-[300px] w-full p-4">
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t"
              style={{ 
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: '4px'
              }}
            />
            <div className="text-xs text-muted-foreground mt-2 text-center">
              {item.name}
            </div>
            <div className="text-xs font-medium">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NGODashboardPage() {
  const router = useRouter()
  const { isAuthenticated, ngoProfile } = useSelector((state: RootState) => state.ngoAuth)
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isUploadProofOpen, setIsUploadProofOpen] = useState(false)
  const [isSendPaymentOpen, setIsSendPaymentOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDonations: 0,
    fundsUsed: 0,
    remainingBalance: 0,
    verifiedProjects: 0,
  })
  const [donations, setDonations] = useState<any[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/ngo/login")
    }
  }, [isAuthenticated, router])

  // Load NGO posts and stats
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const postsResponse = await apiService.getPosts()
        if (postsResponse.success) {
          // Filter posts for this NGO
          const ngoPosts = postsResponse.data.filter((post: Post) => post.NgoRef === ngoProfile?.id)
          setPosts(ngoPosts)
          
          // Calculate stats from posts (CollectedAmount is already in INR from backend)
          const totalRaised = ngoPosts.reduce((sum, post) => sum + (post.CollectedAmount || 0), 0)
          const fundsUsed = Math.floor(totalRaised * 0.68) // Mock calculation - you can track actual expenses
          const remainingBalance = totalRaised - fundsUsed
          
          setStats({
            totalDonations: totalRaised,  // Total raised in INR
            fundsUsed,                    // Funds used in INR
            remainingBalance,             // Remaining in INR
            verifiedProjects: ngoPosts.length,
          })
          
          // Load donations for this NGO's posts (optional - for detailed view)
          const allDonationsResponse = await apiService.getDonations()
          if (allDonationsResponse.success) {
            const ngoPostIds = ngoPosts.map(p => p._id)
            const ngoDonations = allDonationsResponse.data.filter((d: any) => 
              ngoPostIds.includes(d.postIDs)
            )
            setDonations(ngoDonations)
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && ngoProfile) {
      loadDashboardData()
    }
  }, [isAuthenticated, ngoProfile])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Convert posts to task format with real donation data
  const tasks = posts.map(post => {
    const taskDonations = donations.filter(d => d.postIDs === post._id)
    const totalRaised = taskDonations.reduce((sum, d) => sum + (d.Amount || 0), 0)
    
    return {
      id: post._id,
      title: post.Title,
      goal: Number.parseInt(post.NeedAmount),
      raised: totalRaised,
      status: "active" as const,
      proofCount: taskDonations.length,
    }
  })

  const chartData = [
    { month: "Jan", donations: 15000, usage: 8000 },
    { month: "Feb", donations: 22000, usage: 18000 },
    { month: "Mar", donations: 35000, usage: 28000 },
    { month: "Apr", donations: 28000, usage: 25000 },
    { month: "May", donations: 25000, usage: 19500 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-8 md:py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">NGO Dashboard</h1>
            <Button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-primary hover:bg-primary/90 w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Task
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Donations</p>
              <p className="text-2xl md:text-3xl font-bold text-primary">₹{stats.totalDonations.toLocaleString()}</p>
            </Card>
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Funds Used</p>
              <p className="text-2xl md:text-3xl font-bold text-accent">₹{stats.fundsUsed.toLocaleString()}</p>
            </Card>
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Remaining Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                ₹{stats.remainingBalance.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Verified Projects</p>
              <p className="text-2xl md:text-3xl font-bold text-primary">{stats.verifiedProjects}</p>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-4 md:p-6 mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Donations vs Usage</h2>
            <SimpleChart data={chartData} />
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-muted-foreground">Donations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-muted-foreground">Usage</span>
              </div>
            </div>
          </Card>

          {/* Tasks Management */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Active Tasks</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-muted-foreground">Loading tasks...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tasks created yet</p>
                <Button
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-border rounded-lg p-3 md:p-4 flex flex-col md:flex-row justify-between md:items-center gap-3"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{task.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      ₹{task.raised.toLocaleString()} / ₹{task.goal.toLocaleString()} • {task.proofCount} donation{task.proofCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {task.status === "active" ? (
                      <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task)
                        setIsSendPaymentOpen(true)
                      }}
                      className="flex-1 md:flex-none"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Payment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task)
                        setIsUploadProofOpen(true)
                      }}
                      className="flex-1 md:flex-none"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Proof
                    </Button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <CreateTaskModal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} />
      <NGOSendPaymentModal isOpen={isSendPaymentOpen} onClose={() => setIsSendPaymentOpen(false)} task={selectedTask} />
      <UploadProofModal isOpen={isUploadProofOpen} onClose={() => setIsUploadProofOpen(false)} task={selectedTask} />
    </div>
  )
}
