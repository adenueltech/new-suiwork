"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Shield, DollarSign, Clock, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/providers/user-provider"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function JobPostForm() {
  const { toast } = useToast()
  const { user } = useUser()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    duration: "",
    skills: [] as string[],
    requirements: "",
  })
  const [currentSkill, setCurrentSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Web Development",
    "UI/UX Design",
    "Smart Contracts",
    "Content Writing",
    "Marketing",
    "Mobile Development",
    "Data Analysis",
    "Video Editing",
  ]

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()],
      })
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post a job.",
        variant: "destructive",
      })
      return
    }

    if (user.role !== "client") {
      toast({
        title: "Access denied",
        description: "Only clients can post jobs.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const jobData = {
        client_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: Number.parseFloat(formData.budget),
        duration: formData.duration,
        skills: formData.skills,
        requirements: formData.requirements,
        status: "open" as const,
        escrow_locked: false,
      }

      const { data, error } = await supabase.from("jobs").insert([jobData]).select().single()

      if (error) {
        console.error("Error creating job:", error)
        toast({
          title: "Failed to post job",
          description: "Please try again later.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Job Posted Successfully!",
        description: `Your job "${formData.title}" has been posted and is now live.`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        duration: "",
        skills: [],
        requirements: "",
      })

      // Redirect to jobs page or dashboard
      router.push("/jobs")
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-cyan-100">
                  Job Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Build a DeFi Dashboard"
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-cyan-100">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-100">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-cyan-500/30">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-cyan-100 focus:bg-cyan-500/20">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-cyan-100">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project requirements, goals, and expectations..."
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements" className="text-cyan-100">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Specific requirements, experience level, deliverables..."
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">Skills Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React, TypeScript)"
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} className="bg-cyan-600 hover:bg-cyan-700">
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300 pr-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
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
              <CardTitle className="text-cyan-400">Budget & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="budget" className="text-cyan-100">
                  Budget (SUI) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-cyan-400" size={18} />
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="100"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50 pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration" className="text-cyan-100">
                  Duration *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-cyan-400" size={18} />
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 weeks"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50 pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Shield className="mr-2" size={20} />
                Escrow Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-cyan-100/80">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Funds locked in smart contract</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Released only on completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>No platform fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Dispute resolution via DAO</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.category || !formData.budget}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
          >
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </Button>
        </div>
      </div>
    </form>
  )
}
