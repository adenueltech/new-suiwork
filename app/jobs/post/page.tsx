"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import Navbar from "@/components/navbar"
import JobPostForm from "@/components/jobs/job-post-form"
import NavigationHeader from "@/components/ui/navigation-header"
import Footer from "@/components/footer"

export default function PostJobPage() {
  const { user, isProfileComplete, isLoading } = useUser()
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isConnected || !user) {
        router.push("/")
      } else if (!isProfileComplete) {
        router.push("/profile-setup")
      }
    }
  }, [user, isConnected, isProfileComplete, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!isConnected || !user || !isProfileComplete) {
    return null
  }

  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationHeader
            title="Post a New Job"
            subtitle="Create a job with smart contract escrow protection"
            showBackButton={true}
            backUrl="/jobs"
          />
          <JobPostForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
