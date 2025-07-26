"use client"

// This file now serves as a compatibility layer that re-exports the dApp Kit functionality
// with the same interface as the previous wallet provider
import { ReactNode } from "react"
import { useSuiWallet } from "@/hooks/use-sui-wallet"
import { SuiConnectButton } from "./sui-connect-button"

// Re-export the hook with the old name for backward compatibility
export function useWallet() {
  return useSuiWallet()
}

// Re-export the wallet connect button with the old name
export function WalletConnectButton({
  className = "",
  variant = "default",
  children,
}: {
  className?: string
  variant?: "default" | "outline" | "ghost"
  children?: ReactNode
}) {
  return (
    <SuiConnectButton />
  )
}

// Wallet status component
export function WalletStatus() {
  const { isConnected, address, balance, refreshBalance } = useSuiWallet()

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

// No need to export WalletProvider anymore as we're using SuiWalletProvider directly
