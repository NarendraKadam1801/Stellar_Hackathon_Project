"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { DonateModal } from "@/components/donate-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { StellarPriceDisplay } from "@/components/stellar-price-display"
import { Heart, Share2, MapPin } from "lucide-react"
import { mockTasks } from "@/lib/mock-data"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const [isDonateOpen, setIsDonateOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const task = mockTasks.find((t) => t.id === Number.parseInt(params.id)) || mockTasks[0]

  const progressPercent = (task.raised / task.goal) * 100

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <img
                src={task.image || "/placeholder.svg"}
                alt={task.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />

              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{task.title}</h1>
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

                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  {task.location}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">₹{task.raised.toLocaleString()} raised</span>
                    <span className="text-muted-foreground">₹{task.goal.toLocaleString()} goal</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{task.donors} donors</p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="proofs">Proofs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground">{task.longDescription}</p>
                  </div>
                </TabsContent>

                <TabsContent value="expenses" className="mt-6">
                  <div className="space-y-4">
                    {task.expenses.map((expense) => (
                      <div key={expense.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-foreground">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">{expense.date}</p>
                          </div>
                          <p className="font-semibold text-primary">₹{expense.amount.toLocaleString()}</p>
                        </div>
                        <div className="mb-2">
                          <StellarPriceDisplay amount={expense.amount} />
                        </div>
                        <p className="text-xs text-muted-foreground">IPFS: {expense.ipfsCid}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="proofs" className="mt-6">
                  <div className="space-y-4">
                    {task.proofs.map((proof) => (
                      <div key={proof.id} className="border border-border rounded-lg p-4 bg-green-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-foreground">Proof Verified</p>
                            <p className="text-sm text-muted-foreground">Amount: ₹{proof.amount.toLocaleString()}</p>
                          </div>
                          <span className="text-xs bg-accent text-white px-2 py-1 rounded">Verified</span>
                        </div>
                        <div className="mb-2">
                          <StellarPriceDisplay amount={proof.amount} />
                        </div>
                        <p className="text-xs text-muted-foreground">TX: {proof.txHash}</p>
                        <p className="text-xs text-muted-foreground">Root: {proof.merkleRoot}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Donate Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Amount needed</p>
                  <p className="text-3xl font-bold text-primary">₹{(task.goal - task.raised).toLocaleString()}</p>
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
                      <span className="font-semibold">{task.donors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proofs Uploaded</span>
                      <span className="font-semibold">{task.proofs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified Amount</span>
                      <span className="font-semibold">₹{(task.raised * 0.8).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} task={task} />
    </div>
  )
}
