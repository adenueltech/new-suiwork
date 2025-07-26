import Navbar from "@/components/navbar"
import JobsHeader from "@/components/jobs/jobs-header"
import JobsFilters from "@/components/jobs/jobs-filters"
import JobsList from "@/components/jobs/jobs-list"
import Footer from "@/components/footer"

export default function JobsPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20 min-h-screen">
        <JobsHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <JobsFilters />
            </div>
            <div className="lg:col-span-3">
              <JobsList />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
