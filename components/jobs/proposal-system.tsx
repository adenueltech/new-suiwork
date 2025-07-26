"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, DollarSign, User, MessageCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/components/providers/user-provider"

interface Proposal {
  id: string
  job_id: string
  freelancer_id: string
  freelancer_name: string
  freelancer_avatar?: string
  freelancer_rating?: number
  proposed_budget: number
  proposed_timeline: string
  cover_letter: string
  skills?: string[]
  created_at: string
  status: "pending" | "accepted" | "rejected"
  is_read: boolean
}

interface ProposalSystemProps {
  jobId: string
  jobTitle: string
  isJobOwner?: boolean
}

export default function ProposalSystem({ jobId, jobTitle, isJobOwner = false }: ProposalSystemProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [formData, setFormData] = useState({
    budget: "",
    timeline: "",
    coverLetter: "",
  })

  // Fetch proposals from database
  useEffect(() => {
    const fetchProposals = async () => {
      if (!jobId) return
      
      try {
        setIsLoading(true)
        
        let query = supabase
          .from("proposals")
          .select("*")
          .eq("job_id", jobId)
        
        // If user is not the job owner, only show their own proposals
        if (!isJobOwner && user) {
          query = query.eq("freelancer_id", user.id)
        }
        
        const { data, error } = await query.order("created_at", { ascending: false })
        
        if (error) throw error
        
        // Mark proposals as read if user is job owner
        if (isJobOwner && data && data.some(p => !p.is_read)) {
          const unreadIds = data.filter(p => !p.is_read).map(p => p.id)
          
          if (unreadIds.length > 0) {
            await supabase
              .from("proposals")
              .update({ is_read: true })
              .in("id", unreadIds)
          }
        }
        
        setProposals(data || [])
      } catch (error) {
        console.error("Error fetching proposals:", error)
        toast({
          title: "Error",
          description: "Failed to load proposals",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProposals()
  }, [jobId, isJobOwner, user, toast])

  const submitProposal = async () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to submit a proposal",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    try {
      // Get form values from the state
      const { budget, timeline, coverLetter } = formData
      
      // Get job details to get client_id
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("client_id")
        .eq("id", jobId)
        .single()
        
      if (jobError || !jobData) {
        throw new Error("Could not find job details")
      }
      
      // Check if the proposals table has the required columns
      const { data: columnInfo, error: columnError } = await supabase
        .from('proposals')
        .select('*')
        .limit(1)
        .maybeSingle()
      
      // Create a proposal object with required fields
      const proposalDataToInsert: any = {
        job_id: jobId,
        freelancer_id: user.id,
        status: "pending"
      }
      
      // Add budget field (could be budget or proposed_budget)
      if (columnInfo && 'proposed_budget' in columnInfo) {
        proposalDataToInsert.proposed_budget = parseFloat(budget)
      } else {
        proposalDataToInsert.budget = parseFloat(budget)
      }
      
      // Add timeline field (could be timeline or proposed_timeline)
      if (columnInfo && 'proposed_timeline' in columnInfo) {
        proposalDataToInsert.proposed_timeline = timeline
      } else {
        proposalDataToInsert.timeline = timeline
      }
      
      // Add cover letter field
      if (columnInfo && 'cover_letter' in columnInfo) {
        proposalDataToInsert.cover_letter = coverLetter
      } else {
        // Fallback to description if cover_letter doesn't exist
        proposalDataToInsert.description = coverLetter
      }
      
      // Add freelancer_name if the column exists
      if (columnInfo && 'freelancer_name' in columnInfo) {
        proposalDataToInsert.freelancer_name = user.username
      }
      
      // Add client_id if the column exists
      if (columnInfo && 'client_id' in columnInfo) {
        proposalDataToInsert.client_id = jobData.client_id
      }
      
      // Add is_read if the column exists
      if (columnInfo && 'is_read' in columnInfo) {
        proposalDataToInsert.is_read = false
      }
      
      // Save proposal to database
      const { error } = await supabase
        .from("proposals")
        .insert([proposalDataToInsert])
      
      if (error) throw error

      toast({
        title: "Proposal Submitted!",
        description: "Your proposal has been sent to the client.",
      })

      setFormData({
        budget: "",
        timeline: "",
        coverLetter: "",
      })
    } catch (error) {
      console.error("Error submitting proposal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const acceptProposal = async (proposalId: string) => {
    try {
      // Update proposal status in database
      const { error } = await supabase
        .from("proposals")
        .update({ status: "accepted" })
        .eq("id", proposalId)
      
      if (error) throw error
      
      // Update local state
      setProposals(proposals.map(p =>
        p.id === proposalId ? { ...p, status: "accepted" } : p
      ))
      
      toast({
        title: "Proposal Accepted!",
        description: "The freelancer has been notified and escrow will be created.",
      })
    } catch (error) {
      console.error("Error accepting proposal:", error)
      toast({
        title: "Error",
        description: "Failed to accept proposal.",
        variant: "destructive",
      })
    }
  }

  if (isJobOwner) {
    // Job owner view - see proposals
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Proposals for "{jobTitle}"</h2>
          <p className="text-cyan-100/80">{proposals.length} proposals received</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <div className="text-cyan-400 text-xl">Loading proposals...</div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-8 bg-gray-900/50 border border-gray-700 rounded-lg">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Proposals Yet</h3>
            <p className="text-gray-400">You haven't received any proposals for this job yet.</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className={`bg-gray-900/50 ${!proposal.is_read ? 'border-yellow-500/50' : 'border-cyan-500/20'}`}
            >
              {!proposal.is_read && (
                <div className="bg-yellow-500/20 text-yellow-300 px-3 py-1 text-sm font-medium flex items-center">
                  <AlertCircle size={14} className="mr-2" />
                  New Proposal
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={proposal.freelancer_avatar || "/placeholder.svg"} />
                      <AvatarFallback>{proposal.freelancer_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-100">{proposal.freelancer_name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-cyan-100/70">
                        {proposal.freelancer_rating && (
                          <div className="flex items-center space-x-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span>{proposal.freelancer_rating}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{new Date(proposal.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400 flex items-center">
                      <DollarSign size={20} />
                      {proposal.proposed_budget} SUI
                    </div>
                    <div className="text-sm text-cyan-100/70">{proposal.proposed_timeline}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-cyan-100 font-medium mb-2">Cover Letter</h4>
                  <p className="text-cyan-100/80 leading-relaxed">{proposal.cover_letter}</p>
                </div>

                {proposal.skills && proposal.skills.length > 0 && (
                  <div>
                    <h4 className="text-cyan-100 font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {proposal.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  {proposal.status === "pending" ? (
                    <Button
                      onClick={() => acceptProposal(proposal.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept Proposal
                    </Button>
                  ) : proposal.status === "accepted" ? (
                    <Badge className="bg-green-500/20 text-green-300 py-2 px-3">
                      Proposal Accepted
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-300 py-2 px-3">
                      Proposal Rejected
                    </Badge>
                  )}
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                    <MessageCircle size={16} className="mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                    <User size={16} className="mr-2" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    )
  }

  // Freelancer view - submit proposal
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Submit Proposal</h2>
        <p className="text-cyan-100/80">Send your proposal for "{jobTitle}"</p>
      </div>

      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Your Proposal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget" className="text-cyan-100">
                Your Budget (SUI) *
              </Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
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
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              placeholder="Explain why you're the best fit for this project..."
              className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50 min-h-[120px]"
            />
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">Proposal Guidelines</h4>
            <ul className="text-sm text-cyan-100/80 space-y-1">
              <li>• Be specific about your approach and methodology</li>
              <li>• Highlight relevant experience and portfolio items</li>
              <li>• Provide realistic timeline and budget estimates</li>
              <li>• Ask clarifying questions if needed</li>
            </ul>
          </div>

          <Button
            onClick={submitProposal}
            disabled={isSubmitting || !formData.budget || !formData.timeline || !formData.coverLetter}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
          >
            {isSubmitting ? "Submitting Proposal..." : "Submit Proposal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
