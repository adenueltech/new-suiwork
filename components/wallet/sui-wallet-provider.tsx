"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'

// Define the wallet interface for Sui wallets
declare global {
  interface Window {
    suiet?: {
      isConnected: () => Promise<boolean>
      getAccounts: () => Promise<string[]>
      signAndExecuteTransactionBlock: (params: any) => Promise<any>
      signMessage: (params: any) => Promise<any>
      connect: () => Promise<{ accounts: string[] }>
      disconnect: () => Promise<void>
    }
    suiWallet?: {
      isConnected: () => Promise<boolean>
      getAccounts: () => Promise<string[]>
      signAndExecuteTransactionBlock: (params: any) => Promise<any>
      signMessage: (params: any) => Promise<any>
      connect: () => Promise<{ accounts: string[] }>
      disconnect: () => Promise<void>
    }
    sui?: {
      isConnected?: () => Promise<boolean>
      getAccounts?: () => Promise<string[]>
      signAndExecuteTransactionBlock?: (params: any) => Promise<any>
      signMessage?: (params: any) => Promise<any>
      connect?: () => Promise<any>
      disconnect?: () => Promise<void>
    }
    ethos?: {
      isConnected?: () => Promise<boolean>
      getAccounts?: () => Promise<string[]>
      signAndExecuteTransactionBlock?: (params: any) => Promise<any>
      signMessage?: (params: any) => Promise<any>
      connect?: () => Promise<any>
      disconnect?: () => Promise<void>
    }
    martian?: {
      isConnected?: () => Promise<boolean>
      getAccounts?: () => Promise<string[]>
      signAndExecuteTransactionBlock?: (params: any) => Promise<any>
      signMessage?: (params: any) => Promise<any>
      connect?: () => Promise<any>
      disconnect?: () => Promise<void>
    }
    wallet?: {
      isConnected?: () => Promise<boolean>
      getAccounts?: () => Promise<string[]>
      signAndExecuteTransactionBlock?: (params: any) => Promise<any>
      signMessage?: (params: any) => Promise<any>
      connect?: () => Promise<any>
      disconnect?: () => Promise<void>
    }
  }
}

interface SuiWalletContextType {
  isConnected: boolean
  isConnecting: boolean
  address: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  signTransaction: (transaction: any) => Promise<string>
  signMessage: (message: string) => Promise<string>
  refreshBalance: () => Promise<void>
  provider: SuiClient | null
}

const SuiWalletContext = createContext<SuiWalletContextType | undefined>(undefined)

// Initialize Sui provider
const getProvider = () => {
  return new SuiClient({
    url: process.env.NEXT_PUBLIC_SUI_NETWORK === 'mainnet'
      ? 'https://fullnode.mainnet.sui.io:443'
      : 'https://fullnode.testnet.sui.io:443'
  });
};

