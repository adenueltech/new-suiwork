import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User type definition
export interface User {
  id: string
  wallet_address: string
  role: "client" | "freelancer" | "creator"
  username: string
  bio?: string
  skills?: string[]
  rating?: number
  jobs_completed?: number
  created_at: string
  updated_at: string
}

// Job type definition
export interface Job {
  id: string
  title: string
  description: string
  budget: number
  client_id: string
  freelancer_id?: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  skills_required: string[]
  created_at: string
  updated_at: string
  client?: User
  freelancer?: User
}

// Message type definition
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender?: User
  receiver?: User
}

// Proposal type definition
export interface Proposal {
  id: string
  job_id: string
  freelancer_id: string
  proposal_text: string
  proposed_budget: number
  status: "pending" | "accepted" | "rejected"
  created_at: string
  freelancer?: User
  job?: Job
}
