"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createEscrow, lockFunds, releaseFunds, checkNetworkConnection } from "@/lib/sui";
import { useSuiWallet } from "@/components/wallet/sui-wallet-provider";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "@/hooks/use-toast";
import { useNetworkErrorHandler, setupNetworkListeners, isOnline } from "@/lib/error-handling";
import { AlertCircle, WifiOff } from "lucide-react";

export default function SuiEscrow() {
  const { isConnected, address, provider, signTransaction } = useSuiWallet();
  const { toast } = useToast();
  const { handleNetworkError } = useNetworkErrorHandler();
  const [jobId, setJobId] = useState<number>(0);
  const [freelancerAddress, setFreelancerAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [escrowId, setEscrowId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [networkAvailable, setNetworkAvailable] = useState<boolean>(true);
  const [isOnlineStatus, setIsOnlineStatus] = useState<boolean>(true);

  // Check network connection on mount
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

  const handleCreateEscrow = async () => {
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

    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Sui wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!jobId || !freelancerAddress || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    toast({
      title: "Creating Escrow",
      description: "Transaction in progress...",
    });

    try {
      // Create a transaction block
      const tx = new Transaction();
      
      // Call the create_escrow function
      const escrowObject = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::create_escrow`,
        arguments: [
          tx.pure(jobId),
          tx.pure(address), // client address (current wallet)
          tx.pure(freelancerAddress),
          tx.pure(amount * 1_000_000_000), // convert SUI to MIST
        ],
      });
      
      // Execute the transaction
      const result = await signTransaction({
        type: "call_contract",
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::create_escrow`,
        arguments: [escrowObject]
      });
      
      // Extract the escrow object ID from the transaction result
      if (result && provider) {
        try {
          // For simplicity, we'll just store the transaction digest
          setEscrowId(result);
          toast({
            title: "Escrow Created Successfully!",
            description: `Transaction ID: ${result}`,
          });
        } catch (error) {
          handleNetworkError(error, "Transaction Processing Error");
        }
      } else {
        toast({
          title: "Transaction Failed",
          description: "No transaction digest returned",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleNetworkError(error, "Error Creating Escrow");
    } finally {
      setLoading(false);
    }
  };

  const handleLockFunds = async () => {
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

    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Sui wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!escrowId || !amount) {
      toast({
        title: "Missing Information",
        description: "Please provide escrow ID and amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    toast({
      title: "Locking Funds",
      description: "Transaction in progress...",
    });

    try {
      // Create a transaction block
      const tx = new Transaction();
      
      // Create a coin object with the specified amount
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount * 1_000_000_000)]); // convert SUI to MIST
      
      // Call the lock_funds function
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::lock_funds`,
        arguments: [
          tx.object(escrowId),
          coin,
        ],
      });
      
      // Execute the transaction
      await signTransaction({
        type: "call_contract",
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::lock_funds`,
        arguments: [tx.object(escrowId), coin]
      });
      
      toast({
        title: "Success",
        description: "Funds locked successfully!",
      });
    } catch (error) {
      handleNetworkError(error, "Error Locking Funds");
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseFunds = async () => {
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

    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Sui wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!escrowId || !freelancerAddress) {
      toast({
        title: "Missing Information",
        description: "Please provide escrow ID and freelancer address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    toast({
      title: "Releasing Funds",
      description: "Transaction in progress...",
    });

    try {
      // Create a transaction block
      const tx = new Transaction();
      
      // Call release_funds and get the coin
      const coin = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::release_funds`,
        arguments: [tx.object(escrowId)],
      });
      
      // Transfer the coin to the freelancer
      tx.transferObjects([coin], tx.pure(freelancerAddress));
      
      // Execute the transaction
      await signTransaction({
        type: "call_contract",
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::release_funds`,
        arguments: [tx.object(escrowId)]
      });
      
      toast({
        title: "Success",
        description: "Funds released successfully!",
      });
    } catch (error) {
      handleNetworkError(error, "Error Releasing Funds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sui Escrow System</CardTitle>
        <CardDescription>
          Create and manage escrow contracts on the Sui blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOnlineStatus && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 mb-4 flex items-center">
            <WifiOff className="h-5 w-5 mr-2" />
            <span>You are currently offline. Please check your internet connection.</span>
          </div>
        )}
        
        {isOnlineStatus && !networkAvailable && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-md text-orange-800 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Blockchain network is currently unavailable. Some features may not work correctly.</span>
          </div>
        )}
        
        {!isConnected ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 mb-4">
            Please connect your Sui wallet to use the escrow system.
          </div>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 mb-4">
            Connected with wallet: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="jobId">Job ID</Label>
          <Input
            id="jobId"
            type="number"
            value={jobId || ""}
            onChange={(e) => setJobId(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="freelancerAddress">Freelancer Address</Label>
          <Input
            id="freelancerAddress"
            placeholder="0x..."
            value={freelancerAddress}
            onChange={(e) => setFreelancerAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (in SUI)</Label>
          <Input
            id="amount"
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        {escrowId && (
          <div className="space-y-2">
            <Label htmlFor="escrowId">Escrow ID</Label>
            <Input
              id="escrowId"
              value={escrowId}
              onChange={(e) => setEscrowId(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex space-x-2 w-full">
          <Button 
            onClick={handleCreateEscrow} 
            disabled={loading}
            className="flex-1"
          >
            Create Escrow
          </Button>
        </div>
        {escrowId && (
          <div className="flex space-x-2 w-full">
            <Button 
              onClick={handleLockFunds} 
              disabled={loading}
              className="flex-1"
              variant="outline"
            >
              Lock Funds
            </Button>
            <Button 
              onClick={handleReleaseFunds} 
              disabled={loading}
              className="flex-1"
              variant="outline"
            >
              Release Funds
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}