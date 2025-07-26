"use client"

import { useSuiClient } from '@mysten/dapp-kit'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useEffect, useState } from 'react'

export function useSuiWallet() {
  const client = useSuiClient()
  const currentAccount = useCurrentAccount()
  const [balance, setBalance] = useState<number>(0)

  const address = currentAccount?.address || null
  const isConnected = !!currentAccount

  // Fetch balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !client) return

      try {
        const suiBalance = await client.getBalance({
          owner: address,
          coinType: "0x2::sui::SUI"
        })
        
        // Convert balance from MIST to SUI (1 SUI = 10^9 MIST)
        const balanceInSui = Number(suiBalance.totalBalance) / 1_000_000_000
        setBalance(balanceInSui)
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }

    if (isConnected) {
      fetchBalance()
    }
  }, [address, client, isConnected])

  // Refresh balance
  const refreshBalance = async () => {
    if (!isConnected || !address || !client) return
    
    try {
      const suiBalance = await client.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI"
      })
      
      // Convert balance from MIST to SUI (1 SUI = 10^9 MIST)
      const balanceInSui = Number(suiBalance.totalBalance) / 1_000_000_000
      setBalance(balanceInSui)
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }

  return {
    isConnected,
    address,
    balance,
    refreshBalance,
    provider: client,
  }
}