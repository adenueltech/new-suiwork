"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import Navbar from "@/components/navbar"
import ClientDashboard from "@/components/dashboard/client-dashboard"
import FreelancerDashboard from "@/components/dashboard/freelancer-dashboard"
import CreatorDashboard from "@/components/dashboard/creator-dashboard"
import Footer from "@/components/footer"

export default function DashboardPage() {
  const { user, userRole, isLoading, isProfileComplete } = useUser()
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isConnected) {
        router.push("/")
      } else if (!user || !userRole) {
        router.push("/onboarding")
      } else if (!isProfileComplete) {
        router.push("/profile-setup")
      }
    }
  }, [user, userRole, isConnected, isLoading, isProfileComplete, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <div className="text-cyan-400 text-xl">Loading Dashboard...</div>
        </div>
      </div>
    )
  }

  if (!isConnected || !user || !userRole) {
    return null // Will redirect
  }

  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        {userRole === "client" && <ClientDashboard />}
        {userRole === "freelancer" && <FreelancerDashboard />}
        {userRole === "creator" && <CreatorDashboard />}
      </div>
      <Footer />
    </main>
  )
}
