"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createEscrow, lockFunds, releaseFunds } from "@/lib/sui";
import { useSuiWallet } from "@/components/wallet/sui-wallet-provider";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "@/hooks/use-toast";

export default function SuiEscrow() {
  const { isConnected, address, provider, signTransaction } = useSuiWallet();
  const { toast } = useToast();
  const [jobId, setJobId] = useState<number>(0);
  const [freelancerAddress, setFreelancerAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [escrowId, setEscrowId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateEscrow = async () => {
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
      // The transaction digest is returned, but we need to query for created objects
      if (result && provider) {
        try {
          // For simplicity, we'll just store the transaction digest
          // In a real app, you would query for the created objects
          setEscrowId(result);
          toast({
            title: "Escrow Created Successfully!",
            description: `Transaction ID: ${result}`,
          });
          
          // Note: The following code would need to be updated to use the correct API
          // This is commented out as the current SuiClient doesn't have getTransaction method
          /*
          const txDetails = await provider.getTransaction({
            digest: result,
            options: { showEffects: true, showEvents: true }
          });
          
          if (txDetails.effects?.created && txDetails.effects.created.length > 0) {
            const escrowObject = txDetails.effects.created[0];
            setEscrowId(escrowObject.reference.objectId);
          */
        } catch (error) {
          console.error("Error processing transaction result:", error);
          toast({
            title: "Transaction Successful",
            description: `Error processing result: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Transaction Failed",
          description: "No transaction digest returned",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating escrow:", error);
      toast({
        title: "Error Creating Escrow",
        description: `${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLockFunds = async () => {
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
      console.error("Error locking funds:", error);
      toast({
        title: "Error Locking Funds",
        description: `${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseFunds = async () => {
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
      console.error("Error releasing funds:", error);
      toast({
        title: "Error Releasing Funds",
        description: `${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
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