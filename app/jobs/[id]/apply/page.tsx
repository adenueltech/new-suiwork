"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

interface Job {
  id: string
  title: string
  client_id: string
}

export default function JobApplyPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params?.id as string
  const { toast } = useToast()
  const { user } = useUser()
  const { address, isConnected } = useWallet()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applicationData, setApplicationData] = useState({
    budget: "",
    timeline: "",
    coverLetter: "",
  })

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("jobs")
          .select("id, title, client_id")
          .eq("id", jobId)
          .single()

        if (error) throw error
        if (!data) throw new Error("Job not found")

        setJob(data)
      } catch (error: any) {
        console.error("Error loading job:", error)
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, toast])

  const submitApplication = async () => {
    if (!job) return
    
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit an application",
        variant: "destructive",
      })
      return
    }
    
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please make sure you're logged in as a freelancer to submit an application",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { budget, timeline, coverLetter } = applicationData
      
      // Check if the proposals table has the required columns
      const { data: columnInfo, error: columnError } = await supabase
        .from('proposals')
        .select('*')
        .limit(1)
        .maybeSingle()
      
      // Create a proposal object with required fields
      const proposalData: any = {
        job_id: jobId,
        freelancer_id: user.id,
        status: "pending"
      }
      
      // Add budget field (could be budget or proposed_budget)
      if (columnInfo && 'proposed_budget' in columnInfo) {
        proposalData.proposed_budget = parseFloat(budget)
      } else {
        proposalData.budget = parseFloat(budget)
      }
      
      // Add timeline field (could be timeline or proposed_timeline)
      if (columnInfo && 'proposed_timeline' in columnInfo) {
        proposalData.proposed_timeline = timeline
      } else {
        proposalData.timeline = timeline
      }
      
      // Add cover letter field
      if (columnInfo && 'cover_letter' in columnInfo) {
        proposalData.cover_letter = coverLetter
      } else {
        // Fallback to description if cover_letter doesn't exist
        proposalData.description = coverLetter
      }
      
      // Add freelancer_name if the column exists
      if (columnInfo && 'freelancer_name' in columnInfo) {
        proposalData.freelancer_name = user.username
      }
      
      // Add client_id if the column exists
      if (columnInfo && 'client_id' in columnInfo) {
        proposalData.client_id = job.client_id
      }
      
      // Add is_read if the column exists
      if (columnInfo && 'is_read' in columnInfo) {
        proposalData.is_read = false
      }
      
      // Save application to proposals table
      const { data, error } = await supabase
        .from("proposals")
        .insert([proposalData])
        .select()
      
      if (error) throw error
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the client.",
      })

      // Reset form
      setApplicationData({
        budget: "",
        timeline: "",
        coverLetter: "",
      })
      
      // Redirect back to job details
      router.push(`/jobs/${jobId}`)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={`/jobs/${jobId}`}>
            <Button
              variant="outline"
              size="sm"
              className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job
            </Button>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Apply for Job</h2>
            {job && <p className="text-cyan-100/80">Send your application for "{job.title}"</p>}
          </div>
          
          {!isConnected && (
            <Card className="bg-yellow-900/20 border-yellow-500/50 mb-6">
              <CardContent className="p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-yellow-300">Please connect your wallet to submit an application.</p>
              </CardContent>
            </Card>
          )}
          
          {isConnected && !user && (
            <Card className="bg-yellow-900/20 border-yellow-500/50 mb-6">
              <CardContent className="p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-yellow-300">Please make sure you're logged in as a freelancer to submit an application.</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Your Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="text-cyan-100">
                    Your Budget (SUI) *
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={applicationData.budget}
                    onChange={(e) => setApplicationData({ ...applicationData, budget: e.target.value })}
                    placeholder="250"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  />
                </div>

                <div>
                  <Label htmlFor="timeline" className="text-cyan-100">
                    Timeline *
                  </Label>
                  <Input
                    id="timeline"
                    value={applicationData.timeline}
                    onChange={(e) => setApplicationData({ ...applicationData, timeline: e.target.value })}
                    placeholder="2 weeks"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="coverLetter" className="text-cyan-100">
                  Cover Letter *
                </Label>
                <Textarea
                  id="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  placeholder="Explain why you're the best fit for this project..."
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50 min-h-[150px]"
                />
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-semibold mb-2">Application Guidelines</h4>
                <ul className="text-sm text-cyan-100/80 space-y-1">
                  <li>• Be specific about your approach and methodology</li>
                  <li>• Highlight relevant experience and portfolio items</li>
                  <li>• Provide realistic timeline and budget estimates</li>
                  <li>• Ask clarifying questions if needed</li>
                </ul>
              </div>

              <Button
                onClick={submitApplication}
                disabled={isSubmitting || !applicationData.budget || !applicationData.timeline || !applicationData.coverLetter || !isConnected || !user}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}