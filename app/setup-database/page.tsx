"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import NavigationHeader from "@/components/ui/navigation-header"

export default function SetupDatabasePage() {
  const { toast } = useToast()
  const [isSetup, setIsSetup] = useState(false)

  const sqlScript = `-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS reputation_nfts CASCADE;
DROP TABLE IF EXISTS creator_nfts CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'freelancer', 'creator')),
  username TEXT NOT NULL,
  bio TEXT,
  skills TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  duration TEXT NOT NULL,
  skills TEXT[],
  requirements TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  escrow_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposals table
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  budget DECIMAL(10,2) NOT NULL,
  timeline TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'escrow', 'nft')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator NFTs table
CREATE TABLE creator_nfts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  supply INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'premium')),
  benefits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reputation NFTs table
CREATE TABLE reputation_nfts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  nft_name TEXT NOT NULL,
  description TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  metadata JSONB,
  minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(participant_1, participant_2, job_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_proposals_job_id ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_creator_nfts_creator_id ON creator_nfts(creator_id);
CREATE INDEX idx_reputation_nfts_user_id ON reputation_nfts(user_id);

-- Insert some sample data for testing
INSERT INTO users (wallet_address, role, username, bio, skills, rating, jobs_completed) VALUES
('0x1234567890abcdef', 'client', 'TechCorp', 'Leading technology company looking for talented developers', ARRAY['Project Management', 'Tech Leadership'], 4.8, 15),
('0xabcdef1234567890', 'freelancer', 'DevExpert', 'Full-stack developer with 5+ years experience in Web3', ARRAY['React', 'Node.js', 'TypeScript', 'Solidity'], 4.9, 23),
('0x9876543210fedcba', 'creator', 'DesignGuru', 'UI/UX designer specializing in Web3 interfaces and user experience', ARRAY['Figma', 'UI/UX', 'Web3 Design', 'Prototyping'], 4.7, 18);

-- Insert sample jobs
INSERT INTO jobs (client_id, title, description, category, budget, duration, skills, status, escrow_locked) VALUES
((SELECT id FROM users WHERE wallet_address = '0x1234567890abcdef'), 'Build DeFi Dashboard', 'Create a modern DeFi dashboard with real-time data visualization and wallet integration', 'Web Development', 500, '2 weeks', ARRAY['React', 'TypeScript', 'DeFi'], 'open', false),
((SELECT id FROM users WHERE wallet_address = '0x1234567890abcdef'), 'Smart Contract Audit', 'Security audit for NFT marketplace contracts on SUI blockchain', 'Smart Contracts', 800, '1 week', ARRAY['Solidity', 'Security', 'Audit'], 'open', false);

-- Insert sample creator NFTs
INSERT INTO creator_nfts (creator_id, name, description, price, supply, sold, tier, benefits) VALUES
((SELECT id FROM users WHERE wallet_address = '0x9876543210fedcba'), 'Premium Design Access', 'Get exclusive access to design resources and 1-on-1 consultations', 50, 100, 25, 'gold', ARRAY['1-on-1 consultations', 'Design templates', 'Priority support', 'Early access to new resources']);`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    toast({
      title: "SQL Copied!",
      description: "The SQL script has been copied to your clipboard.",
    })
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <NavigationHeader
          title="Database Setup"
          subtitle="Set up your Supabase database tables"
          showBackButton={true}
          backUrl="/"
        />

        <div className="grid gap-6">
          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Database className="mr-2" size={24} />
                Database Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold">Go to Supabase SQL Editor</h3>
                  <p className="text-cyan-100/80">
                    Open your Supabase project and navigate to the SQL Editor in the dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold">Copy the SQL Script</h3>
                  <p className="text-cyan-100/80">Copy the SQL script below and paste it into the SQL Editor.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold">Run the Script</h3>
                  <p className="text-cyan-100/80">
                    Click "Run" to execute the script and create all necessary tables with sample data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-white font-semibold">Start Using SuiWork</h3>
                  <p className="text-cyan-100/80">
                    Once the script runs successfully, you can start using the platform!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-cyan-400">SQL Setup Script</CardTitle>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 bg-transparent"
              >
                <Copy size={16} className="mr-2" />
                Copy Script
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-cyan-100/80 text-sm whitespace-pre-wrap">{sqlScript}</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400" size={24} />
                <div>
                  <h3 className="text-green-400 font-semibold">Ready to Go!</h3>
                  <p className="text-green-100/80">
                    After running the script, your database will be set up with sample users, jobs, and NFTs for
                    testing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Open Supabase Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
