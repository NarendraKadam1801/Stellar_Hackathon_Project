"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CreateTaskModal } from "@/components/create-task-modal"
import { UploadProofModal } from "@/components/upload-proof-modal"
import { WalletTransferModal } from "@/components/wallet-transfer-modal"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Plus, Upload, CheckCircle2, Clock, Wallet } from "lucide-react"
import { mockNGOs } from "@/lib/mock-data"

export default function NGODashboardPage() {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isUploadProofOpen, setIsUploadProofOpen] = useState(false)
  const [isWalletTransferOpen, setIsWalletTransferOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const ngoData = mockNGOs[0]

  const tasks = [
    {
      id: 1,
      title: "School Supplies for Rural Children",
      goal: 50000,
      raised: 32500,
      status: "active",
      proofCount: 2,
    },
    {
      id: 2,
      title: "Teacher Training Program",
      goal: 40000,
      raised: 35000,
      status: "active",
      proofCount: 1,
    },
    {
      id: 3,
      title: "Digital Learning Lab",
      goal: 60000,
      raised: 60000,
      status: "completed",
      proofCount: 3,
    },
  ]

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
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button
                onClick={() => setIsCreateTaskOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Task
              </Button>
              <Button
                onClick={() => setIsWalletTransferOpen(true)}
                variant="outline"
                className="bg-transparent"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Wallet Transfer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Donations</p>
              <p className="text-2xl md:text-3xl font-bold text-primary">₹{ngoData.totalDonations.toLocaleString()}</p>
            </Card>
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Funds Used</p>
              <p className="text-2xl md:text-3xl font-bold text-accent">₹{ngoData.fundsUsed.toLocaleString()}</p>
            </Card>
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Remaining Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                ₹{ngoData.remainingBalance.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Verified Projects</p>
              <p className="text-2xl md:text-3xl font-bold text-primary">{ngoData.verifiedProjects}</p>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-4 md:p-6 mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Donations vs Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="donations" fill="#2563EB" />
                <Bar dataKey="usage" fill="#16A34A" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Tasks Management */}
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Active Tasks</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-border rounded-lg p-3 md:p-4 flex flex-col md:flex-row justify-between md:items-center gap-3"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{task.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      ₹{task.raised.toLocaleString()} / ₹{task.goal.toLocaleString()} • {task.proofCount} proofs
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
                        setIsUploadProofOpen(true)
                      }}
                      className="flex-1 md:flex-none"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Proof
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task)
                        setIsWalletTransferOpen(true)
                      }}
                      className="flex-1 md:flex-none"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Transfer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <CreateTaskModal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} />
      <UploadProofModal isOpen={isUploadProofOpen} onClose={() => setIsUploadProofOpen(false)} task={selectedTask} />
      <WalletTransferModal 
        isOpen={isWalletTransferOpen} 
        onClose={() => setIsWalletTransferOpen(false)} 
        task={selectedTask || { _id: "general", Title: "General Transfer", WalletAddr: "GBUQWP3BOUZX34ULNQG23RQ6F4BVXEYMJUCHUZI7VCZE7FDCVXWH6HUP" }}
      />
    </div>
  )
}
