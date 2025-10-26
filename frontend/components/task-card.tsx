"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useMounted } from "@/hooks/use-mounted"

interface TaskCardProps {
  task: {
    id: number
    title: string
    ngo: string
    description: string
    goal: number
    raised: number
    image: string
    category: string
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const mounted = useMounted()
  const progressPercent = (task.raised / task.goal) * 100

  // Custom number formatting to avoid hydration mismatches
  const formatNumber = (num: number) => {
    if (!mounted) {
      // Return a consistent format during SSR
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return num.toLocaleString()
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <img src={task.image || "/placeholder.svg"} alt={task.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2">{task.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {task.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{task.ngo}</p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">₹{formatNumber(task.raised)}</span>
            <span className="text-muted-foreground">₹{formatNumber(task.goal)}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Link href={`/task/${task.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">
            {task.raised >= task.goal ? "Completed" : "Donate"}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
