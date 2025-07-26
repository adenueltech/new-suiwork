"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import RoleSelection from "@/components/onboarding/role-selection"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  const { createUser, switchUserRole, user, isLoading, checkExistingUser } = useUser()
  const { isConnected, address } = useWallet()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [existingUser, setExistingUser] = useState<any>(null)
  const [checkingUser, setCheckingUser] = useState(true)

  useEffect(() => {
    // If user already exists and profile is complete, redirect to dashboard
    if (user) {
      router.push("/dashboard")
      return
    }

    // If not connected, redirect to home
    if (!isConnected && !isLoading) {
      router.push("/")
      return
    }

    // If connected, check if user exists in database
    if (isConnected && address && !isLoading) {
      checkForExistingUser()
    }
  }, [user, isConnected, isLoading, router, address])

  const checkForExistingUser = async () => {
    if (!address) return

    setCheckingUser(true)
    try {
      const existingUserData = await checkExistingUser()

      if (existingUserData) {
        // User exists in database
        setExistingUser(existingUserData)
        setShowRoleSelection(false)
      } else {
        // New user
        setExistingUser(null)
        setShowRoleSelection(true)
      }
    } catch (error) {
      console.error("Error checking existing user:", error)
      // Assume new user if error
      setExistingUser(null)
      setShowRoleSelection(true)
    } finally {
      setCheckingUser(false)
    }
  }

  const handleRoleSelect = async (role: "client" | "freelancer" | "creator") => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.")
      return
    }

    setIsCreating(true)
    try {
      if (existingUser) {
        // User exists, switch role
        await switchUserRole(role)
        alert(`Your role has been switched to ${role}.`)
      } else {
        // New user, create account
        await createUser(role)
        alert(`Your ${role} account has been created successfully.`)
      }
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Role selection error:", error)
      alert(error.message || "Failed to process your request. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleContinueWithExistingRole = () => {
    if (existingUser) {
      router.push("/dashboard")
    }
  }

  // Loading state
  if (isLoading || !isConnected || checkingUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <div className="text-cyan-400 text-xl">
            {!isConnected ? "Please connect your wallet..." : checkingUser ? "Checking account..." : "Loading..."}
          </div>
        </div>
      </div>
    )
  }

  // User already exists, will redirect
  if (user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-xl">Redirecting to dashboard...</div>
        </div>
      </div>
    )
  }

  // Show existing user options
  if (existingUser && !showRoleSelection) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-cyan-400">Welcome Back!</CardTitle>
            <CardDescription className="text-gray-300">We found an existing account for your wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <p className="text-white font-medium">Current Role</p>
              <p className="text-cyan-400 text-lg capitalize">{existingUser.role}</p>
              <p className="text-gray-400 text-sm mt-1">@{existingUser.username}</p>
            </div>

            <div className="space-y-2">
              <Button onClick={handleContinueWithExistingRole} className="w-full bg-cyan-600 hover:bg-cyan-700">
                Continue as {existingUser.role}
              </Button>

              <Button
                onClick={() => setShowRoleSelection(true)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Switch Role
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show role selection for new users or role switching
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-black">
        {existingUser && (
          <div className="bg-gray-900 border-b border-gray-700 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-cyan-400 font-medium">Switching Role</p>
                <p className="text-gray-400 text-sm">Current: {existingUser.role}</p>
              </div>
              <Button
                onClick={() => setShowRoleSelection(false)}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <RoleSelection
          onRoleSelect={handleRoleSelect}
          isCreating={isCreating}
          isExistingUser={!!existingUser}
          currentRole={existingUser?.role}
        />
      </div>
    )
  }

  // Default loading state
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <div className="text-cyan-400 text-xl">Preparing onboarding...</div>
      </div>
    </div>
  )
}
