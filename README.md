# 🚀 SuiWork - Web3's Answer to Fiverr

> **The Future of Freelancing**: A decentralized freelance platform on the SUI blockchain enhanced with CreatorFi and SocialFi features. Zero middleman fees, instant payments, and full ownership of your on-chain identity.

![SuiWork Banner](https://via.placeholder.com/1200x400/000000/00FFFF?text=SuiWork+-+Web3+Freelance+Platform)

## 🌟 **What is SuiWork?**

SuiWork is Web3's answer to Fiverr — enhanced with **CreatorFi** and **SocialFi**. Built on the fast and low-cost **Sui blockchain**, SuiWork empowers freelancers and creators to:

- 💼 **Work** - Find and complete freelance jobs with smart contract escrow
- 🎨 **Launch & Sell NFTs** - Mint Creator Access NFTs for exclusive content
- 🎫 **Offer VIP Access** - Provide premium services via access tokens
- 💰 **Earn DeFi Yield** - Generate passive income through escrow vaults
- 🏆 **Grow Socially** - Build reputation with gamified on-chain identity
- ⚡ **Instant Payments** - Get paid immediately upon job completion
- 🆓 **Zero Fees** - No platform fees, keep 100% of your earnings
- 🔐 **Full Ownership** - Complete control of your on-chain identity and data

---

## 🎯 **Complete User Journey**

### 👥 **Three User Types**

#### 🏢 **Clients** - Post Jobs & Hire Talent
\`\`\`
Connect Wallet → Post Job → Review Proposals → Accept Proposal → 
Lock Escrow → Monitor Progress → Release Payment → Rate Freelancer
\`\`\`

#### 💻 **Freelancers** - Find Work & Build Reputation
\`\`\`
Connect Wallet → Browse Jobs → Submit Proposals → Get Accepted → 
Complete Work → Receive Payment → Earn Reputation NFT → Level Up
\`\`\`

#### 🎨 **Creators** - Monetize Content & Build Community
\`\`\`
Connect Wallet → Mint Access NFT → Set Benefits → Users Purchase NFT → 
Provide VIP Services → Build Community → Earn Recurring Revenue
\`\`\`

---

## ✨ **Current Features (MVP Ready)**

### 🔐 **Smart Contract Escrow System**
- ✅ **Secure Payments**: Funds locked on-chain until job completion
- ✅ **Automated Release**: No disputes, blockchain-guaranteed transactions
- ✅ **Multi-signature Support**: Enhanced security for large projects
- ✅ **Escrow Dashboard**: Real-time tracking of locked funds

### 🎨 **Creator Economy (CreatorFi)**
- ✅ **Access NFT Minting**: Create Bronze, Silver, Gold, Premium tiers
- ✅ **VIP Benefits System**: Offer 1-on-1 mentoring, code reviews, early access
- ✅ **Creator Dashboard**: Analytics, sales tracking, community management
- ✅ **NFT Marketplace**: Buy/sell Creator Access NFTs

### 🌐 **Web3 Native Features**
- ✅ **SUI Wallet Integration**: Connect via SUI Wallet Adapter
- ✅ **On-chain Identity**: Decentralized user profiles and reputation
- ✅ **Zero Platform Fees**: Direct peer-to-peer transactions
- ✅ **Instant Settlements**: Immediate payment upon completion

### 💬 **Real-time Communication**
- ✅ **Direct Messaging**: Chat with clients/freelancers
- ✅ **VIP Creator Chat**: Exclusive messaging for NFT holders
- ✅ **Proposal System**: Submit and manage job proposals
- ✅ **Notification System**: Real-time updates and alerts

### 🏆 **Reputation & Gamification**
- ✅ **On-chain Reputation**: Build verifiable work history
- ✅ **Reputation NFTs**: Earn collectible achievement badges
- ✅ **Skill Verification**: Blockchain-verified expertise
- ✅ **Rating System**: Transparent feedback mechanism

### 📱 **Modern UI/UX**
- ✅ **Responsive Design**: Optimized for all devices
- ✅ **Dark Web3 Theme**: Sleek black background with cyan accents
- ✅ **Smooth Animations**: Cool Web3-style transitions
- ✅ **Mobile-First**: Perfect mobile experience

### 🗄️ **Database Integration**
- ✅ **Supabase Backend**: Real-time data synchronization
- ✅ **User Management**: Profile creation and role switching
- ✅ **Job Management**: Post, browse, and apply for jobs
- ✅ **Message Storage**: Persistent chat history
- ✅ **Admin Panel**: Database management and analytics

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

### **Backend & Database**
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Authentication**: Wallet-based auth
- **File Storage**: Supabase Storage (planned)

### **Blockchain**
- **Network**: SUI Blockchain
- **Wallet**: SUI Wallet Adapter
- **Smart Contracts**: Move language (planned)
- **Node Provider**: SUI RPC endpoints

### **Development Tools**
- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git + GitHub

---

## 📁 **Project Structure**

\`\`\`
suiwork-frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── onboarding/              # User onboarding flow
│   ├── dashboard/               # Role-specific dashboards
│   ├── jobs/                    # Job marketplace
│   │   ├── page.tsx            # Browse jobs
│   │   ├── post/               # Post new job
│   │   └── [id]/               # Job details & proposals
│   ├── creators/                # Creator hub
│   ├── messages/                # Real-time messaging
│   ├── profile/                 # User profiles
│   │   ├── page.tsx            # View profile
│   │   └── edit/               # Edit profile
│   ├── escrow/                  # Escrow management
│   ├── mint-nft/                # NFT minting interface
│   ├── admin/                   # Admin panel
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── wallet/                  # Wallet integration
│   ├── providers/               # Context providers
│   ├── navbar.tsx               # Navigation bar
│   ├── hero-section.tsx         # Landing hero
│   ├── jobs/                    # Job-related components
│   ├── creators/                # Creator-related components
│   ├── profile/                 # Profile components
│   ├── messaging/               # Chat components
│   ├── escrow/                  # Escrow components
│   ├── nft/                     # NFT components
│   └── footer.tsx               # Footer
├── lib/                         # Utility functions
│   ├── supabase.ts             # Database client
│   └── utils.ts                # Helper functions
├── hooks/                       # Custom React hooks
├── database/                    # Database schemas
│   └── schema.sql              # Supabase schema
├── scripts/                     # Database scripts
└── public/                      # Static assets
\`\`\`

---

## 🚀 **Getting Started**

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Supabase account (free tier works)
- SUI Wallet (for testing)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/suiwork-frontend.git
   cd suiwork-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   # Copy environment template
   cp .env.example .env.local

   # Add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   \`\`\`

4. **Database Setup**
   1. Create a new Supabase project
   2. Run the SQL schema from `database/schema.sql`
   3. Enable Row Level Security (RLS) policies

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

6. **Access the App**
   - **Main App**: [http://localhost:3000](http://localhost:3000)
   - **Onboarding**: [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
   - **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🎨 **User Interface Guide**

### Navigation Structure
\`\`\`
/ (Landing) → /onboarding → /dashboard
├── /jobs (Browse jobs)
├── /jobs/post (Post new job)
├── /jobs/[id]/proposals (View proposals)
├── /creators (Creator marketplace)
├── /mint-nft (Mint Creator NFT)
├── /messages (Real-time chat)
├── /profile (User profile)
├── /escrow (Manage escrows)
└── /admin (Debug panel)
\`\`\`

### Role-Specific Dashboards
- **Client Dashboard**: Job management, proposal reviews, escrow status
- **Freelancer Dashboard**: Available jobs, active proposals, earnings
- **Creator Dashboard**: NFT management, sales analytics, community stats

## 🔧 **Environment Setup**

### Environment Variables (Optional)
Create a `.env.local` file for future blockchain integration:

\`\`\`env
# SUI Network Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io

# Database (for future features)
DATABASE_URL=your-database-url

# Other services
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 🧱 **Smart Contract Integration (Ready)**

The frontend is fully prepared for blockchain integration with defined interfaces:

### Contract Interfaces
\`\`\`typescript
// Escrow Contract
interface EscrowContract {
  // Lock funds for a job
  lockFunds(jobId: string, amount: number): Promise<string>
  
  // Release funds to freelancer
  releaseFunds(jobId: string): Promise<string>
  
  // Get escrow status
  getEscrowStatus(jobId: string): Promise<EscrowStatus>
  
  // Dispute resolution
  initiateDispute(jobId: string): Promise<string>
  
  // Yield generation
  enableYieldGeneration(jobId: string): Promise<string>
}
\`\`\`

\`\`\`typescript
// Creator NFT Contract
interface CreatorNFTContract {
  // Mint new access NFT
  mintNFT(metadata: NFTMetadata): Promise<string>
  
  // Transfer NFT ownership
  transferNFT(tokenId: string, to: string): Promise<string>
  
  // Get NFT details
  getNFTDetails(tokenId: string): Promise<NFTDetails>
  
  // Set NFT benefits
  setBenefits(tokenId: string, benefits: string[]): Promise<string>
  
  // Verify NFT ownership
  verifyOwnership(address: string, tokenId: string): Promise<boolean>
}
\`\`\`

\`\`\`typescript
// Reputation Contract Interface
interface ReputationContract {
  // Update user reputation
  updateReputation(address: string, score: number): Promise<string>
  
  // Mint reputation NFT
  mintReputationNFT(address: string, achievement: string): Promise<string>
  
  // Get reputation score
  getReputationScore(address: string): Promise<number>
  
  // Verify achievement
  verifyAchievement(address: string, achievement: string): Promise<boolean>
}
\`\`\`

## 📱 Pages & Features

### 🏠 Landing Page (/)
- Hero section with animated background
- Feature showcase cards
- Platform statistics
- Call-to-action buttons

### 💼 Jobs Marketplace (/jobs)
- Job listings with filters
- Category and price range filtering
- Escrow status indicators
- Job application system

### 🎨 Creator Hub (/creators)
- Creator profiles with NFT offerings
- Tier-based creator system (Bronze, Silver, Gold, Premium)
- Access NFT minting interface
- Creator benefits showcase

### 👤 Profile Page (/profile)
- User profile management
- Completed jobs history
- NFT collection display
- Creator dashboard

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (#00FFFF) - Main brand color
- **Background**: Black (#000000) - Dark theme base
- **Text**: Cyan variants (#ECFEFF, #CFFAFE) - Readable text
- **Accents**: Purple, Blue, Green - Tier indicators
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Yellow (#F59E0B) - Caution states
- **Error**: Red (#EF4444) - Error states

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-800)
- **Body**: Regular weight (400)
- **Code**: Monospace for addresses/hashes

### Components
- **Buttons**: Gradient backgrounds with glow effects
- **Cards**: Dark backgrounds with cyan borders
- **Inputs**: Dark theme with cyan focus states
- **Animations**: Smooth transitions and hover effects

## 🔗 **Smart Contract Integration (Ready)**

The frontend is fully prepared for blockchain integration with defined interfaces:

### Escrow Contract Interface
\`\`\`typescript
interface EscrowContract {
  // Lock funds for a job
  lockFunds(jobId: string, amount: number): Promise<string>
  
  // Release funds to freelancer
  releaseFunds(jobId: string): Promise<string>
  
  // Get escrow status
  getEscrowStatus(jobId: string): Promise<EscrowStatus>
  
  // Dispute resolution
  initiateDispute(jobId: string): Promise<string>
  
  // Yield generation
  enableYieldGeneration(jobId: string): Promise<string>
}
\`\`\`

### Creator NFT Contract Interface
\`\`\`typescript
interface CreatorNFTContract {
  // Mint new access NFT
  mintNFT(metadata: NFTMetadata): Promise<string>
  
  // Transfer NFT ownership
  transferNFT(tokenId: string, to: string): Promise<string>
  
  // Get NFT details
  getNFTDetails(tokenId: string): Promise<NFTDetails>
  
  // Set NFT benefits
  setBenefits(tokenId: string, benefits: string[]): Promise<string>
  
  // Verify NFT ownership
  verifyOwnership(address: string, tokenId: string): Promise<boolean>
}
\`\`\`

### Reputation Contract Interface
\`\`\`typescript
interface ReputationContract {
  // Update user reputation
  updateReputation(address: string, score: number): Promise<string>
  
  // Mint reputation NFT
  mintReputationNFT(address: string, achievement: string): Promise<string>
  
  // Get reputation score
  getReputationScore(address: string): Promise<number>
  
  // Verify achievement
  verifyAchievement(address: string, achievement: string): Promise<boolean>
}
\`\`\`

## 📊 **Database Schema**

### Core Tables
- **users**: User profiles and authentication
- **jobs**: Job postings and requirements
- **proposals**: Freelancer job applications
- **messages**: Real-time chat system
- **escrows**: Payment and fund management
- **nfts**: Creator NFT tracking
- **reputation**: User ratings and achievements

### Relationships
- Users can have multiple roles (client/freelancer/creator)
- Jobs belong to clients and receive proposals from freelancers
- Messages link users for communication
- Escrows track job payments and releases
- NFTs enable creator monetization
- Reputation builds user credibility

## 🚧 **Upcoming Features (Roadmap)**

### Phase 2: Enhanced DeFi Integration
- Yield-Generating Escrow Vaults
- Staking Rewards
- Liquidity Mining
- Token Economics

### Phase 3: Advanced Gamification
- Achievement System
- Leaderboards
- Seasonal Challenges
- Referral Program

### Phase 4: AI-Powered Features
- Smart Job Matching
- Automated Proposal Generation
- Price Optimization
- Quality Assurance

### Phase 5: Social Features (SocialFi)
- Creator Communities
- Social Trading
- Content Monetization
- Live Streaming

### Phase 6: Cross-Chain Integration
- Multi-Chain Support
- Bridge Functionality
- Universal Reputation
- Cross-Chain Payments

### Phase 7: Advanced Analytics
- Earnings Dashboard
- Market Insights
- Performance Metrics
- Tax Reporting

### Phase 8: Security & Compliance
- KYC Integration
- Dispute Resolution
- Insurance Protocol
- Audit Trail

## 📚 Documentation

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)
- **SUI Blockchain**: [docs.sui.io](https://docs.sui.io)

### Project Documentation

- **Escrow Testing Guide**: [docs/escrow-testing-guide.md](docs/escrow-testing-guide.md) - Step-by-step guide for testing the escrow smart contract functionality
- **Database Scripts**: [scripts/README.md](scripts/README.md) - Information about database schema update scripts

### Database Management

If you encounter database-related errors, you may need to update your database schema:

1. **Update Proposals Table**: If you see errors related to missing columns in the proposals table, run the SQL script at [scripts/update-proposals-schema.sql](scripts/update-proposals-schema.sql) in your Supabase SQL Editor.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- SUI Foundation for blockchain infrastructure
- shadcn for amazing UI components
- Vercel for hosting and deployment
- The Web3 community for inspiration

---

**🚀 Ready for hackathon demo! All MVP features implemented with Supabase backend integration.**

*Built with ❤️ for the Web3 community*
