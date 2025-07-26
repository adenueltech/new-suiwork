"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, Medal } from "lucide-react"
import { supabase, type ReputationNFT } from "@/lib/supabase"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import { useToast } from "@/hooks/use-toast"

export default function ReputationNFTManager() {
  const { user } = useUser()
  const { isConnected, signTransaction } = useWallet()
  const { toast } = useToast()
  const [reputationNFTs, setReputationNFTs] = useState<ReputationNFT[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadReputationNFTs()
    }
  }, [user])

  const loadReputationNFTs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("reputation_nfts")
        .select("*")
        .eq("user_id", user.id)
        .order("minted_at", { ascending: false })

      if (error) {
        console.error("Error loading reputation NFTs:", error)
        return
      }

      setReputationNFTs(data || [])
    } catch (error) {
      console.error("Error in loadReputationNFTs:", error)
    }
  }

  const mintReputationNFT = async (jobId: string, jobTitle: string) => {
    if (!isConnected || !user) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint reputation NFTs.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Mock NFT minting
      const txHash = await signTransaction({
        type: "mint_reputation_nft",
        jobId,
        userId: user.id,
      })

      // Save to Supabase
      const newNFT: Partial<ReputationNFT> = {
        user_id: user.id,
        job_id: jobId,
        nft_name: `Job Completion: ${jobTitle}`,
        description: `Successfully completed the job: ${jobTitle}`,
        rarity: "common", // Could be determined by job complexity/value
        metadata: {
          jobTitle,
          completionDate: new Date().toISOString(),
          txHash,
        },
      }

      const { error } = await supabase.from("reputation_nfts").insert([newNFT])

      if (error) {
        console.error("Error saving reputation NFT:", error)
        throw error
      }

      toast({
        title: "Reputation NFT Minted!",
        description: `Your completion NFT for "${jobTitle}" has been minted successfully.`,
      })

      loadReputationNFTs()
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint reputation NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500"
      case "epic":
        return "from-purple-500 to-pink-500"
      case "rare":
        return "from-blue-500 to-cyan-500"
      case "common":
        return "from-gray-400 to-gray-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return Trophy
      case "epic":
        return Award
      case "rare":
        return Medal
      case "common":
        return Star
      default:
        return Star
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Reputation NFTs</h2>
        <p className="text-cyan-100/80">Your on-chain proof of completed work and achievements</p>
      </div>

      {reputationNFTs.length === 0 ? (
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reputation NFTs Yet</h3>
            <p className="text-cyan-100/70">
              Complete jobs to earn reputation NFTs that prove your skills and reliability
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reputationNFTs.map((nft) => {
            const RarityIcon = getRarityIcon(nft.rarity)
            return (
              <Card
                key={nft.id}
                className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getRarityColor(nft.rarity)} flex items-center justify-center`}
                  >
                    <RarityIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-cyan-100 text-lg">{nft.nft_name}</CardTitle>
                  <Badge className={`bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white border-0`}>
                    {nft.rarity.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-cyan-100/80 text-sm mb-4 text-center">{nft.description}</p>
                  <div className="text-xs text-cyan-100/60 text-center">
                    Minted: {new Date(nft.minted_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Mock button to simulate job completion */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Mint Reputation NFT</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cyan-100/80 mb-4">
            This would normally be triggered automatically when a job is completed. For demo purposes, you can mint a
            sample reputation NFT:
          </p>
          <Button
            onClick={() => mintReputationNFT("demo-job-1", "Demo Project Completion")}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
          >
            {isLoading ? "Minting..." : "Mint Demo Reputation NFT"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
