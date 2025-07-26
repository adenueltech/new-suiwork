import Link from "next/link"
import { Github, Twitter, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-cyan-500/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-cyan-400 mb-4 animate-glow">SuiWork</div>
            <p className="text-cyan-100/80 mb-4 max-w-md">
              The first decentralized freelance platform on SUI blockchain. Secure escrow, Creator NFTs, and zero
              middleman fees.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  Creator Hub
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-cyan-100/80 hover:text-cyan-400 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyan-500/20 mt-8 pt-8 text-center">
          <p className="text-cyan-100/60">© 2025 SuiWork. Built on SUI Blockchain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
