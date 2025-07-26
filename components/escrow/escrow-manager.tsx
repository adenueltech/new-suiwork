"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useWallet } from "@/components/wallet/wallet-provider"
import { useToast } from "@/hooks/use-toast"

interface EscrowJob {
  id: string
  title: string
  amount: number
  status: "locked" | "in_progress" | "completed" | "disputed"
  client: string
  freelancer: string
  createdAt: string
  deadline: string
}

export default function EscrowManager() {
  const { isConnected, signTransaction } = useWallet()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  // Mock escrow data
  const escrowJobs: EscrowJob[] = [
    {
      id: "1",
      title: "Build DeFi Dashboard",
      amount: 250,
      status: "in_progress",
      client: "0x1234...5678",
      freelancer: "0xabcd...efgh",
      createdAt: "2024-01-15",
      deadline: "2024-02-15",
    },
    {
      id: "2",
      title: "Smart Contract Audit",
      amount: 500,
      status: "completed",
      client: "0x1234...5678",
      freelancer: "0xabcd...efgh",
      createdAt: "2024-01-10",
      deadline: "2024-01-17",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "locked":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Shield size={16} />
      case "in_progress":
        return <Clock size={16} />
      case "completed":
        return <CheckCircle size={16} />
      case "disputed":
        return <AlertCircle size={16} />
      default:
        return <Shield size={16} />
    }
  }

  const releaseEscrow = async (jobId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to release escrow.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(jobId)
    try {
      // Mock transaction
      const txHash = await signTransaction({ type: "release_escrow", jobId })

      toast({
        title: "Escrow Released!",
        description: `Funds have been released to the freelancer. Transaction: ${txHash}`,
      })
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to release escrow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Escrow Management</h2>
        <p className="text-cyan-100/80">Manage your smart contract escrow payments</p>
      </div>

      {escrowJobs.map((job) => (
        <Card key={job.id} className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-cyan-100 text-xl mb-2">{job.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-cyan-100/70">
                  <span>Client: {job.client}</span>
                  <span>Created: {job.createdAt}</span>
                  <span>Deadline: {job.deadline}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400 flex items-center">
                  <DollarSign size={20} />
                  {job.amount} SUI
                </div>
                <Badge className={`${getStatusColor(job.status)} mt-2`}>
                  {getStatusIcon(job.status)}
                  <span className="ml-1 capitalize">{job.status.replace("_", " ")}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-sm text-cyan-100/70">
                <p>Freelancer: {job.freelancer}</p>
              </div>

              {job.status === "in_progress" && (
                <Button
                  onClick={() => releaseEscrow(job.id)}
                  disabled={isProcessing === job.id}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing === job.id ? "Processing..." : "Release Escrow"}
                </Button>
              )}

              {job.status === "completed" && (
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle size={16} className="mr-1" />
                  Funds Released
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
