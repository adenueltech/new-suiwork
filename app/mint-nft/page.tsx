import Navbar from "@/components/navbar"
import NFTMinter from "@/components/nft/nft-minter"
import Footer from "@/components/footer"

export default function MintNFTPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NFTMinter />
        </div>
      </div>
      <Footer />
    </main>
  )
}
