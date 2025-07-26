"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, CheckCircle, AlertCircle, DollarSign, WifiOff } from "lucide-react"
import { useSuiWallet } from "@/components/wallet/sui-wallet-provider"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Transaction } from "@mysten/sui/transactions"
import SuiEscrow from "./sui-escrow"
import { useNetworkErrorHandler, setupNetworkListeners, isOnline } from "@/lib/error-handling"
import { checkNetworkConnection } from "@/lib/sui"

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
  const { handleNetworkError } = useNetworkErrorHandler()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [networkAvailable, setNetworkAvailable] = useState<boolean>(true)
  const [isOnlineStatus, setIsOnlineStatus] = useState<boolean>(true)

  // State for escrow jobs
  const [escrowJobs, setEscrowJobs] = useState<EscrowJob[]>([])
  
  // Setup network status monitoring
  useEffect(() => {
    const checkConnection = async () => {
      const online = isOnline();
      setIsOnlineStatus(online);
      
      if (online) {
        const available = await checkNetworkConnection();
        setNetworkAvailable(available);
        
        if (!available) {
          toast({
            title: "Blockchain Network Unavailable",
            description: "Unable to connect to the Sui blockchain. Some features may not work correctly.",
            variant: "destructive",
          });
        }
      }
    };
    
    checkConnection();
    
    // Setup network listeners
    const cleanup = setupNetworkListeners(
      // Offline handler
      () => {
        setIsOnlineStatus(false);
        toast({
          title: "You're Offline",
          description: "Please check your internet connection to continue using blockchain features.",
          variant: "destructive",
        });
      },
      // Online handler
      () => {
        setIsOnlineStatus(true);
        toast({
          title: "You're Back Online",
          description: "Reconnected to the internet. Blockchain features are now available.",
        });
        checkConnection();
      }
    );
    
    return cleanup;
  }, [toast]);
  
  // Fetch escrow jobs from the blockchain
  useEffect(() => {
    const fetchEscrowJobs = async () => {
      if (!isConnected || !provider || !isOnlineStatus || !networkAvailable) return;
      
      try {
        // This would be replaced with actual blockchain calls to fetch escrow data
        // For example, you might query events or objects owned by the user
        // This is just a placeholder for the real implementation
        console.log("Fetching escrow jobs from blockchain...");
        
        // Leave the array empty for now - it will be populated with real data
        setEscrowJobs([]);
      } catch (error) {
        handleNetworkError(error, "Failed to fetch escrow jobs");
      }
    };
    
    fetchEscrowJobs();
  }, [isConnected, provider, isOnlineStatus, networkAvailable, handleNetworkError]);

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
    if (!isOnlineStatus) {
      toast({
        title: "You're Offline",
        description: "Please check your internet connection to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!networkAvailable) {
      toast({
        title: "Blockchain Network Unavailable",
        description: "Unable to connect to the Sui blockchain. Please try again later.",
        variant: "destructive",
      });
      return;
    }

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
      handleNetworkError(error, "Failed to Release Escrow");
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

      {!isOnlineStatus && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-red-300 mb-4 flex items-center justify-center">
          <WifiOff className="h-5 w-5 mr-2" />
          <span>You are currently offline. Please check your internet connection.</span>
        </div>
      )}
      
      {isOnlineStatus && !networkAvailable && (
        <div className="p-4 bg-orange-900/30 border border-orange-700 rounded-md text-orange-300 mb-4 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Blockchain network is currently unavailable. Some features may not work correctly.</span>
        </div>
      )}

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
