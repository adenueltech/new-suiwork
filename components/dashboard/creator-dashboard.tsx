"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Palette, Users, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { supabase, type CreatorNFT } from "@/lib/supabase"
import { useUser } from "@/components/providers/user-provider"

export default function CreatorDashboard() {
  const { user } = useUser()
  const [nfts, setNfts] = useState<CreatorNFT[]>([])
  const [stats, setStats] = useState({
    totalNFTs: 0,
    totalSales: 0,
    totalEarnings: 0,
    followers: 0,
  })

  useEffect(() => {
    if (user) {
      loadCreatorNFTs()
      loadCreatorStats()
    }
  }, [user])

  const loadCreatorNFTs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("creator_nfts")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading NFTs:", error)
        return
      }

      setNfts(data || [])
    } catch (error) {
      console.error("Error in loadCreatorNFTs:", error)
    }
  }

  const loadCreatorStats = async () => {
    if (!user) return

    try {
      // Mock stats for now - replace with real Supabase queries
      setStats({
        totalNFTs: 3,
        totalSales: 45,
        totalEarnings: 1250,
        followers: 567,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "from-yellow-400 to-orange-500"
      case "gold":
        return "from-yellow-300 to-yellow-500"
      case "silver":
        return "from-gray-300 to-gray-500"
      case "bronze":
        return "from-amber-600 to-amber-800"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-cyan-400 text-xl">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-cyan-100/80">Welcome back, {user.username}!</p>
        </div>
        <Link href="/mint-nft">
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
            <Plus size={20} className="mr-2" />
            Mint New NFT
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <Palette className="text-purple-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{stats.totalNFTs}</div>
            <div className="text-sm text-cyan-100/70">NFTs Created</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="text-green-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{stats.totalSales}</div>
            <div className="text-sm text-cyan-100/70">Total Sales</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <DollarSign className="text-cyan-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-400">{stats.totalEarnings}</div>
            <div className="text-sm text-cyan-100/70">Total Earnings (SUI)</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <Users className="text-blue-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{stats.followers}</div>
            <div className="text-sm text-cyan-100/70">Followers</div>
          </CardContent>
        </Card>
      </div>

      {/* Creator NFTs */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Your Creator NFTs</CardTitle>
        </CardHeader>
        <CardContent>
          {nfts.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No NFTs created yet</h3>
              <p className="text-cyan-100/70 mb-4">
                Start monetizing your expertise by creating your first Creator NFT
              </p>
              <Link href="/mint-nft">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                  Create Your First NFT
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div key={nft.id} className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-cyan-100 font-semibold">{nft.name}</h3>
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r ${getTierColor(nft.tier)}`}
                    >
                      {nft.tier.toUpperCase()}
                    </div>
                  </div>

                  <p className="text-cyan-100/70 text-sm mb-3 line-clamp-2">{nft.description}</p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-cyan-400 font-bold">{nft.price} SUI</span>
                    <span className="text-sm text-cyan-100/70">
                      {nft.sold}/{nft.supply} sold
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(nft.sold / nft.supply) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-cyan-500/50 text-cyan-400 bg-transparent"
                    >
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                      View Stats
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
