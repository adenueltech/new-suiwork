"use client"

import { useEffect, useState } from "react"

export default function StatsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    { label: "Active Jobs", value: "1,234", prefix: "" },
    { label: "Total Escrow", value: "567", prefix: "SUI" },
    { label: "Creator NFTs", value: "89", prefix: "" },
    { label: "Users", value: "2,456", prefix: "" },
  ]

  if (!mounted) return null

  return (
    <section className="py-20 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Platform <span className="text-cyan-400">Statistics</span>
          </h2>
          <p className="text-cyan-100/80 text-lg">Real-time metrics from our growing ecosystem</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 transition-all duration-300 hover:border-cyan-400/40 hover:scale-105"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                {stat.prefix && <span className="text-lg mr-1">{stat.prefix}</span>}
                {stat.value}
              </div>
              <div className="text-cyan-100/80 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
