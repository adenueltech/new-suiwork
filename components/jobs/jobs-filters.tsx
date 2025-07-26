"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function JobsFilters() {
  const [priceRange, setPriceRange] = useState([0, 1000])

  const categories = [
    "Web Development",
    "UI/UX Design",
    "Smart Contracts",
    "Content Writing",
    "Marketing",
    "Mobile Development",
    "Data Analysis",
    "Video Editing",
  ]

  const jobTypes = ["Fixed Price", "Hourly", "Long-term", "Short-term"]

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} className="border-cyan-500/50" />
              <label
                htmlFor={category}
                className="text-sm text-cyan-100/80 cursor-pointer hover:text-cyan-400 transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Price Range (SUI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
            <div className="flex justify-between text-sm text-cyan-100/80">
              <span>{priceRange[0]} SUI</span>
              <span>{priceRange[1]} SUI</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400">Job Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox id={type} className="border-cyan-500/50" />
              <label
                htmlFor={type}
                className="text-sm text-cyan-100/80 cursor-pointer hover:text-cyan-400 transition-colors"
              >
                {type}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
