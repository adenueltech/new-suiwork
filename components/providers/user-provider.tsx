"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, type User } from "@/lib/supabase"
import { useWallet } from "@/components/wallet/wallet-provider"

interface UserContextType {
  user: User | null
  userRole: "client" | "freelancer" | "creator" | null
  isLoading: boolean
  isProfileComplete: boolean
  updateUser: (userData: Partial<User>) => Promise<void>
  setUserRole: (role: "client" | "freelancer" | "creator") => void
  createUser: (role: "client" | "freelancer" | "creator") => Promise<void>
  switchUserRole: (role: "client" | "freelancer" | "creator") => Promise<void>
  logout: () => void
  clearUserData: () => void
  checkExistingUser: () => Promise<User | null>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRoleState] = useState<"client" | "freelancer" | "creator" | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { address, isConnected } = useWallet()

  useEffect(() => {
    // Load user role from localStorage on mount
    const savedRole = localStorage.getItem("userRole") as "client" | "freelancer" | "creator" | null
    if (savedRole) {
      setUserRoleState(savedRole)
    }
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      loadUser()
    } else {
      clearUserData()
      setIsLoading(false)
    }
  }, [isConnected, address])

  const clearUserData = () => {
    setUser(null)
    setUserRoleState(null)
    localStorage.removeItem("userRole")
    localStorage.removeItem("userProfile")
  }

  const logout = () => {
    clearUserData()
    // Don't disconnect wallet, just clear user data
  }

  const loadUser = async () => {
    if (!address) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("users").select("*").eq("wallet_address", address).single()

      if (error) {
        if (error.code === "PGRST116") {
          // User doesn't exist yet - this is normal for new users
          setUser(null)
          setUserRoleState(null)
        } else {
          console.error("Error loading user:", error)
          // Check if it's a table doesn't exist error
          if (error.message?.includes("does not exist")) {
            console.error("Database tables not set up. Please run the setup script.")
          }
        }
        setIsLoading(false)
        return
      }

      if (data) {
        setUser(data)
        setUserRoleState(data.role)
        localStorage.setItem("userRole", data.role)
        localStorage.setItem("userProfile", JSON.stringify(data))
      } else {
        // User doesn't exist yet
        setUser(null)
        setUserRoleState(null)
      }
    } catch (error) {
      console.error("Error in loadUser:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkExistingUser = async (): Promise<User | null> => {
    if (!address) return null

    try {
      const { data, error } = await supabase.from("users").select("*").eq("wallet_address", address).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking existing user:", error)
        return null
      }

      return data || null
    } catch (error) {
      console.error("Error checking existing user:", error)
      return null
    }
  }

  const createUser = async (role: "client" | "freelancer" | "creator") => {
    if (!address) {
      throw new Error("No wallet address available")
    }

    try {
      // First check if user already exists
      const existingUser = await checkExistingUser()
      if (existingUser) {
        // User exists, just switch role instead of creating
        await switchUserRole(role)
        return
      }

      const newUser: Partial<User> = {
        wallet_address: address,
        role: role,
        username: `${role}_${address.slice(-6)}`,
        bio: `New ${role} on SuiWork`,
        skills: [],
        rating: 0,
        jobs_completed: 0,
      }

      const { data, error } = await supabase.from("users").insert([newUser]).select().single()

      if (error) {
        console.error("Error creating user:", error)
        if (error.message?.includes("does not exist")) {
          throw new Error("Database not set up. Please contact support.")
        }
        if (error.message?.includes("duplicate key")) {
          // If we still get duplicate key error, try to switch role instead
          await switchUserRole(role)
          return
        }
        throw new Error(error.message || "Failed to create user")
      }

      if (!data) {
        throw new Error("Failed to create user - no data returned")
      }

      setUser(data)
      setUserRoleState(role)
      localStorage.setItem("userRole", role)
      localStorage.setItem("userProfile", JSON.stringify(data))
    } catch (error) {
      console.error("Error in createUser:", error)
      throw error
    }
  }

  const switchUserRole = async (role: "client" | "freelancer" | "creator") => {
    if (!address) {
      throw new Error("No wallet address available")
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .update({ role: role })
        .eq("wallet_address", address)
        .select()
        .single()

      if (error) {
        console.error("Error switching user role:", error)
        throw new Error(error.message || "Failed to switch role")
      }

      if (data) {
        setUser(data)
        setUserRoleState(role)
        localStorage.setItem("userRole", role)
        localStorage.setItem("userProfile", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error in switchUserRole:", error)
      throw error
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !address) {
      throw new Error("No user or address available")
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .update(userData)
        .eq("wallet_address", address)
        .select()
        .single()

      if (error) {
        console.error("Error updating user:", error)
        throw error
      }

      if (data) {
        setUser(data)
        localStorage.setItem("userProfile", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error in updateUser:", error)
      throw error
    }
  }

  const setUserRole = (role: "client" | "freelancer" | "creator") => {
    setUserRoleState(role)
    localStorage.setItem("userRole", role)
    if (user) {
      updateUser({ role })
    }
  }

  const isProfileComplete = (user: User | null): boolean => {
    if (!user) return false

    // Check if user has set up their profile beyond the default values
    const hasCustomUsername = user.username && user.username !== `${user.role}_${user.wallet_address.slice(-6)}`
    const hasBio = user.bio && user.bio !== `New ${user.role} on SuiWork`

    return hasCustomUsername || hasBio
  }

  return (
    <UserContext.Provider
      value={{
        user,
        userRole,
        isLoading,
        isProfileComplete: isProfileComplete(user),
        updateUser,
        setUserRole,
        createUser,
        switchUserRole,
        logout,
        clearUserData,
        checkExistingUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
