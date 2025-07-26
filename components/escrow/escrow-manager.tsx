"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useSuiWallet } from "@/components/wallet/sui-wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Transaction } from "@mysten/sui/transactions"
import SuiEscrow from "./sui-escrow"

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
  const { isConnected, signTransaction, provider } = useSuiWallet()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  // State for escrow jobs
  const [escrowJobs, setEscrowJobs] = useState<EscrowJob[]>([])
  
  // Fetch escrow jobs from the blockchain
  useEffect(() => {
    const fetchEscrowJobs = async () => {
      if (!isConnected || !provider) return;
      
      try {
        // This would be replaced with actual blockchain calls to fetch escrow data
        // For example, you might query events or objects owned by the user
        // This is just a placeholder for the real implementation
        console.log("Fetching escrow jobs from blockchain...");
        
        // Leave the array empty for now - it will be populated with real data
        setEscrowJobs([]);
      } catch (error) {
        console.error("Error fetching escrow jobs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch escrow jobs from the blockchain",
          variant: "destructive",
        });
      }
    };
    
    fetchEscrowJobs();
  }, [isConnected, provider, toast]);

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

  const releaseEscrow = async (jobId: string, freelancerAddress: string) => {
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
      // Create a transaction to release funds from escrow
      const tx = new Transaction();
      
      // Call release_funds and get the coin
      const coin = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::release_funds`,
        arguments: [tx.object(jobId)],
      });
      
      // Transfer the coin to the freelancer
      tx.transferObjects([coin], tx.pure(freelancerAddress));
      
      // Execute the transaction
      const txHash = await signTransaction({
        type: "call_contract",
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::release_funds`,
        arguments: [tx.object(jobId)]
      });

      toast({
        title: "Escrow Released!",
        description: `Funds have been released to the freelancer. Transaction: ${txHash}`,
      })
    } catch (error) {
      console.error("Error releasing escrow:", error);
      toast({
        title: "Transaction Failed",
        description: `Failed to release escrow: ${error instanceof Error ? error.message : String(error)}`,
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

      <Tabs defaultValue="sui" className="w-full">
        <TabsList className="grid w-full grid-cols-1 mb-6">
          <TabsTrigger value="sui">Sui Blockchain Escrow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sui">
          <div className="max-w-3xl mx-auto">
            <SuiEscrow />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
