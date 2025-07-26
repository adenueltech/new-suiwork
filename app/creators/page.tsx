import Navbar from "@/components/navbar"
import CreatorsHeader from "@/components/creators/creators-header"
import CreatorsList from "@/components/creators/creators-list"
import Footer from "@/components/footer"

export default function CreatorsPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <CreatorsHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CreatorsList />
        </div>
      </div>
      <Footer />
    </main>
  )
}
