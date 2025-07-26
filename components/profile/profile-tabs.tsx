"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, DollarSign, Trophy, Eye, Palette, Briefcase } from "lucide-react"
import { useUser } from "@/components/providers/user-provider"

export default function ProfileTabs() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-cyan-400 text-xl">Loading profile data...</div>
      </div>
    )
  }

  // Mock data - in a real app, this would come from the database
  const completedJobs = [
    {
      id: 1,
      title: "Sample Completed Project",
      client: "Demo Client",
      rating: 5,
      earnings: 250,
      duration: "2 weeks",
      completedDate: "2024-01-15",
      skills: user.skills?.slice(0, 3) || ["Web Development"],
      review: "Great work! Professional and delivered on time.",
    },
  ]

  const nftCollection = [
    {
      id: 1,
      name: "Early Adopter",
      description: "Joined SuiWork platform",
      image: "/placeholder.svg?height=200&width=200",
      rarity: "Common",
      earnedDate: user.created_at.split("T")[0],
    },
  ]

  const creatorStats = {
    totalNFTs: 0,
    totalSales: 0,
    totalEarnings: 0,
    followers: 0,
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-cyan-500/20">
        <TabsTrigger
          value="overview"
          className="text-cyan-100 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="text-cyan-100 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
        >
          {user.role === "client" ? "Posted Jobs" : user.role === "freelancer" ? "Completed Jobs" : "NFTs Created"}
        </TabsTrigger>
        <TabsTrigger
          value="achievements"
          className="text-cyan-100 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
        >
          Achievements
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-cyan-500/20 text-center">
            <CardContent className="p-6">
              <Star className="text-yellow-400 w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{user.rating.toFixed(1)}</div>
              <div className="text-sm text-cyan-100/70">Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20 text-center">
            <CardContent className="p-6">
              <Briefcase className="text-cyan-400 w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-400">{user.jobs_completed}</div>
              <div className="text-sm text-cyan-100/70">Jobs Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20 text-center">
            <CardContent className="p-6">
              <Trophy className="text-purple-400 w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">1</div>
              <div className="text-sm text-cyan-100/70">NFTs Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20 text-center">
            <CardContent className="p-6">
              <Calendar className="text-green-400 w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {Math.max(1, Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)))}
              </div>
              <div className="text-sm text-cyan-100/70">Days Active</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Role</h4>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 capitalize">{user.role}</Badge>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Bio</h4>
              <p className="text-cyan-100/80">{user.bio || "No bio added yet"}</p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-cyan-100/60">No skills added yet</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Member Since</h4>
              <p className="text-cyan-100/80">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6 mt-6">
        {user.role === "freelancer" && (
          <div className="grid gap-6">
            {completedJobs.length > 0 ? (
              completedJobs.map((job) => (
                <Card key={job.id} className="bg-gray-900/50 border-cyan-500/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-cyan-100 text-xl mb-2">{job.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-cyan-100/70">
                          <span>Client: {job.client}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{job.completedDate}</span>
                          </div>
                          <span>{job.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400 flex items-center">
                          <DollarSign size={20} />
                          {job.earnings} SUI
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          {[...Array(job.rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-cyan-100/80 italic">"{job.review}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-gray-900/50 border-cyan-500/20">
                <CardContent className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No completed jobs yet</h3>
                  <p className="text-cyan-100/70">Start applying to jobs to build your portfolio</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {user.role === "client" && (
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
              <p className="text-cyan-100/70">Start by posting your first job</p>
            </CardContent>
          </Card>
        )}

        {user.role === "creator" && (
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardContent className="text-center py-12">
              <Palette className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No NFTs created yet</h3>
              <p className="text-cyan-100/70">Start by minting your first Creator NFT</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="achievements" className="space-y-6 mt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nftCollection.map((nft) => (
            <Card
              key={nft.id}
              className="bg-gray-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="text-center">
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle className="text-cyan-100">{nft.name}</CardTitle>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {nft.rarity}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-100/80 text-sm mb-3">{nft.description}</p>
                <div className="flex items-center justify-between text-sm text-cyan-100/70">
                  <span>Earned: {nft.earnedDate}</span>
                  <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
