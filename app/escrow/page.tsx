import Navbar from "@/components/navbar"
import EscrowManager from "@/components/escrow/escrow-manager"
import Footer from "@/components/footer"

export default function EscrowPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EscrowManager />
        </div>
      </div>
      <Footer />
    </main>
  )
}
