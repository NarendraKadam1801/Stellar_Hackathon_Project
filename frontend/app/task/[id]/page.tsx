"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function TaskPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const [task, setTask] = useState<any>(null)

  useEffect(() => {
    const taskData = searchParams.get('taskData')
    if (taskData) {
      try {
        const decodedTask = JSON.parse(decodeURIComponent(taskData))
        setTask(decodedTask)
      } catch (error) {
        console.error('Error parsing task data:', error)
      }
    }
  }, [searchParams])

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading task details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{task.Title || task.title}</h1>
            <p className="text-muted-foreground">{task.Location || task.location}</p>
          </div>

          {/* Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={task.ImgCid ? `https://gateway.pinata.cloud/ipfs/${task.ImgCid}` : task.image || "/placeholder.svg"}
              alt={task.Title || task.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium text-muted-foreground">Category</dt>
                  <dd>{task.Type || task.category}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Need Amount</dt>
                  <dd>{task.NeedAmount || task.goal} XLM</dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground">{task.Description || task.description}</p>
            </div>
          </div>

          {/* Wallet Information */}
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Donation Information</h2>
            <p className="font-mono bg-background p-3 rounded break-all">
              {task.WalletAddr}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
