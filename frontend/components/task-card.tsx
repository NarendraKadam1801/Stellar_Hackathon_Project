"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface TaskCardProps {
  task: {
    id: number
    title: string
    ngo: string
    description: string
    goal: number | undefined | null // Expanded type definition for safety
    raised: number | undefined | null // Expanded type definition for safety
    image: string
    category: string
  }
}

export function TaskCard({ task }: TaskCardProps) {
  // 💡 FIX: Safely assign default values (0) using Nullish Coalescing (??)
  const safeRaised = task.raised ?? 0;
  const safeGoal = task.goal ?? 0;
  
  // Prevent division by zero if goal is 0 or missing
  const progressPercent = safeGoal > 0 ? (safeRaised / safeGoal) * 100 : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <img 
        src={task.image || "/placeholder.svg"} 
        alt={task.title} 
        className="w-full h-48 object-cover" 
      />
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
            {/* 💡 FIX APPLIED: Use safeRaised/safeGoal */}
            <span className="font-semibold">₹{safeRaised.toLocaleString()}</span> 
            <span className="text-muted-foreground">₹{safeGoal.toLocaleString()}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progressPercent)}% Funded
          </p>
        </div>

        <Link href={`/task/${task.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">Donate</Button>
        </Link>
      </div>
    </Card>
  )
}