"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react"
import { apiService, type Post } from "@/lib/api-service"
import { mockTasks } from "@/lib/mock-data"
import { AuthModal } from "@/components/auth-modal"
import { NGOAuthModal } from "@/components/ngo-auth-modal"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import { openAuthModal } from "@/lib/redux/slices/ui-slice"
import { useNGOAuth } from "@/lib/ngo-auth-context"

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated: ngoAuthenticated } = useNGOAuth()
  const { isConnected: walletConnected } = useSelector((state: RootState) => state.wallet)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getPosts()
      if (response.success) {
        setPosts(response.data)
      }
    } catch (err) {
      console.error("Error loading posts:", err)
      setError("Failed to load posts")
      // Fallback to mock data
      setPosts(mockTasks.map(task => ({
        _id: task.id.toString(),
        Title: task.title,
        Type: task.category,
        Description: task.description,
        Location: task.location,
        ImgCid: task.image,
        NeedAmount: task.goal.toString(),
        WalletAddr: "GBUQWP3BOUZX34ULNQG23RQ6F4BVXEYMJUCHUZI7VCZE7FDCVXWH6HUP",
        NgoRef: task.ngo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })))
    } finally {
      setIsLoading(false)
    }
  }

  // Convert API posts to task format for TaskCard component
  const convertPostToTask = (post: Post) => ({
    id: parseInt(post._id),
    title: post.Title,
    ngo: post.NgoRef,
    description: post.Description,
    goal: parseInt(post.NeedAmount),
    raised: Math.floor(Math.random() * parseInt(post.NeedAmount) * 0.8), // Mock raised amount
    image: post.ImgCid.startsWith('/') ? post.ImgCid : `/placeholder.jpg`,
    category: post.Type,
  })

  const featuredTasks = posts.slice(0, 3).map(convertPostToTask)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Transparent NGO Donations Powered by Blockchain
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Donate small. Track big. Every rupee verified on the blockchain.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/explore">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse Tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {ngoAuthenticated ? (
                <Link href="/ngo/create-post">
                  <Button size="lg" variant="outline">
                    Create Task
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => dispatch(openAuthModal())}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">₹12,50,000</div>
              <div className="text-muted-foreground">Total Raised</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <div className="text-3xl font-bold text-accent">1,200+</div>
              <div className="text-muted-foreground">Active Donors</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <div className="text-3xl font-bold text-accent">54</div>
              <div className="text-muted-foreground">Verified NGOs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tasks */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12">Featured Tasks</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mb-8">
              {error} - Showing sample data
            </div>
          ) : null}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Donate</h3>
              <p className="text-muted-foreground">
                Connect your wallet and donate to NGO tasks securely on the blockchain
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">NGO Uses Funds</h3>
              <p className="text-muted-foreground">NGOs execute the task and upload proof of usage with receipts</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Verified & Transparent</h3>
              <p className="text-muted-foreground">
                Cryptographic verification ensures complete transparency and trust
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal />
      <NGOAuthModal />
    </div>
  )
}
