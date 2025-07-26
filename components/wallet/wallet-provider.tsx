"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  signTransaction: (transaction: any) => Promise<string>
  signMessage: (message: string) => Promise<string>
  refreshBalance: () => Promise<void>
  getCoins: (amount?: number) => Promise<string[]>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  // Check for saved connection on mount
  useEffect(() => {
    const savedConnection = localStorage.getItem("wallet_connected")
    const savedAddress = localStorage.getItem("wallet_address")
    const savedBalance = localStorage.getItem("wallet_balance")

    if (savedConnection === "true" && savedAddress) {
      setIsConnected(true)
      setAddress(savedAddress)
      setBalance(savedBalance ? Number.parseFloat(savedBalance) : 100.5)
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock address
    const mockAddress = "0x" + Math.random().toString(16).substr(2, 40)
    const mockBalance = 100.5 + Math.random() * 50

    setIsConnected(true)
    setAddress(mockAddress)
    setBalance(mockBalance)
    setIsConnecting(false)

    // Save to localStorage
    localStorage.setItem("wallet_connected", "true")
    localStorage.setItem("wallet_address", mockAddress)
    localStorage.setItem("wallet_balance", mockBalance.toString())

    console.log("Mock wallet connected:", mockAddress)
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(0)

    // Clear localStorage
    localStorage.removeItem("wallet_connected")
    localStorage.removeItem("wallet_address")
    localStorage.removeItem("wallet_balance")

    console.log("Mock wallet disconnected")
  }

  const signTransaction = async (transaction: any): Promise<string> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    // Simulate transaction signing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64)
    console.log("Mock transaction signed:", mockTxHash)

    // Simulate balance change
    const newBalance = balance - 0.1 // Small fee
    setBalance(newBalance)
    localStorage.setItem("wallet_balance", newBalance.toString())

    return mockTxHash
  }

  const signMessage = async (message: string): Promise<string> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    // Simulate message signing
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockSignature = "0x" + Math.random().toString(16).substr(2, 128)
    console.log("Mock message signed:", message, "->", mockSignature)

    return mockSignature
  }

  const refreshBalance = async () => {
    if (!isConnected) return

    // Simulate balance refresh
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newBalance = 100 + Math.random() * 100
    setBalance(newBalance)
    localStorage.setItem("wallet_balance", newBalance.toString())
  }

  const getCoins = async (amount?: number): Promise<string[]> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    // Simulate getting coin objects
    const mockCoins = Array.from({ length: 5 }, () => "0x" + Math.random().toString(16).substr(2, 40))

    return mockCoins
  }

  const contextValue: WalletContextType = {
    isConnected,
    isConnecting,
    address,
    balance,
    connect,
    disconnect,
    signTransaction,
    signMessage,
    refreshBalance,
    getCoins,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Wallet connection component
export function WalletConnectButton({
  className = "",
  variant = "default",
  children,
}: {
  className?: string
  variant?: "default" | "outline" | "ghost"
  children?: ReactNode
}) {
  const { isConnected, isConnecting, address, balance, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-sm">
          <div className="font-medium text-white">{`${address.slice(0, 6)}...${address.slice(-4)}`}</div>
          <div className="text-gray-300">{balance.toFixed(4)} SUI</div>
        </div>
        <button
          onClick={disconnect}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
        variant === "outline"
          ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
          : variant === "ghost"
            ? "text-gray-700 hover:bg-gray-100"
            : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25"
      } ${isConnecting ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {isConnecting ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Connecting...
        </div>
      ) : (
        children || "Connect Wallet"
      )}
    </button>
  )
}

// Wallet status component
export function WalletStatus() {
  const { isConnected, address, balance, refreshBalance } = useWallet()

  if (!isConnected) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">Please connect your wallet to continue</p>
      </div>
    )
  }

  return (
    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-800 font-medium">Wallet Connected</p>
          <p className="text-green-600 text-sm">{address && `${address.slice(0, 8)}...${address.slice(-6)}`}</p>
        </div>
        <div className="text-right">
          <p className="text-green-800 font-medium">{balance.toFixed(4)} SUI</p>
          <button onClick={refreshBalance} className="text-green-600 text-sm hover:text-green-800 transition-colors">
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

// Utility functions for components
export const formatSuiAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  }).format(amount)
}

export const suiToMist = (sui: number): number => {
  return sui * 1_000_000_000
}

export const mistToSui = (mist: number): number => {
  return mist / 1_000_000_000
}
