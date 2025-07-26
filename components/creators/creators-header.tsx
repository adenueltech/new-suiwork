"use client"

import { Button } from "@/components/ui/button"
import { Palette, Star, Users } from "lucide-react"

export default function CreatorsHeader() {
  return (
    <section className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Creator <span className="text-cyan-400">Economy</span>
          </h1>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Discover talented creators and unlock exclusive content with Creator Access NFTs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
          <div className="text-center">
            <div className="bg-cyan-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Palette className="text-cyan-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Mint NFTs</h3>
            <p className="text-cyan-100/70">Create access tokens for your exclusive content</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="text-purple-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Premium Access</h3>
            <p className="text-cyan-100/70">Offer VIP services and early job opportunities</p>
          </div>

          <div className="text-center">
            <div className="bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-green-400 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Build Community</h3>
            <p className="text-cyan-100/70">Connect with your audience and grow your brand</p>
          </div>
        </div>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-semibold">
            Become a Creator
          </Button>
        </div>
      </div>
    </section>
  )
}
