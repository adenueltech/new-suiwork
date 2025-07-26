"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NavigationHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  onBack?: () => void
}

export default function NavigationHeader({
  title,
  subtitle,
  showBackButton = false,
  backUrl,
  onBack,
}: NavigationHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-cyan-100/80 text-lg mt-2">{subtitle}</p>}
        </div>
      </div>

      {/* Logo that goes to home */}
      <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="text-2xl font-bold text-cyan-400 animate-glow">SuiWork</div>
      </Link>
    </div>
  )
}
