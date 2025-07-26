"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Briefcase, Palette, Check } from "lucide-react"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import { useToast } from "@/hooks/use-toast"

const roles = [
  {
    id: "client" as const,
    title: "Client",
    description: "Post jobs and hire talented freelancers",
    icon: User,
    features: [
      "Post unlimited jobs",
      "Access to verified freelancers",
      "Secure escrow payments",
      "Project management tools",
    ],
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500/50",
  },
  {
    id: "freelancer" as const,
    title: "Freelancer",
    description: "Find work and build your reputation",
    icon: Briefcase,
    features: ["Browse available jobs", "Submit proposals", "Build your portfolio", "Earn reputation NFTs"],
    color: "text-green-400",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-500/50",
  },
  {
    id: "creator" as const,
    title: "Creator",
    description: "Monetize your content and build community",
    icon: Palette,
    features: ["Mint access NFTs", "Create exclusive content", "Build subscriber base", "Multiple revenue streams"],
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-500/50",
  },
]

export default function SwitchRolePage() {
  const { user, updateUser, userRole } = useUser()
  const { isConnected } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | "creator" | null>(null)

  useEffect(() => {
    // If not connected or no user, redirect to home
    if (!isConnected || !user) {
      router.push("/")
      return
    }
  }, [isConnected, user, router])

  const handleRoleSwitch = async (newRole: "client" | "freelancer" | "creator") => {
    if (!user) {
      toast({
        title: "Error",
        description: "No user found. Please reconnect your wallet.",
        variant: "destructive",
      })
      return
    }

    if (newRole === userRole) {
      toast({
        title: "Same Role",
        description: "You're already using this role.",
        variant: "default",
      })
      return
    }

    setIsUpdating(true)
    setSelectedRole(newRole)

    try {
      await updateUser({ role: newRole })

      toast({
        title: "Role Updated!",
        description: `Successfully switched to ${newRole} role.`,
      })

      // Redirect to dashboard after successful role switch
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error switching role:", error)
      toast({
        title: "Role Switch Failed",
        description: error.message || "Failed to switch role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setSelectedRole(null)
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (!isConnected || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-xl">Redirecting...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button onClick={handleBack} variant="ghost" className="text-cyan-400 hover:text-cyan-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Switch Your Role</h1>
            <p className="text-xl text-gray-400 mb-2">
              Currently using: <Badge className="bg-cyan-900/50 text-cyan-300 ml-2">{userRole}</Badge>
            </p>
            <p className="text-gray-400">Choose a new role to switch your account type</p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isCurrentRole = role.id === userRole
            const isSelected = selectedRole === role.id
            const isLoading = isUpdating && isSelected

            return (
              <Card
                key={role.id}
                className={`relative transition-all duration-300 cursor-pointer ${
                  isCurrentRole
                    ? `${role.bgColor} ${role.borderColor} border-2`
                    : "bg-gray-900/50 border-gray-700 hover:border-cyan-500/50"
                } ${isLoading ? "opacity-50" : ""}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${role.bgColor}`}>
                      <Icon className={`h-8 w-8 ${role.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                    {role.title}
                    {isCurrentRole && <Check className="h-5 w-5 text-green-400" />}
                  </CardTitle>
                  <p className="text-gray-400">{role.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleRoleSwitch(role.id)}
                    disabled={isCurrentRole || isUpdating}
                    className={`w-full ${
                      isCurrentRole
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : isLoading
                          ? "bg-gray-600 text-gray-400"
                          : "bg-cyan-600 hover:bg-cyan-700 text-white"
                    }`}
                  >
                    {isCurrentRole ? "Current Role" : isLoading ? "Switching..." : `Switch to ${role.title}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Important Notes:</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Switching roles will change your dashboard and available features</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Your profile data and wallet connection will remain the same</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>You can switch roles anytime from your profile settings</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Previous activity in other roles will be preserved</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
