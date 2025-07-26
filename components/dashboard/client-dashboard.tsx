"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Briefcase, Users, DollarSign, Clock, Eye, Edit, MessageCircle, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/components/providers/user-provider"
import Link from "next/link"

interface Job {
  id: string
  title: string
  description: string
  category: string
  budget: number
  duration: string
  status: string
  created_at: string
  skills: string[]
}

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  completedJobs: number
  totalSpent: number
}

export default function ClientDashboard() {
  const { user } = useUser()
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load user's jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (jobsError) {
        console.error("Error loading jobs:", jobsError)
      } else {
        setJobs(jobsData || [])
      }

      // Calculate stats
      const { data: allJobsData, error: statsError } = await supabase
        .from("jobs")
        .select("status, budget")
        .eq("client_id", user.id)

      if (statsError) {
        console.error("Error loading stats:", statsError)
      } else if (allJobsData) {
        const totalJobs = allJobsData.length
        const activeJobs = allJobsData.filter((job) => job.status === "open" || job.status === "in_progress").length
        const completedJobs = allJobsData.filter((job) => job.status === "completed").length
        const totalSpent = allJobsData
          .filter((job) => job.status === "completed")
          .reduce((sum, job) => sum + (job.budget || 0), 0)

        setStats({
          totalJobs,
          activeJobs,
          completedJobs,
          totalSpent,
        })
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-900/50 text-green-300"
      case "in_progress":
        return "bg-blue-900/50 text-blue-300"
      case "completed":
        return "bg-gray-900/50 text-gray-300"
      case "cancelled":
        return "bg-red-900/50 text-red-300"
      default:
        return "bg-gray-900/50 text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.username}!</h1>
          <p className="text-gray-400 mt-1">Manage your projects and find the best talent</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/profile">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </Link>
          <Link href="/jobs/post">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.totalJobs}</p>
              </div>
              <Briefcase className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.activeJobs}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completedJobs}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white">Recent Jobs</CardTitle>
            <Link href="/jobs">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                View All Jobs
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Jobs Posted Yet</h3>
              <p className="text-gray-400 mb-4">Start by posting your first job to find talented freelancers.</p>
              <Link href="/jobs/post">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    <Badge className={getStatusColor(job.status)}>{job.status.replace("_", " ")}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills?.length > 3 && (
                      <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="text-green-400 font-semibold">{formatCurrency(job.budget)}</span>
                      <span>{job.duration}</span>
                      <span>{formatDate(job.created_at)}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/jobs/${job.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/jobs/${job.id}/proposals`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Proposals
                        </Button>
                      </Link>
                      {job.status === "open" && (
                        <Link href={`/jobs/${job.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/jobs/post">
              <Button
                variant="outline"
                className="w-full h-20 border-gray-600 text-gray-300 hover:bg-gray-700 flex-col bg-transparent"
              >
                <Plus className="h-6 w-6 mb-2" />
                Post New Job
              </Button>
            </Link>
            <Link href="/messages">
              <Button
                variant="outline"
                className="w-full h-20 border-gray-600 text-gray-300 hover:bg-gray-700 flex-col bg-transparent"
              >
                <MessageCircle className="h-6 w-6 mb-2" />
                View Messages
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                className="w-full h-20 border-gray-600 text-gray-300 hover:bg-gray-700 flex-col bg-transparent"
              >
                <User className="h-6 w-6 mb-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
