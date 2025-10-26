"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Building2, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">CB</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Charity Block</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
              About
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Connect, Collaborate, Create Impact
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Join our platform to connect with NGOs, volunteers, and donors. Make a difference together.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/">
            <div
              className="group relative bg-card border border-border rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50"
              onMouseEnter={() => setHoveredCard("donor")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Heart className="w-7 h-7 text-primary" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-3">Donor</h2>
                <p className="text-muted-foreground mb-6">
                  Volunteer or donate to causes you care about by connecting with NGOs.
                </p>

                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>Continue as Donor</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* NGO Login Card */}
          <Link href="/login/ngo">
            <div
              className="group relative bg-card border border-border rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50"
              onMouseEnter={() => setHoveredCard("ngo")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-3">NGO Organization</h2>
                <p className="text-muted-foreground mb-6">
                  Manage your organization, recruit volunteers, and connect with donors. Grow your impact.
                </p>

                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>Login as NGO</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <p className="text-muted-foreground">Active Donors</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">NGO Partners</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
            <p className="text-muted-foreground">Funds Raised</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Charity Block. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
