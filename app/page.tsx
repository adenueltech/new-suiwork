"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet/wallet-provider"
import { useUser } from "@/components/providers/user-provider"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"

export default function HomePage() {
  const { isConnected } = useWallet()
  const { userRole, isProfileComplete } = useUser()
  const router = useRouter()

  useEffect(() => {
    // If user is connected and has completed profile, redirect to dashboard
    if (isConnected && userRole && isProfileComplete) {
      router.push("/dashboard")
    }
    // If user is connected but profile not complete, redirect to profile setup
    else if (isConnected && userRole && !isProfileComplete) {
      router.push("/profile-setup")
    }
    // If user is connected but no role, redirect to onboarding
    else if (isConnected && !userRole) {
      router.push("/onboarding")
    }
  }, [isConnected, userRole, isProfileComplete, router])

  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
