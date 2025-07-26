"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Palette, Upload, Star, Users } from "lucide-react"
import { useWallet } from "@/components/wallet/wallet-provider"
import { useToast } from "@/hooks/use-toast"

export default function NFTMinter() {
  const { isConnected, signTransaction } = useWallet()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    price: "",
    supply: "",
    benefits: [] as string[],
    tier: "Bronze",
  })
  const [currentBenefit, setCurrentBenefit] = useState("")

  const tiers = [
    { name: "Bronze", color: "from-amber-600 to-amber-800", price: "20-50" },
    { name: "Silver", color: "from-gray-300 to-gray-500", price: "50-100" },
    { name: "Gold", color: "from-yellow-300 to-yellow-500", price: "100-200" },
    { name: "Premium", color: "from-yellow-400 to-orange-500", price: "200+" },
  ]

  const addBenefit = () => {
    if (currentBenefit.trim() && !nftData.benefits.includes(currentBenefit.trim())) {
      setNftData({
        ...nftData,
        benefits: [...nftData.benefits, currentBenefit.trim()],
      })
      setCurrentBenefit("")
    }
  }

  const removeBenefit = (benefitToRemove: string) => {
    setNftData({
      ...nftData,
      benefits: nftData.benefits.filter((benefit) => benefit !== benefitToRemove),
    })
  }

  const mintNFT = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Mock NFT minting
      const txHash = await signTransaction({
        type: "mint_creator_nft",
        data: nftData,
      })

      toast({
        title: "NFT Minted Successfully!",
        description: `Your Creator Access NFT has been minted. Transaction: ${txHash}`,
      })

      // Reset form
      setNftData({
        name: "",
        description: "",
        price: "",
        supply: "",
        benefits: [],
        tier: "Bronze",
      })
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Mint Your <span className="text-cyan-400">Creator NFT</span>
        </h2>
        <p className="text-cyan-100/80 text-lg">Create access tokens for your exclusive content and services</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Palette className="mr-2" size={20} />
                NFT Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-cyan-100">
                  NFT Name *
                </Label>
                <Input
                  id="name"
                  value={nftData.name}
                  onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                  placeholder="e.g., Premium Access Pass"
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-cyan-100">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={nftData.description}
                  onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                  placeholder="Describe what holders get access to..."
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-cyan-100">
                    Price (SUI) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={nftData.price}
                    onChange={(e) => setNftData({ ...nftData, price: e.target.value })}
                    placeholder="50"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  />
                </div>

                <div>
                  <Label htmlFor="supply" className="text-cyan-100">
                    Total Supply *
                  </Label>
                  <Input
                    id="supply"
                    type="number"
                    value={nftData.supply}
                    onChange={(e) => setNftData({ ...nftData, supply: e.target.value })}
                    placeholder="100"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Benefits & Perks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  placeholder="Add a benefit (e.g., 1-on-1 mentoring)"
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} className="bg-cyan-600 hover:bg-cyan-700">
                  Add
                </Button>
              </div>

              {nftData.benefits.length > 0 && (
                <div className="space-y-2">
                  {nftData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                      <span className="text-cyan-100">{benefit}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeBenefit(benefit)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Tier Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    nftData.tier === tier.name
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-cyan-500/20 hover:border-cyan-400/40"
                  }`}
                  onClick={() => setNftData({ ...nftData, tier: tier.name })}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                        {tier.name}
                      </div>
                      <div className="text-xs text-cyan-100/70">{tier.price} SUI range</div>
                    </div>
                    <Star className={`w-4 h-4 ${nftData.tier === tier.name ? "text-cyan-400" : "text-gray-500"}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg p-4 space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                  <Upload className="text-cyan-400 w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{nftData.name || "NFT Name"}</h3>
                  <p className="text-cyan-100/70 text-sm">{nftData.description || "Description..."}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold">{nftData.price || "0"} SUI</span>
                  <Badge className="bg-purple-500/20 text-purple-400">
                    <Users size={12} className="mr-1" />
                    {nftData.supply || "0"} supply
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={mintNFT}
            disabled={isLoading || !nftData.name || !nftData.price}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? "Minting NFT..." : "Mint Creator NFT"}
          </Button>
        </div>
      </div>
    </div>
  )
}
