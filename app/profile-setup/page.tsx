"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import ProfileSetup from "@/components/profile/profile-setup"

export default function ProfileSetupPage() {
  const { user, isLoading } = useUser()
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isConnected) {
        router.push("/")
      } else if (!user) {
        router.push("/onboarding")
      } else if (user.username && user.username !== `${user.role}_${user.wallet_address.slice(-6)}`) {
        // Profile already set up, redirect to dashboard
        router.push("/dashboard")
      }
    }
  }, [user, isConnected, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!isConnected || !user) {
    return null
  }

  return <ProfileSetup />
}
