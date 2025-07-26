"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, User, Briefcase, RefreshCw, AlertCircle } from "lucide-react"
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
  skills: string[]
  requirements?: string
  status: string
  created_at: string
  client: {
    username: string
    rating: number
  }
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { user } = useUser()

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if supabase is properly configured
      if (!supabase) {
        throw new Error("Database connection not configured")
      }

      const { data, error: fetchError } = await supabase
        .from("jobs")
        .select(`
          *,
          client:users!jobs_client_id_fkey(username, rating)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Supabase error:", fetchError)
        if (fetchError.message?.includes("does not exist")) {
          throw new Error("Database tables not set up. Please contact support.")
        }
        if (fetchError.message?.includes("permission denied")) {
          throw new Error("Access denied. Please check your authentication.")
        }
        throw new Error(fetchError.message || "Failed to load jobs")
      }

      if (!data) {
        setJobs([])
        return
      }

      setJobs(data)
    } catch (error: any) {
      console.error("Error loading jobs:", error)
      setError(error.message || "Failed to load jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    loadJobs()
  }

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-700 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="flex space-x-2 mt-4">
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-500/50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Jobs</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <div className="space-y-2">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again {retryCount > 0 && `(${retryCount})`}
            </Button>
            <p className="text-sm text-gray-400">
              If the problem persists, please check your internet connection or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Jobs Available</h3>
          <p className="text-gray-400 mb-4">There are currently no open jobs matching your criteria.</p>
          <Button
            onClick={handleRetry}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Jobs
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Available Jobs ({jobs.length})</h2>
        <Button
          onClick={handleRetry}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="bg-gray-900/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl text-white mb-2">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>{job.client?.username || "Unknown Client"}</span>
                      {job.client?.rating > 0 && (
                        <span className="text-yellow-400">★ {job.client.rating.toFixed(1)}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300">
                  {job.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills?.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                    {skill}
                  </Badge>
                ))}
                {job.skills?.length > 5 && (
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    +{job.skills.length - 5} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <DollarSign size={16} />
                    <span className="text-green-400 font-semibold">{formatBudget(job.budget)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{job.duration}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/jobs/${job.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      View Details
                    </Button>
                  </Link>
                  {user?.role === "freelancer" && (
                    <Link href={`/jobs/${job.id}/apply`}>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        Apply Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {job.requirements && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">Requirements:</h4>
                  <p className="text-sm text-gray-400">{job.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
