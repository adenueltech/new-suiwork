"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, DollarSign, User, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Proposal {
  id: string
  freelancerId: string
  freelancerName: string
  freelancerAvatar: string
  freelancerRating: number
  proposedBudget: number
  proposedTimeline: string
  coverLetter: string
  skills: string[]
  submittedAt: string
  status: "pending" | "accepted" | "rejected"
}

interface ProposalSystemProps {
  jobId: string
  jobTitle: string
  isJobOwner?: boolean
}

export default function ProposalSystem({ jobId, jobTitle, isJobOwner = false }: ProposalSystemProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proposalData, setProposalData] = useState({
    budget: "",
    timeline: "",
    coverLetter: "",
  })

  // Mock proposals data
  const proposals: Proposal[] = [
    {
      id: "1",
      freelancerId: "0x1234...5678",
      freelancerName: "Alex Chen",
      freelancerAvatar: "/placeholder.svg?height=40&width=40",
      freelancerRating: 4.9,
      proposedBudget: 240,
      proposedTimeline: "2 weeks",
      coverLetter:
        "I have 5+ years of experience building DeFi dashboards. I can deliver a modern, responsive interface with real-time data integration.",
      skills: ["React", "TypeScript", "Web3", "DeFi"],
      submittedAt: "2024-01-20 10:30",
      status: "pending",
    },
    {
      id: "2",
      freelancerId: "0xabcd...efgh",
      freelancerName: "Sarah Kim",
      freelancerAvatar: "/placeholder.svg?height=40&width=40",
      freelancerRating: 4.8,
      proposedBudget: 280,
      proposedTimeline: "3 weeks",
      coverLetter:
        "I specialize in creating beautiful and intuitive Web3 interfaces. My portfolio includes several successful DeFi projects.",
      skills: ["React", "UI/UX", "Web3", "Figma"],
      submittedAt: "2024-01-20 11:15",
      status: "pending",
    },
  ]

  const submitProposal = async () => {
    setIsSubmitting(true)
    try {
      // Mock proposal submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Proposal Submitted!",
        description: "Your proposal has been sent to the client.",
      })

      setProposalData({
        budget: "",
        timeline: "",
        coverLetter: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const acceptProposal = async (proposalId: string) => {
    try {
      toast({
        title: "Proposal Accepted!",
        description: "The freelancer has been notified and escrow will be created.",
      })
    } catch (error) {
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

        {proposals.map((proposal) => (
          <Card key={proposal.id} className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={proposal.freelancerAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{proposal.freelancerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-100">{proposal.freelancerName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-cyan-100/70">
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span>{proposal.freelancerRating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{proposal.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400 flex items-center">
                    <DollarSign size={20} />
                    {proposal.proposedBudget} SUI
                  </div>
                  <div className="text-sm text-cyan-100/70">{proposal.proposedTimeline}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-cyan-100 font-medium mb-2">Cover Letter</h4>
                <p className="text-cyan-100/80 leading-relaxed">{proposal.coverLetter}</p>
              </div>

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

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => acceptProposal(proposal.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Accept Proposal
                </Button>
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
        ))}
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
                value={proposalData.budget}
                onChange={(e) => setProposalData({ ...proposalData, budget: e.target.value })}
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
                value={proposalData.timeline}
                onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
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
              value={proposalData.coverLetter}
              onChange={(e) => setProposalData({ ...proposalData, coverLetter: e.target.value })}
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
            disabled={isSubmitting || !proposalData.budget || !proposalData.timeline || !proposalData.coverLetter}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
          >
            {isSubmitting ? "Submitting Proposal..." : "Submit Proposal"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
