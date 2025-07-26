"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import { useWallet } from "@/components/wallet/wallet-provider"

export default function MessageNotifications() {
  const { isConnected } = useWallet()
  const [unreadCount, setUnreadCount] = useState(3) // Mock unread count

  useEffect(() => {
    // Mock real-time updates
    const interval = setInterval(() => {
      // Simulate receiving new messages
      if (Math.random() > 0.8) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isConnected || unreadCount === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105">
        <div className="relative">
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
