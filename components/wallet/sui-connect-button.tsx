"use client"

import { ConnectButton } from '@mysten/dapp-kit'
import { Button } from '@/components/ui/button'

export function SuiConnectButton() {
  return (
    <ConnectButton>
      {({ connected, connecting, connect, disconnect, account }) => {
        if (connected && account) {
          return (
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <div className="font-medium text-white">{`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}</div>
              </div>
              <Button
                onClick={disconnect}
                variant="destructive"
                size="sm"
                className="px-3 py-1 text-sm"
              >
                Disconnect
              </Button>
            </div>
          )
        }

        return (
          <Button
            onClick={connect}
            disabled={connecting}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25"
          >
            {connecting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        )
      }}
    </ConnectButton>
  )
}