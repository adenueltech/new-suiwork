-- Drop existing tables if they exist (for clean setup)
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
((SELECT id FROM users WHERE wallet_address = '0x9876543210fedcba'), 'Premium Design Access', 'Get exclusive access to design resources and 1-on-1 consultations', 50, 100, 25, 'gold', ARRAY['1-on-1 consultations', 'Design templates', 'Priority support', 'Early access to new resources']);
