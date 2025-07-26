"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, RefreshCw, Database, Users, Briefcase, Palette, MessageCircle, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"

export default function AdminPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalNFTs: 0,
    totalMessages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState("")

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Load database statistics
      const [usersResult, jobsResult, nftsResult, messagesResult] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("creator_nfts").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalNFTs: nftsResult.count || 0,
        totalMessages: messagesResult.count || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const resetDatabase = async (table: string) => {
    if (!confirm(`Are you sure you want to reset the ${table} table? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000")

      if (error) {
        throw error
      }

      toast({
        title: "Table Reset",
        description: `${table} table has been reset successfully.`,
      })

      loadStats()
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: `Failed to reset ${table} table.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const seedSampleData = async () => {
    setIsLoading(true)
    try {
      // Sample users
      const sampleUsers = [
        {
          wallet_address: "0x1234567890abcdef",
          role: "client",
          username: "TechCorp",
          bio: "Leading technology company",
          rating: 4.8,
          jobs_completed: 15,
        },
        {
          wallet_address: "0xabcdef1234567890",
          role: "freelancer",
          username: "DevExpert",
          bio: "Full-stack developer with 5+ years experience",
          skills: ["React", "Node.js", "TypeScript"],
          rating: 4.9,
          jobs_completed: 23,
        },
        {
          wallet_address: "0x9876543210fedcba",
          role: "creator",
          username: "DesignGuru",
          bio: "UI/UX designer specializing in Web3 interfaces",
          skills: ["Figma", "UI/UX", "Web3 Design"],
          rating: 4.7,
          jobs_completed: 18,
        },
      ]

      const { data: userData, error: userError } = await supabase.from("users").insert(sampleUsers).select()

      if (userError) throw userError

      // Sample jobs
      const sampleJobs = [
        {
          client_id: userData[0].id,
          title: "Build DeFi Dashboard",
          description: "Create a modern DeFi dashboard with real-time data",
          category: "Web Development",
          budget: 500,
          duration: "2 weeks",
          skills: ["React", "TypeScript", "DeFi"],
          status: "open",
          escrow_locked: false,
        },
        {
          client_id: userData[0].id,
          title: "Smart Contract Audit",
          description: "Security audit for NFT marketplace contracts",
          category: "Smart Contracts",
          budget: 800,
          duration: "1 week",
          skills: ["Solidity", "Security", "Audit"],
          status: "open",
          escrow_locked: false,
        },
      ]

      await supabase.from("jobs").insert(sampleJobs)

      // Create a sample conversation
      const conversationData = {
        participant_1: userData[0].id, // Client
        participant_2: userData[1].id, // Freelancer
      }

      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .insert([conversationData])
        .select()
        .single()

      if (!convError && convData) {
        // Add sample messages
        const sampleMessages = [
          {
            conversation_id: convData.id,
            sender_id: userData[0].id,
            content: "Hi! I'm interested in your services for the DeFi dashboard project.",
            message_type: "text",
          },
          {
            conversation_id: convData.id,
            sender_id: userData[1].id,
            content:
              "Hello! I'd be happy to help with your DeFi dashboard. I have extensive experience with React and Web3 integrations.",
            message_type: "text",
          },
          {
            conversation_id: convData.id,
            sender_id: userData[0].id,
            content: "Great! What's your timeline and approach for this project?",
            message_type: "text",
          },
        ]

        await supabase.from("messages").insert(sampleMessages)
      }

      toast({
        title: "Sample Data Added",
        description: "Sample users, jobs, and conversations have been added to the database.",
      })

      loadStats()
    } catch (error) {
      console.error("Seeding error:", error)
      toast({
        title: "Seeding Failed",
        description: "Failed to add sample data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createTestMessage = async () => {
    if (!testMessage.trim()) return

    try {
      // Get first conversation
      const { data: conversations } = await supabase.from("conversations").select("*").limit(1)

      if (!conversations || conversations.length === 0) {
        toast({
          title: "No conversations found",
          description: "Please add sample data first.",
          variant: "destructive",
        })
        return
      }

      const messageData = {
        conversation_id: conversations[0].id,
        sender_id: conversations[0].participant_1,
        content: testMessage,
        message_type: "text",
      }

      await supabase.from("messages").insert([messageData])

      toast({
        title: "Test message sent",
        description: "Check the messages page to see it.",
      })

      setTestMessage("")
      loadStats()
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Debug Panel</h1>
            <p className="text-cyan-100/80">Manage and reset database tables for development</p>
            <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">
              ⚠️ Development Only - Use with caution
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardContent className="p-6 text-center">
                <Users className="text-blue-400 w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{stats.totalUsers}</div>
                <div className="text-sm text-cyan-100/70">Total Users</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardContent className="p-6 text-center">
                <Briefcase className="text-green-400 w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{stats.totalJobs}</div>
                <div className="text-sm text-cyan-100/70">Total Jobs</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardContent className="p-6 text-center">
                <Palette className="text-purple-400 w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">{stats.totalNFTs}</div>
                <div className="text-sm text-cyan-100/70">Creator NFTs</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardContent className="p-6 text-center">
                <MessageCircle className="text-cyan-400 w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyan-400">{stats.totalMessages}</div>
                <div className="text-sm text-cyan-100/70">Messages</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Database Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => loadStats()} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  <RefreshCw size={16} className="mr-2" />
                  Refresh Stats
                </Button>

                <Button
                  onClick={seedSampleData}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Database size={16} className="mr-2" />
                  {isLoading ? "Adding..." : "Add Sample Data"}
                </Button>

                <div className="space-y-2">
                  <Input
                    placeholder="Test message content..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="bg-black/50 border-cyan-500/30 text-cyan-100"
                  />
                  <Button onClick={createTestMessage} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus size={16} className="mr-2" />
                    Send Test Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => resetDatabase("users")}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset Users Table
                </Button>

                <Button
                  onClick={() => resetDatabase("jobs")}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset Jobs Table
                </Button>

                <Button
                  onClick={() => resetDatabase("creator_nfts")}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset Creator NFTs Table
                </Button>

                <Button
                  onClick={() => resetDatabase("messages")}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset Messages Table
                </Button>

                <Button
                  onClick={() => resetDatabase("conversations")}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 size={16} className="mr-2" />
                  Reset Conversations Table
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
