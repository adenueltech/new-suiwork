"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"
import { useWallet, WalletConnectButton } from "@/components/wallet/wallet-provider"
import { useUser } from "@/components/providers/user-provider"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const { isConnected } = useWallet()
  const { user } = useUser()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isConnected && user) {
      router.push("/dashboard")
    } else if (isConnected) {
      router.push("/onboarding")
    }
    // If not connected, the WalletConnectButton will handle connection
  }

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">The Future of</span>
            <br />
            <span className="text-cyan-400 animate-glow">Web3 Freelancing</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Decentralized freelance platform on SUI blockchain with smart contract escrow, Creator NFTs, and zero
            middleman fees.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isConnected ? (
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            ) : (
              <WalletConnectButton className="text-lg px-8 py-4">
                Connect Wallet to Start
                <ArrowRight className="ml-2" size={20} />
              </WalletConnectButton>
            )}

            <Link href="/mint-nft">
              <Button
                variant="outline"
                size="lg"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
              >
                Mint Creator NFT
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 transition-all duration-300 hover:border-cyan-400/40 hover:scale-105 animate-float">
              <Shield className="text-cyan-400 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Smart Escrow</h3>
              <p className="text-cyan-100/80">Payments locked on-chain until job completion. No disputes, no delays.</p>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 transition-all duration-300 hover:border-cyan-400/40 hover:scale-105 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <Zap className="text-cyan-400 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Creator NFTs</h3>
              <p className="text-cyan-100/80">Mint access NFTs for VIP services and premium content monetization.</p>
            </div>

            <div
              className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 transition-all duration-300 hover:border-cyan-400/40 hover:scale-105 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <Users className="text-cyan-400 w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Web3 Native</h3>
              <p className="text-cyan-100/80">Built on SUI blockchain for fast, cheap, and secure transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
