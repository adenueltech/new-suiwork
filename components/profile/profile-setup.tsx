"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Plus, X } from "lucide-react"
import { useUser } from "@/components/providers/user-provider"
import { useToast } from "@/hooks/use-toast"
import NavigationHeader from "@/components/ui/navigation-header"

export default function ProfileSetup() {
  const { user, updateUser } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
  })
  const [currentSkill, setCurrentSkill] = useState("")

  const addSkill = () => {
    if (currentSkill.trim() && !profileData.skills.includes(currentSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, currentSkill.trim()],
      })
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profileData.username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await updateUser({
        username: profileData.username,
        bio: profileData.bio,
        skills: profileData.skills,
      })

      toast({
        title: "Profile Updated!",
        description: "Your profile has been set up successfully.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleDescription = () => {
    switch (user?.role) {
      case "client":
        return "As a client, you can post jobs, hire freelancers, and manage projects with smart contract escrow."
      case "freelancer":
        return "As a freelancer, you can browse jobs, submit proposals, and build your reputation on-chain."
      case "creator":
        return "As a creator, you can mint NFTs, offer VIP services, and monetize your expertise."
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <NavigationHeader
          title="Complete Your Profile"
          subtitle="Let's set up your profile to get started on SuiWork"
          showBackButton={true}
          backUrl="/onboarding"
        />

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-cyan-400" />
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{user?.role?.toUpperCase()} ACCOUNT</Badge>
        </div>

        <Card className="bg-gray-900/50 border-cyan-500/20 mb-6">
          <CardContent className="p-6">
            <p className="text-cyan-100/80 text-center">{getRoleDescription()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-cyan-100">
                  Username *
                </Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  placeholder="Enter your username"
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-cyan-100">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                />
              </div>

              <div>
                <Label className="text-cyan-100">Skills</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus size={16} />
                  </Button>
                </div>

                {profileData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profileData.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300 pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !profileData.username.trim()}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
              >
                {isLoading ? "Setting up..." : "Complete Profile Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
