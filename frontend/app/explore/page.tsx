"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { postsApi } from "@/lib/api-client"

// ----------------------------------------------------------------------
// 1. TYPES & CONSTANTS (SHARED)
// ----------------------------------------------------------------------

// Backend structure based on your API response
interface BackendTask {
  _id: string
  Title: string
  Type: string
  Description: string
  NeedAmount: string
  WalletAddr: string
  NgoRef: string
  ImgCid?: string
  Location?: string
}

// Frontend structure (cleaned up for rendering)
interface Task {
  _id: string // Keep the original backend _id
  title: string
  category: string
  goal: number
  raised: number
  ngo: string
  description: string
  image: string
}

const categories = ["All", "education", "health", "food", "shelter"]

// ----------------------------------------------------------------------
// 2. CLIENT COMPONENT
// ----------------------------------------------------------------------

interface ClientExplorePageProps {
  initialTasks: Task[]
}

const ClientExplorePage: React.FC<ClientExplorePageProps> = ({ initialTasks }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTasks = initialTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || task.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Explore Tasks</h1>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tasks or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} /> // pass _id directly
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tasks found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// 3. SERVER COMPONENT (Data Fetching & Wrapper)
// ----------------------------------------------------------------------

interface ApiResponse {
  statusCode: number
  data: BackendTask[]
  message: string
  success: boolean
}

export default async function ExplorePage() {
  let initialTasks: BackendTask[] = [] // Use BackendTask directly instead of transforming

  try {
    const apiResponse: ApiResponse = await postsApi.getAll()
    if (apiResponse.success && apiResponse.data && Array.isArray(apiResponse.data)) {
      initialTasks = apiResponse.data // Use the raw data directly
    }
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    initialTasks = []
  }

  return <ClientExplorePage initialTasks={initialTasks} />
}
