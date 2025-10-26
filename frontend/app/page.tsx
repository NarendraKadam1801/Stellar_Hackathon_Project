"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react"
import { postsApi } from "@/lib/api-client"

export default function Home() {
  const [featuredTasks, setFeaturedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRaised: 0, activeDonors: 0, verifiedNGOs: 0 })

  useEffect(() => {
    const fetchFeaturedTasks = async () => {
      try {
        setLoading(true)
        const response = await postsApi.getAll()
        const posts = response.data || []
        setFeaturedTasks(posts.slice(0, 3))

        // Calculate stats from posts
        const totalRaised = posts.reduce((sum, post) => sum + (post.raised || 0), 0)
        const activeDonors = posts.reduce((sum, post) => sum + (post.donors || 0), 0)
        setStats({
          totalRaised,
          activeDonors,
          verifiedNGOs: Math.ceil(posts.length / 2),
        })
      } catch (error) {
        console.error("[v0] Error fetching featured tasks:", error)
        setFeaturedTasks([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTasks()
  }, [])

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
              <Link href="/ngo/auth?mode=signup">
                <Button size="lg" variant="outline">
                  Create Task
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <div className="text-3xl font-bold text-primary">₹{(stats.totalRaised / 100000).toFixed(2)}L</div>
              <div className="text-muted-foreground">Total Raised</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <div className="text-3xl font-bold text-accent">{stats.activeDonors}+</div>
              <div className="text-muted-foreground">Active Donors</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
              <div className="text-3xl font-bold text-accent">{stats.verifiedNGOs}</div>
              <div className="text-muted-foreground">Verified NGOs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tasks */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-12">Featured Tasks</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading featured tasks...</p>
            </div>
          ) : featuredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks available yet</p>
            </div>
          )}
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
    </div>
  )
}
