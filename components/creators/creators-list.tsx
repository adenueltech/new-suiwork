"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Shield, ExternalLink } from "lucide-react"

export default function CreatorsList() {
  const creators = [
    {
      id: 1,
      name: "Alex Chen",
      title: "Smart Contract Developer",
      description: "Specialized in DeFi protocols and security audits. 5+ years experience in blockchain development.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      followers: 1247,
      nftPrice: 50,
      nftSupply: 100,
      nftSold: 73,
      skills: ["Solidity", "Move", "Rust", "DeFi"],
      tier: "Premium",
      benefits: ["1-on-1 mentoring", "Code reviews", "Early job access", "Private Discord"],
    },
    {
      id: 2,
      name: "Sarah Kim",
      title: "UI/UX Designer",
      description: "Creating beautiful and intuitive Web3 interfaces. Specialized in crypto wallet UX and DeFi design.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.8,
      followers: 892,
      nftPrice: 30,
      nftSupply: 150,
      nftSold: 124,
      skills: ["Figma", "Web3 UX", "Design Systems", "Prototyping"],
      tier: "Gold",
      benefits: ["Design templates", "Portfolio reviews", "Design tips", "Community access"],
    },
    {
      id: 3,
      name: "Marcus Johnson",
      title: "Full-Stack Developer",
      description:
        "Building scalable Web3 applications with modern frameworks. Expert in React, Node.js, and blockchain integration.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.7,
      followers: 634,
      nftPrice: 25,
      nftSupply: 200,
      nftSold: 89,
      skills: ["React", "Node.js", "Web3.js", "TypeScript"],
      tier: "Silver",
      benefits: ["Code tutorials", "Project feedback", "Career advice", "Weekly calls"],
    },
    {
      id: 4,
      name: "Emma Davis",
      title: "Content Creator & Marketer",
      description:
        "Helping Web3 projects grow through content marketing and community building. 3+ years in crypto space.",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4.9,
      followers: 2156,
      nftPrice: 20,
      nftSupply: 300,
      nftSold: 267,
      skills: ["Content Marketing", "SEO", "Community", "Social Media"],
      tier: "Bronze",
      benefits: ["Marketing guides", "Content templates", "Growth strategies", "Q&A sessions"],
    },
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium":
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case "Gold":
        return "bg-gradient-to-r from-yellow-300 to-yellow-500"
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case "Bronze":
        return "bg-gradient-to-r from-amber-600 to-amber-800"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Featured Creators</h2>
        <select className="bg-black/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:border-cyan-400 focus:outline-none">
          <option>Sort by: Rating</option>
          <option>Sort by: Followers</option>
          <option>Sort by: Price (Low to High)</option>
          <option>Sort by: Price (High to Low)</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {creators.map((creator) => (
          <Card
            key={creator.id}
            className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
          >
            <CardHeader className="relative">
              <div
                className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white ${getTierColor(creator.tier)} rounded-bl-lg`}
              >
                {creator.tier}
              </div>

              <div className="flex items-start space-x-4">
                <img
                  src={creator.avatar || "/placeholder.svg"}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full border-2 border-cyan-400/50"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-cyan-100 mb-1">{creator.name}</h3>
                  <p className="text-cyan-400 font-medium mb-2">{creator.title}</p>

                  <div className="flex items-center space-x-4 text-sm text-cyan-100/70">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span>{creator.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{creator.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-cyan-100/80 leading-relaxed">{creator.description}</p>

              <div className="flex flex-wrap gap-2">
                {creator.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="border border-cyan-500/20 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-100 font-medium">Access NFT</span>
                  <span className="text-2xl font-bold text-cyan-400">{creator.nftPrice} SUI</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(creator.nftSold / creator.nftSupply) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-cyan-100/70">
                  <span>{creator.nftSold} sold</span>
                  <span>{creator.nftSupply - creator.nftSold} remaining</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-100">Benefits included:</p>
                  <ul className="text-sm text-cyan-100/70 space-y-1">
                    {creator.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Shield size={12} className="text-green-400" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">Mint Access NFT</Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
                >
                  <ExternalLink size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
