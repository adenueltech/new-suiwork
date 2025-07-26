import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// Import the dApp Kit CSS
import '@mysten/dapp-kit/dist/index.css'
import { SuiDAppProvider } from "@/components/providers/sui-dapp-provider"
import { SuiWalletProvider } from "@/components/wallet/sui-wallet-provider"
import { UserProvider } from "@/components/providers/user-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SuiWork - Decentralized Freelance Platform",
  description: "The future of freelancing on SUI blockchain with smart contract escrow and NFT reputation system",
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SuiDAppProvider>
            <SuiWalletProvider>
              <UserProvider>{children}</UserProvider>
            </SuiWalletProvider>
          </SuiDAppProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
