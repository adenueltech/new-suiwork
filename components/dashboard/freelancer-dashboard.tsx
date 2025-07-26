"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Star, DollarSign, Briefcase, Trophy, Eye } from "lucide-react"
import Link from "next/link"
import { supabase, type Job } from "@/lib/supabase"
import { useUser } from "@/components/providers/user-provider"

export default function FreelancerDashboard() {
  const { user } = useUser()
  const [availableJobs, setAvailableJobs] = useState<Job[]>([])
  const [stats, setStats] = useState({
    activeProposals: 0,
    totalEarnings: 0,
    completedJobs: 0,
    rating: 0,
  })

  useEffect(() => {
    if (user) {
      loadAvailableJobs()
      loadFreelancerStats()
    }
  }, [user])

  const loadAvailableJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error loading jobs:", error)
        return
      }

      setAvailableJobs(data || [])
    } catch (error) {
      console.error("Error in loadAvailableJobs:", error)
    }
  }

  const loadFreelancerStats = async () => {
    if (!user) return

    try {
      // Mock stats for now - replace with real Supabase queries
      setStats({
        activeProposals: 5,
        totalEarnings: 2340,
        completedJobs: user.jobs_completed || 0,
        rating: user.rating || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
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
          <h1 className="text-3xl font-bold text-white mb-2">Freelancer Dashboard</h1>
          <p className="text-cyan-100/80">Welcome back, {user.username}!</p>
        </div>
        <Link href="/jobs">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Search size={20} className="mr-2" />
            Browse All Jobs
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <Briefcase className="text-blue-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{stats.activeProposals}</div>
            <div className="text-sm text-cyan-100/70">Active Proposals</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <DollarSign className="text-green-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{stats.totalEarnings}</div>
            <div className="text-sm text-cyan-100/70">Total Earnings (SUI)</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <Trophy className="text-cyan-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-cyan-400">{stats.completedJobs}</div>
            <div className="text-sm text-cyan-100/70">Completed Jobs</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardContent className="p-6 text-center">
            <Star className="text-yellow-400 w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-400">{stats.rating.toFixed(1)}</div>
            <div className="text-sm text-cyan-100/70">Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Jobs */}
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Recommended Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {availableJobs.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-16 h-16 text-cyan-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No jobs available</h3>
              <p className="text-cyan-100/70 mb-4">Check back later for new opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-cyan-100 font-semibold mb-1">{job.title}</h3>
                    <p className="text-cyan-100/70 text-sm mb-2 line-clamp-2">{job.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-cyan-100/70">
                      <span className="text-cyan-400 font-semibold">{job.budget} SUI</span>
                      <span>{job.duration}</span>
                      <span>{job.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills?.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                      Apply
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
