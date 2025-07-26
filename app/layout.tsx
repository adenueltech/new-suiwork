import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/components/wallet/wallet-provider"
import { UserProvider } from "@/components/providers/user-provider"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SuiWork - Decentralized Freelance Platform",
  description: "The future of freelancing on SUI blockchain with smart contract escrow and NFT reputation system",
    generator: 'v0.dev'
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
          <WalletProvider>
            <UserProvider>{children}</UserProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
