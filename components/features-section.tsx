"use client"

import { Code, DollarSign, Key, Trophy, MessageSquare, Globe } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Code,
      title: "Smart Contracts",
      description: "Automated escrow system built on SUI blockchain for secure transactions",
      color: "text-cyan-400",
    },
    {
      icon: DollarSign,
      title: "Zero Fees",
      description: "No platform fees, only blockchain transaction costs",
      color: "text-green-400",
    },
    {
      icon: Key,
      title: "Access NFTs",
      description: "Creators can mint NFTs for exclusive content and VIP services",
      color: "text-purple-400",
    },
    {
      icon: Trophy,
      title: "Reputation System",
      description: "Build your on-chain reputation with completion NFTs",
      color: "text-yellow-400",
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Built-in messaging system for seamless collaboration",
      color: "text-blue-400",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Serve clients worldwide with borderless payments",
      color: "text-pink-400",
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful <span className="text-cyan-400">Features</span>
          </h2>
          <p className="text-cyan-100/80 text-lg max-w-2xl mx-auto">
            Everything you need to succeed in the decentralized economy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 transition-all duration-300 hover:border-cyan-400/40 hover:scale-105 animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-cyan-100/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
