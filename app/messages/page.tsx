import Navbar from "@/components/navbar"
import MessagingInterface from "@/components/messaging/messaging-interface"
import Footer from "@/components/footer"

export default function MessagesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MessagingInterface />
        </div>
      </div>
      <Footer />
    </main>
  )
}
