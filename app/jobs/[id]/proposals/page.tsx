import Navbar from "@/components/navbar"
import ProposalSystem from "@/components/jobs/proposal-system"
import Footer from "@/components/footer"

export default function JobProposalsPage({ params }: { params: { id: string } }) {
  // Mock job data - in real app, fetch from API/blockchain
  const jobTitle = "Build DeFi Dashboard Interface"

  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProposalSystem jobId={params.id} jobTitle={jobTitle} isJobOwner={true} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
