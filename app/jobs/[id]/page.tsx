"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, User, Briefcase, AlertCircle, Shield, CheckCircle, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/components/providers/user-provider"
import { useWallet, WalletConnectButton } from "@/components/wallet/wallet-provider"
import { Transaction } from "@mysten/sui/transactions"
import { useWallets, useCurrentWallet } from '@mysten/dapp-kit'
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

interface Job {
  id: string
  title: string
  description: string
  category: string
  budget: number
  duration: string
  skills: string[]
  requirements?: string
  status: string
  created_at: string
  escrow_locked: boolean
  escrow_id?: string
  client_id: string
  client: {
    username: string
    rating: number
  }
}

export default function JobDetailsPage() {
  const params = useParams()
  const jobId = params?.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const { isConnected, address, provider } = useWallet()
  const wallets = useWallets()
  const { currentWallet } = useCurrentWallet()
  const { toast } = useToast()
  const [escrowId, setEscrowId] = useState<string>("")
  const [isCreatingEscrow, setIsCreatingEscrow] = useState(false)
  const [isLockingFunds, setIsLockingFunds] = useState(false)
  const [isReleasingFunds, setIsReleasingFunds] = useState(false)

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return

      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from("jobs")
          .select(`
            *,
            client:users!jobs_client_id_fkey(username, rating)
          `)
          .eq("id", jobId)
          .single()

        if (fetchError) {
          console.error("Error fetching job details:", fetchError)
          throw new Error(fetchError.message || "Failed to load job details")
        }

        if (!data) {
          throw new Error("Job not found")
        }

        setJob(data)
      } catch (error: any) {
        console.error("Error loading job details:", error)
        setError(error.message || "Failed to load job details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(budget)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Create escrow for the job
  const handleCreateEscrow = async () => {
    if (!job || !isConnected || !address || !currentWallet) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsCreatingEscrow(true)
    try {
      // Create a transaction block
      const tx = new Transaction()
      
      // Get a valid freelancer address - for now using a placeholder
      // In a real app, you would get this from the job data or user selection
      const freelancerAddress = "0x2345678901abcdef2345678901abcdef23456789";
      
      // Convert job ID to a number
      const jobIdNumber = parseInt(job.id);
      
      // Convert budget to MIST (1 SUI = 10^9 MIST) and ensure it's an integer
      const budgetInMist = Math.floor(job.budget * 1_000_000_000);
      
      console.log("Creating escrow with params:", {
        jobId: jobIdNumber,
        client: address,
        freelancer: freelancerAddress,
        amount: budgetInMist
      });
      
      // Call the create_escrow function
      const escrowObject = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::create_escrow`,
        arguments: [
          tx.pure(jobIdNumber), // job_id
          tx.pure(address), // client address
          tx.pure(freelancerAddress), // freelancer address
          tx.pure(budgetInMist), // amount in MIST
        ],
      })
      
      // Execute the transaction
      const result = await currentWallet.signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })
      
      if (result) {
        const txDigest = result.digest;
        setEscrowId(txDigest)
        
        // Update the job in the database to include the escrow ID
        const { error: updateError } = await supabase
          .from("jobs")
          .update({ escrow_id: txDigest })
          .eq("id", job.id)
        
        if (updateError) {
          console.error("Error updating job with escrow ID:", updateError)
        } else {
          // Update the local job state
          setJob({
            ...job,
            escrow_id: txDigest
          })
        }
        
        toast({
          title: "Escrow Created",
          description: `Escrow created successfully! Transaction: ${txDigest.slice(0, 10)}...`,
        })
      }
    } catch (error) {
      console.error("Error creating escrow:", error)
      toast({
        title: "Error",
        description: `Failed to create escrow: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsCreatingEscrow(false)
    }
  }

  // Lock funds in escrow
  const handleLockFunds = async () => {
    if (!job || !job.escrow_id || !isConnected || !currentWallet) {
      toast({
        title: "Error",
        description: "Please create an escrow first",
        variant: "destructive",
      })
      return
    }

    setIsLockingFunds(true)
    try {
      // Create a transaction block
      const tx = new Transaction()
      
      // Convert budget to MIST and ensure it's an integer
      const lockAmount = Math.floor(job.budget * 1_000_000_000);
      
      // Create a coin object with the specified amount
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(lockAmount)]) // convert SUI to MIST
      
      // Call the lock_funds function
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::lock_funds`,
        arguments: [
          tx.object(job.escrow_id),
          coin,
        ],
      })
      
      // Execute the transaction
      const result = await currentWallet.signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })
      
      if (result) {
        const txDigest = result.digest;
        
        // Update the job in the database to mark escrow as locked
        const { error: updateError } = await supabase
          .from("jobs")
          .update({ escrow_locked: true })
          .eq("id", job.id)
        
        if (updateError) {
          console.error("Error updating job escrow status:", updateError)
        } else {
          // Update the local job state
          setJob({
            ...job,
            escrow_locked: true
          })
        }
        
        toast({
          title: "Funds Locked",
          description: `Funds locked in escrow successfully! Transaction: ${txDigest.slice(0, 10)}...`,
        })
      }
    } catch (error) {
      console.error("Error locking funds:", error)
      toast({
        title: "Error",
        description: `Failed to lock funds: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLockingFunds(false)
    }
  }

  // Release funds to freelancer
  const handleReleaseFunds = async () => {
    if (!job || !job.escrow_id || !isConnected || !currentWallet) {
      toast({
        title: "Error",
        description: "No escrow found for this job",
        variant: "destructive",
      })
      return
    }

    setIsReleasingFunds(true)
    try {
      // Create a transaction block
      const tx = new Transaction()
      
      // Call release_funds and get the coin
      const coin = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_SUIWORK_PACKAGE_ID}::escrow::release_funds`,
        arguments: [tx.object(job.escrow_id)],
      })
      
      // Get a valid freelancer address - for now using a placeholder
      const freelancerAddress = "0x2345678901abcdef2345678901abcdef23456789";
      
      // Transfer the coin to the freelancer
      tx.transferObjects([coin], tx.pure(freelancerAddress))
      
      // Execute the transaction
      const result = await currentWallet.signAndExecuteTransaction({
        transaction: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      })
      
      if (result) {
        const txDigest = result.digest;
        
        // Update the job in the database
        const { error: updateError } = await supabase
          .from("jobs")
          .update({ status: "completed" })
          .eq("id", job.id)
        
        if (updateError) {
          console.error("Error updating job status:", updateError)
        } else {
          // Update the local job state
          setJob({
            ...job,
            status: "completed"
          })
        }
        
        toast({
          title: "Funds Released",
          description: `Funds released to freelancer successfully! Transaction: ${txDigest.slice(0, 10)}...`,
        })
      }
    } catch (error) {
      console.error("Error releasing funds:", error)
      toast({
        title: "Error",
        description: `Failed to release funds: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsReleasingFunds(false)
    }
  }

  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <Card className="bg-gray-900/50 border-gray-700 animate-pulse">
              <CardHeader>
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error Loading Job</h3>
                <p className="text-red-300 mb-4">{error}</p>
                <Link href="/jobs">
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                  >
                    Back to Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : job ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <Link href="/jobs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mb-4 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      ← Back to Jobs
                    </Button>
                  </Link>
                  <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300">
                      {job.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>Posted on {formatDate(job.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>{job.client?.username || "Unknown Client"}</span>
                      {job.client?.rating > 0 && (
                        <span className="text-yellow-400">★ {job.client.rating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
                {user?.role === "freelancer" && (
                  <Link href={`/jobs/${job.id}/proposals`}>
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      Submit Proposal
                    </Button>
                  </Link>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {job.requirements && (
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-300 whitespace-pre-line">{job.requirements}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Skills Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-gray-600 text-gray-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Job Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Budget</div>
                          <div className="text-xl font-semibold text-green-400 flex items-center">
                            <DollarSign size={20} className="mr-1" />
                            {formatBudget(job.budget)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Duration</div>
                          <div className="text-lg text-white flex items-center">
                            <Clock size={18} className="mr-2 text-gray-400" />
                            {job.duration}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Status</div>
                          <Badge
                            className={
                              job.status === "open"
                                ? "bg-green-900/30 text-green-400 border-green-500/30"
                                : "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
                            }
                          >
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Escrow Card */}
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white flex items-center">
                        <Shield className="mr-2" size={20} />
                        Smart Contract Escrow
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Escrow Status */}
                      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Escrow Status:</h4>
                        <div className="flex items-center">
                          {job.escrow_id ? (
                            job.escrow_locked ? (
                              <Badge className="bg-green-900/30 text-green-400 border-green-500/30 flex items-center">
                                <Lock size={14} className="mr-1" />
                                Funds Locked
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-500/30 flex items-center">
                                <Shield size={14} className="mr-1" />
                                Escrow Created
                              </Badge>
                            )
                          ) : (
                            <Badge className="bg-gray-900/30 text-gray-400 border-gray-500/30 flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              No Escrow
                            </Badge>
                          )}
                        </div>
                        {job.escrow_id && (
                          <div className="mt-2 text-xs text-gray-400">
                            Escrow ID: {job.escrow_id.slice(0, 10)}...{job.escrow_id.slice(-6)}
                          </div>
                        )}
                      </div>

                      {/* Escrow Actions - Only show to client */}
                      {user?.id === job.client_id && (
                        <div className="space-y-3">
                          {!job.escrow_id && (
                            <Button
                              onClick={handleCreateEscrow}
                              disabled={isCreatingEscrow || !isConnected}
                              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              {isCreatingEscrow ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Creating Escrow...
                                </>
                              ) : (
                                <>
                                  <Shield size={16} className="mr-2" />
                                  Create Escrow
                                </>
                              )}
                            </Button>
                          )}
                          
                          {job.escrow_id && !job.escrow_locked && (
                            <Button
                              onClick={handleLockFunds}
                              disabled={isLockingFunds || !isConnected}
                              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                              {isLockingFunds ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Locking Funds...
                                </>
                              ) : (
                                <>
                                  <Lock size={16} className="mr-2" />
                                  Lock Funds ({job.budget} SUI)
                                </>
                              )}
                            </Button>
                          )}
                          
                          {job.escrow_id && job.escrow_locked && job.status === "open" && (
                            <Button
                              onClick={handleReleaseFunds}
                              disabled={isReleasingFunds || !isConnected}
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              {isReleasingFunds ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Releasing Funds...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} className="mr-2" />
                                  Release Funds to Freelancer
                                </>
                              )}
                            </Button>
                          )}
                          
                          {!isConnected && (
                            <div className="mt-4">
                              <div className="text-xs text-yellow-400 mb-2 text-center">
                                Please connect your Sui wallet to manage escrow
                              </div>
                              <WalletConnectButton />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Escrow Info */}
                      <div className="space-y-3 text-sm text-gray-300 mt-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Funds locked in smart contract</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Released only on completion</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>No platform fees</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Dispute resolution via DAO</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {user?.role === "freelancer" && (
                    <Link href={`/jobs/${job.id}/proposals`}>
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold">
                        Submit Proposal
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-400 mb-2">Job Not Found</h3>
                <p className="text-red-300 mb-4">The job you're looking for doesn't exist or has been removed.</p>
                <Link href="/jobs">
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                  >
                    Back to Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}