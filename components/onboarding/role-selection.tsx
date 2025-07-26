"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, Palette, CheckCircle, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface RoleSelectionProps {
  onRoleSelect: (role: "client" | "freelancer" | "creator") => void
  isCreating: boolean
  isExistingUser?: boolean
  currentRole?: string
}

export default function RoleSelection({
  onRoleSelect,
  isCreating,
  isExistingUser = false,
  currentRole,
}: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | "creator" | null>(null)
  const router = useRouter()

  const roles = [
    {
      id: "client" as const,
      title: "Client",
      description: "Post jobs and hire talented freelancers",
      icon: User,
      features: ["Post job listings", "Review proposals", "Manage projects", "Secure payments"],
      color: "blue",
    },
    {
      id: "freelancer" as const,
      title: "Freelancer",
      description: "Find work and build your reputation",
      icon: Briefcase,
      features: ["Browse jobs", "Submit proposals", "Build portfolio", "Earn reputation NFTs"],
      color: "green",
    },
    {
      id: "creator" as const,
      title: "Creator",
      description: "Monetize your content and build community",
      icon: Palette,
      features: ["Create access NFTs", "Exclusive content", "Community building", "Direct monetization"],
      color: "purple",
    },
  ]

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col p-4">
      {/* Logo and Back Button Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center">
          <img src="/placeholder-logo.svg" alt="SuiWork Logo" className="h-10 w-auto" />
        </div>
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {isExistingUser ? "Choose Your New Role" : "Choose Your Role"}
            </h1>
            <p className="text-gray-400 text-lg">
              {isExistingUser
                ? "Select a new role to switch your account type"
                : "Select how you want to participate in the SuiWork ecosystem"}
            </p>
          </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            const isCurrent = currentRole === role.id

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-cyan-600 border-cyan-500 transform scale-105"
                    : isCurrent
                      ? "bg-gray-700 border-yellow-500"
                      : "bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center">
                  <Icon
                    className={`mx-auto h-12 w-12 mb-4 ${
                      isSelected ? "text-white" : isCurrent ? "text-yellow-400" : "text-cyan-400"
                    }`}
                  />
                  <CardTitle className={`text-xl ${isSelected ? "text-white" : "text-white"}`}>
                    {role.title}
                    {isCurrent && (
                      <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">CURRENT</span>
                    )}
                  </CardTitle>
                  <CardDescription className={isSelected ? "text-cyan-100" : "text-gray-400"}>
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-center text-sm ${isSelected ? "text-cyan-100" : "text-gray-300"}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => selectedRole && onRoleSelect(selectedRole)}
            disabled={!selectedRole || isCreating}
            className="bg-cyan-600 hover:bg-cyan-700 min-w-[120px]"
          >
            {isCreating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up...
              </div>
            ) : isExistingUser ? (
              "Switch Role"
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </div>
      
    </div>
    </div>
  )
}