export function SuiWalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [provider, setProvider] = useState<SuiClient | null>(null)

  // Initialize provider
  useEffect(() => {
    setProvider(getProvider());
  }, []);

  // Check for saved connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Debug: Log all wallet-related objects in window
      console.log("DEBUG - Available wallet objects:", {
        suiet: !!window.suiet,
        suiWallet: !!window.suiWallet,
        sui: !!(window as any).sui,
        ethos: !!(window as any).ethos,
        martian: !!(window as any).martian,
        allWindowKeys: Object.keys(window).filter(key =>
          key.toLowerCase().includes('sui') ||
          key.toLowerCase().includes('wallet')
        )
      });
      
      // Try Suiet wallet first
      if (window.suiet) {
        console.log("DEBUG - Found Suiet wallet");
        try {
          const isWalletConnected = await window.suiet.isConnected();
          console.log("DEBUG - Suiet wallet connected:", isWalletConnected);
          if (isWalletConnected) {
            const accounts = await window.suiet.getAccounts();
            console.log("DEBUG - Suiet accounts:", accounts);
            if (accounts.length > 0) {
              setIsConnected(true);
              setAddress(accounts[0]);
              fetchBalance(accounts[0]);
              return; // Exit if Suiet wallet is connected
            }
          }
        } catch (error) {
          console.error("Error checking Suiet wallet connection:", error);
        }
      }
      
      // Try official Sui wallet if Suiet is not available or not connected
      if (window.suiWallet) {
        console.log("DEBUG - Found official Sui wallet");
        try {
          const isWalletConnected = await window.suiWallet.isConnected();
          console.log("DEBUG - Sui wallet connected:", isWalletConnected);
          if (isWalletConnected) {
            const accounts = await window.suiWallet.getAccounts();
            console.log("DEBUG - Sui wallet accounts:", accounts);
            if (accounts.length > 0) {
              setIsConnected(true);
              setAddress(accounts[0]);
              fetchBalance(accounts[0]);
              return; // Exit if Sui wallet is connected
            }
          }
        } catch (error) {
          console.error("Error checking Sui wallet connection:", error);
        }
      }
      
      // Try generic sui object (some wallets use this)
      if ((window as any).sui) {
        console.log("DEBUG - Found generic sui wallet object");
        try {
          const sui = (window as any).sui;
          if (sui.isConnected && sui.getAccounts) {
            const isWalletConnected = await sui.isConnected();
            console.log("DEBUG - Generic sui wallet connected:", isWalletConnected);
            if (isWalletConnected) {
              const accounts = await sui.getAccounts();
              console.log("DEBUG - Generic sui accounts:", accounts);
              if (accounts.length > 0) {
                setIsConnected(true);
                setAddress(accounts[0]);
                fetchBalance(accounts[0]);
                return; // Exit if generic sui wallet is connected
              }
            }
          }
        } catch (error) {
          console.error("Error checking generic sui wallet:", error);
        }
      }
      
      // Try other potential wallet objects
      const potentialWalletKeys = ['wallet', 'ethos', 'martian'];
      
      for (const key of potentialWalletKeys) {
        const walletObj = (window as any)[key];
        if (walletObj && typeof walletObj === 'object') {
          console.log(`DEBUG - Found potential wallet object: ${key}`, walletObj);
          
          // Check if it has the required methods
          if (typeof walletObj.isConnected === 'function' && typeof walletObj.getAccounts === 'function') {
            try {
              console.log(`DEBUG - Checking if ${key} wallet is connected`);
              const isWalletConnected = await walletObj.isConnected();
              console.log(`DEBUG - ${key} wallet connected:`, isWalletConnected);
              
              if (isWalletConnected) {
                const accounts = await walletObj.getAccounts();
                console.log(`DEBUG - ${key} wallet accounts:`, accounts);
                
                if (accounts && accounts.length > 0) {
                  setIsConnected(true);
                  setAddress(accounts[0]);
                  fetchBalance(accounts[0]);
                  return; // Exit if wallet is connected
                }
              }
            } catch (error) {
              console.error(`Error checking ${key} wallet connection:`, error);
            }
          }
        }
      }
      
      // No wallet connected
      console.warn("DEBUG - No wallet connected");
      setIsConnected(false);
      setAddress(null);
      setBalance(0);
    };

    // Wait longer for wallet extensions to initialize (3 seconds instead of 1)
    setTimeout(() => {
      checkConnection();
    }, 3000);
  }, [provider]);

  const fetchBalance = async (walletAddress: string) => {
    if (!provider || !walletAddress) return;

    try {
      const suiBalance = await provider.getBalance({
        owner: walletAddress,
        coinType: "0x2::sui::SUI"
      });
      
      // Convert balance from MIST to SUI (1 SUI = 10^9 MIST)
      const balanceInSui = Number(suiBalance.totalBalance) / 1_000_000_000;
      setBalance(balanceInSui);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    
    // Debug: Log all wallet-related objects in window
    console.log("DEBUG - Available wallet objects on connect:", {
      suiet: !!window.suiet,
      suiWallet: !!window.suiWallet,
      sui: !!(window as any).sui,
      ethos: !!(window as any).ethos,
      martian: !!(window as any).martian,
      allWindowKeys: Object.keys(window).filter(key =>
        key.toLowerCase().includes('sui') ||
        key.toLowerCase().includes('wallet')
      )
    });

    // Try Suiet wallet first
    if (window.suiet) {
      console.log("DEBUG - Attempting to connect to Suiet wallet");
      try {
        const { accounts } = await window.suiet.connect();
        console.log("DEBUG - Suiet connect response:", accounts);
        
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          fetchBalance(accounts[0]);
          setIsConnecting(false);
          return;
        }
      } catch (error) {
        console.error("Error connecting to Suiet Wallet:", error);
      }
    }
    
    // Try official Sui wallet if Suiet is not available
    if (window.suiWallet) {
      console.log("DEBUG - Attempting to connect to official Sui wallet");
      try {
        const { accounts } = await window.suiWallet.connect();
        console.log("DEBUG - Sui wallet connect response:", accounts);
        
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
          fetchBalance(accounts[0]);
          setIsConnecting(false);
          return;
        }
      } catch (error) {
        console.error("Error connecting to Sui Wallet:", error);
      }
    }
    
    // Try generic sui object (some wallets use this)
    if ((window as any).sui) {
      console.log("DEBUG - Attempting to connect to generic sui wallet");
      try {
        const sui = (window as any).sui;
        if (sui.connect) {
          const result = await sui.connect();
          console.log("DEBUG - Generic sui connect response:", result);
          
          // Different wallets might return accounts in different formats
          const accounts = result.accounts || result;
          if (accounts && accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
            fetchBalance(accounts[0]);
            setIsConnecting(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error connecting to generic sui wallet:", error);
      }
    }
    
    // Try other potential wallet objects
    const potentialWalletKeys = ['wallet', 'suiWallet', 'suiet', 'sui', 'ethos', 'martian'];
    
    for (const key of potentialWalletKeys) {
      const walletObj = (window as any)[key];
      if (walletObj && typeof walletObj === 'object') {
        console.log(`DEBUG - Found potential wallet object: ${key}`, walletObj);
        
        // Check if it has the required methods
        if (typeof walletObj.connect === 'function') {
          try {
            console.log(`DEBUG - Attempting to connect to ${key} wallet`);
            const result = await walletObj.connect();
            console.log(`DEBUG - ${key} connect response:`, result);
            
            // Different wallets might return accounts in different formats
            let accounts;
            if (result && result.accounts) {
              accounts = result.accounts;
            } else if (Array.isArray(result)) {
              accounts = result;
            } else if (result && result.address) {
              accounts = [result.address];
            }
            
            if (accounts && accounts.length > 0) {
              setIsConnected(true);
              setAddress(accounts[0]);
              fetchBalance(accounts[0]);
              setIsConnecting(false);
              return;
            }
          } catch (error) {
            console.error(`Error connecting to ${key} wallet:`, error);
          }
        }
      }
    }
    
    // If we get here, no wallet was available
    console.error("DEBUG - No wallet found. Available window keys:", Object.keys(window));
    
    alert("No Sui wallet extension found. Please install Sui Wallet or Suiet Wallet from the Chrome Web Store and restart your browser after installation.");
    setIsConnecting(false);
  };

  const disconnect = async () => {
    
    // Try to disconnect from any available wallet
    const potentialWalletKeys = ['suiet', 'suiWallet', 'sui', 'ethos', 'martian', 'wallet'];
    
    for (const key of potentialWalletKeys) {
      const walletObj = (window as any)[key];
      if (walletObj && typeof walletObj.disconnect === 'function') {
        try {
          console.log(`DEBUG - Attempting to disconnect from ${key} wallet`);
          await walletObj.disconnect();
          setIsConnected(false);
          setAddress(null);
          setBalance(0);
          return;
        } catch (error) {
          console.error(`Error disconnecting from ${key} wallet:`, error);
        }
      }
    }
    
    // If we couldn't disconnect from any wallet, reset the state anyway
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
  };

  const signTransaction = async (transaction: any): Promise<string> => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Create a transaction block
      const tx = new Transaction();
      
      // Add transaction details from the passed transaction object
      if (transaction.type === "transfer") {
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(transaction.amount)]);
        tx.transferObjects([coin], tx.pure(transaction.recipient));
      } else if (transaction.type === "call_contract") {
        tx.moveCall({
          target: transaction.target,
          arguments: transaction.arguments.map((arg: any) =>
            typeof arg === 'string' && arg.startsWith('0x')
              ? tx.object(arg)
              : tx.pure(arg)
          ),
        });
      }
      
      // We need a real wallet for transaction signing
      
      // Try to sign with any available wallet
      const potentialWalletKeys = ['suiet', 'suiWallet', 'sui', 'ethos', 'martian', 'wallet'];
      
      for (const key of potentialWalletKeys) {
        const walletObj = (window as any)[key];
        if (walletObj && typeof walletObj.signAndExecuteTransactionBlock === 'function') {
          try {
            console.log(`DEBUG - Attempting to sign transaction with ${key} wallet`);
            const result = await walletObj.signAndExecuteTransactionBlock({
              transactionBlock: tx,
              options: {
                showEffects: true,
                showEvents: true,
              },
            });
            
            // Refresh balance after transaction
            fetchBalance(address);
            
            return result.digest;
          } catch (error) {
            console.error(`Error signing transaction with ${key} wallet:`, error);
          }
        }
      }
      
      throw new Error("No wallet available for signing transactions");
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      // We need a real wallet for message signing
      
      // Try to sign with any available wallet
      const potentialWalletKeys = ['suiet', 'suiWallet', 'sui', 'ethos', 'martian', 'wallet'];
      
      for (const key of potentialWalletKeys) {
        const walletObj = (window as any)[key];
        if (walletObj && typeof walletObj.signMessage === 'function') {
          try {
            console.log(`DEBUG - Attempting to sign message with ${key} wallet`);
            const result = await walletObj.signMessage({
              message: new TextEncoder().encode(message),
              account: address,
            });
            
            return result.signature;
          } catch (error) {
            console.error(`Error signing message with ${key} wallet:`, error);
          }
        }
      }
      
      throw new Error("No wallet available for signing messages");
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  };

  const refreshBalance = async () => {
    if (!isConnected || !address) return;
    fetchBalance(address);
  };

  const contextValue: SuiWalletContextType = {
    isConnected,
    isConnecting,
    address,
    balance,
    connect,
    disconnect,
    signTransaction,
    signMessage,
    refreshBalance,
    provider,
  };

  return <SuiWalletContext.Provider value={contextValue}>{children}</SuiWalletContext.Provider>;
}

export function useSuiWallet() {
  const context = useContext(SuiWalletContext);
  if (context === undefined) {
    throw new Error("useSuiWallet must be used within a SuiWalletProvider");
  }
  return context;
}

// Wallet connection button component
export function SuiWalletConnectButton({
  className = "",
  variant = "default",
  children,
}: {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  children?: ReactNode;
}) {
  const { isConnected, isConnecting, address, balance, connect, disconnect } = useSuiWallet();

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
    );
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
        children || "Connect Suiet Wallet"
      )}
    </button>
  );
}