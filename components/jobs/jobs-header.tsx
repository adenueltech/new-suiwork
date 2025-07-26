"use client"

import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function JobsHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="bg-gray-900/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Next <span className="text-cyan-400">Web3 Job</span>
          </h1>
          <p className="text-cyan-100/80 text-lg">Secure, escrow-backed freelance opportunities on SUI blockchain</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-cyan-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, skills, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-100/50 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          <Link href="/jobs/post">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6">
              <Plus size={20} className="mr-2" />
              Post Job
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
