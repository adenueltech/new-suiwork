"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import { useUser } from "@/components/providers/user-provider"
import Link from "next/link"

export default function EditProfilePage() {
  const { user, updateUser } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        skills: user.skills || [],
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      await updateUser({
        username: formData.username,
        bio: formData.bio,
        skills: formData.skills,
      })
      router.push("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-cyan-400 text-xl">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-400/10">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-cyan-100/80">Update your profile information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-cyan-100 mb-2">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-black/30 border-cyan-500/30 text-cyan-100 focus:border-cyan-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-cyan-100 mb-2">
                    Role
                  </label>
                  <Input
                    id="role"
                    type="text"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    className="bg-black/30 border-cyan-500/30 text-cyan-100/60"
                    disabled
                  />
                  <p className="text-xs text-cyan-100/60 mt-1">
                    Role cannot be changed. Disconnect wallet to choose a different role.
                  </p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-cyan-100 mb-2">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-black/30 border-cyan-500/30 text-cyan-100 focus:border-cyan-400 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-gray-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-black/30 border-cyan-500/30 text-cyan-100 focus:border-cyan-400"
                    placeholder="Add a skill..."
                  />
                  <Button type="button" onClick={addSkill} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 pr-1"
                    >
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0 hover:bg-red-500/20"
                        onClick={() => removeSkill(skill)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>

                {formData.skills.length === 0 && (
                  <p className="text-cyan-100/60 text-sm">
                    No skills added yet. Add some skills to showcase your expertise.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/profile">
                <Button variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
