"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3, Star, Award, Briefcase, Calendar } from "lucide-react"
import { useUser } from "@/components/providers/user-provider"
import Link from "next/link"

export default function ProfileHeader() {
  const { user } = useUser()

  if (!user) {
    return (
      <section className="bg-gradient-to-r from-gray-900/50 to-black/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-cyan-400 text-xl">Loading profile...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-gray-900/50 to-black/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Image */}
          <div className="relative">
            <img
              src="/placeholder.svg?height=150&width=150"
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cyan-400/50"
            />
            <Link href="/profile/edit">
              <Button size="icon" className="absolute bottom-2 right-2 bg-cyan-600 hover:bg-cyan-700 rounded-full">
                <Edit3 size={16} />
              </Button>
            </Link>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                <p className="text-xl text-cyan-400 mb-2 capitalize">{user.role.replace("_", " ")}</p>
                <p className="text-cyan-100/80 max-w-2xl leading-relaxed">
                  {user.bio || `${user.role} on SuiWork platform`}
                </p>
              </div>
              <Link href="/profile/edit">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white mt-4 md:mt-0">Edit Profile</Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{user.rating.toFixed(1)}</div>
                <div className="text-sm text-cyan-100/70 flex items-center justify-center">
                  <Star size={14} className="mr-1 text-yellow-400 fill-current" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{user.jobs_completed}</div>
                <div className="text-sm text-cyan-100/70 flex items-center justify-center">
                  <Briefcase size={14} className="mr-1" />
                  Jobs Done
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">0</div>
                <div className="text-sm text-cyan-100/70 flex items-center justify-center">
                  <Award size={14} className="mr-1" />
                  NFTs Earned
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {new Date(user.created_at).getFullYear() === new Date().getFullYear()
                    ? "< 1"
                    : Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))}
                </div>
                <div className="text-sm text-cyan-100/70 flex items-center justify-center">
                  <Calendar size={14} className="mr-1" />
                  Years Active
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-cyan-500/30 text-cyan-300">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="flex items-center space-x-2">
                    <p className="text-cyan-100/60">No skills added yet</p>
                    <Link href="/profile/edit">
                      <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400 bg-transparent">
                        Add Skills
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
