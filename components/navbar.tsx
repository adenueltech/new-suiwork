"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/components/providers/user-provider"
import { useWallet } from "@/components/wallet/wallet-provider"
import { Menu, X, User, LogOut, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useUser()
  const { isConnected, disconnect, address, balance } = useWallet()
  const { toast } = useToast()
  const router = useRouter()

  const handleSwitchRole = () => {
    router.push("/onboarding")
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
    setIsOpen(false)
  }

  const handleDisconnectWallet = () => {
    logout()
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
    setIsOpen(false)
  }

  const handleViewProfile = () => {
    router.push("/profile")
    setIsOpen(false)
  }

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-cyan-400">
              SuiWork
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Jobs
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Messages
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                    <span className="text-xs bg-cyan-600 px-2 py-1 rounded capitalize">{user.role}</span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-gray-400 text-sm">
                        {address?.slice(0, 8)}...{address?.slice(-6)}
                      </p>
                      <p className="text-cyan-400 text-sm">{balance.toFixed(4)} SUI</p>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={handleViewProfile}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </button>

                      <button
                        onClick={handleSwitchRole}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white flex items-center space-x-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Switch Role</span>
                      </button>

                      <div className="border-t border-gray-700 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout (Keep Wallet)</span>
                      </button>

                      <button
                        onClick={handleDisconnectWallet}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800 hover:text-red-300 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Disconnect Wallet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : isConnected ? (
              <Link href="/onboarding">
                <Button className="bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
              </Link>
            ) : (
              <Button className="bg-cyan-600 hover:bg-cyan-700">Connect Wallet</Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-700">
              {isConnected && user ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-gray-400 text-sm">
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                    <p className="text-cyan-400 text-sm">{balance.toFixed(4)} SUI</p>
                  </div>

                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Jobs
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                      Messages
                    </Button>
                  </Link>

                  <div className="border-t border-gray-700 pt-2">
                    <Button
                      onClick={handleViewProfile}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>

                    <Button
                      onClick={handleSwitchRole}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Switch Role
                    </Button>

                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout (Keep Wallet)
                    </Button>

                    <Button
                      onClick={handleDisconnectWallet}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect Wallet
                    </Button>
                  </div>
                </>
              ) : isConnected ? (
                <Link href="/onboarding">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
                </Link>
              ) : (
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Connect Wallet</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
