# 🚀 SuiWork Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- Supabase account (already configured)

## 🔧 Quick Setup

### 1. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 2. Environment Variables
The `.env.local` file is already configured with your Supabase credentials.

### 3. Set Up Supabase Database
Run this SQL in your Supabase SQL Editor:

\`\`\`sql
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
\`\`\`

### 4. Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

### 5. Access the Application
- **Main App**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🎯 App Flow Testing

### 1. First Time User
1. Go to [http://localhost:3000](http://localhost:3000)
2. Click "Connect Wallet" (mock wallet will connect)
3. You'll be redirected to `/onboarding`
4. Choose your role (Client/Freelancer/Creator)
5. You'll be redirected to your role-specific dashboard

### 2. Client Flow
1. Dashboard → "Post New Job"
2. Fill out job details and submit
3. Go to "View Proposals" to see applications
4. Accept a proposal to start the project

### 3. Freelancer Flow
1. Dashboard → "Browse All Jobs"
2. Find a job and click "Apply"
3. Submit your proposal
4. Check messages for client communication

### 4. Creator Flow
1. Dashboard → "Mint New NFT"
2. Create your Creator Access NFT
3. Users can purchase your NFT for VIP access
4. Provide exclusive benefits to NFT holders

## 🛠️ Admin Features

Access `/admin` to:
- View database statistics
- Add sample data for testing
- Reset tables during development
- Monitor app usage

## 🔧 Troubleshooting

### Common Issues:
1. **Database Connection**: Check Supabase credentials in `.env.local`
2. **Role Selection**: Clear localStorage if stuck: `localStorage.clear()`
3. **Wallet Issues**: Refresh page to reset mock wallet
4. **Database Errors**: Use admin panel to reset tables

### Reset Everything:
\`\`\`bash
# Clear browser storage
localStorage.clear()

# Or use admin panel at /admin
\`\`\`

## 🚀 Ready to Go!

Your SuiWork platform is now ready with:
- ✅ Complete user role system
- ✅ Real Supabase database integration
- ✅ Job posting and proposal system
- ✅ Creator NFT marketplace
- ✅ Messaging system
- ✅ Reputation NFTs
- ✅ Admin debug panel

**Next Phase**: Smart contract integration on SUI blockchain! 🔗
\`\`\`
