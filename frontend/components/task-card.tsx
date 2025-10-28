"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useMounted } from "@/hooks/use-mounted"

interface BaseTask {
  _id: string
  Title?: string
  title?: string
  NgoRef?: string
  Description?: string
  description?: string
  NeedAmount: string | number
  CollectedAmount?: number
  ImgCid: string
  Type?: string
  Location?: string
  WalletAddr?: string  // Add wallet address field
  // For backward compatibility with mock data
  id?: string | number
  ngo?: string
  goal?: number
  raised?: number
  image?: string
  category?: string
}

interface TaskCardProps {
  task: BaseTask
}

export function TaskCard({ task }: TaskCardProps) {
  const mounted = useMounted()
  const goal = typeof task.NeedAmount === 'string' ? parseFloat(task.NeedAmount) : task.NeedAmount;
  const raised = task.CollectedAmount || 0;
  const progressPercent = (raised / goal) * 100

  // Custom number formatting to avoid hydration mismatches
  const formatNumber = (num?: number | null): string => {
    if (num === undefined || num === null) return '0';
    if (!mounted) {
      // Return a consistent format during SSR
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toLocaleString();
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <img 
        src={task.ImgCid || task.image || "/placeholder.svg"} 
        alt={task.Title || task.title || 'Post image'} 
        className="w-full h-48 object-cover" 
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {task.Title || task.title || 'Untitled Post'}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {task.Type || task.category || 'Uncategorized'}
          </Badge>
        </div>
        {task.NgoRef && (
          <p className="text-sm text-muted-foreground mb-3">
            {task.ngo || `NGO ID: ${task.NgoRef}`}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {task.Description || task.description || 'No description available.'}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">₹{formatNumber(raised)} raised</span>
            <span>₹{formatNumber(goal)} goal</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Link href={`/task/${task.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">
            {raised >= goal ? "Completed" : "Donate"}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
