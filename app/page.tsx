import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import PricingSection from "@/components/PricingSection";
import { getTopProfessors } from "@/lib/topProfessors";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topProfessors = await getTopProfessors();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Learn Smarter with AI-Powered Tutoring
            </h1>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Connect with expert professors, schedule 1-on-1 sessions, and learn with interactive whiteboards.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 md:flex-row">
              <Link
                href="/explore"
                className="rounded-lg bg-white px-8 py-4 font-semibold text-primary hover:bg-gray-100"
              >
                Start Learning Today
              </Link>
              <a
                href="#features"
                className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white hover:text-primary"
              >
                How It Works
              </a>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="mb-2 text-xl font-semibold">AI Professor Matching</h3>
                <p className="opacity-90">
                  Our AI finds the perfect professor based on your learning needs and preferences.
                </p>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-3xl mb-4">🧑‍🏫</div>
                <h3 className="mb-2 text-xl font-semibold">Interactive Whiteboard</h3>
                <p className="opacity-90">
                  Real-time collaboration with an interactive whiteboard and meeting tools.
                </p>
              </div>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-3xl mb-4">💳</div>
                <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
                <p className="opacity-90">
                  Pay per session with secure checkout and a transparent platform fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
              Why Choose LearnAI?
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "AI-Powered Matching", icon: "🧠", color: "bg-primary", desc: "Our system matches you with the perfect professor for your goals and schedule." },
                { title: "1-on-1 Sessions", icon: "🎥", color: "bg-secondary", desc: "Personalized sessions designed around you — not a generic course." },
                { title: "Simple Payments", icon: "💸", color: "bg-accent", desc: "Pay per session. Professors keep 90%. Platform fee is only 10%." },
                { title: "Performance Dashboard", icon: "📈", color: "bg-primary", desc: "Track progress, bookings, and outcomes once you decide to login." },
                { title: "Multi-language Support", icon: "🌍", color: "bg-secondary", desc: "Teach and learn in your preferred language." },
                { title: "Teacher Registration", icon: "🧑‍💼", color: "bg-accent", desc: "Professors can register by topic and start earning quickly." },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${f.color} text-white`}>
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Professors */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
              Top Rated Professors
            </h2>

            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {topProfessors.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-xl bg-white shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="h-48 w-full object-cover" loading="lazy" />
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{p.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span>★</span>
                        <span className="text-gray-700">{p.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="mb-4 text-gray-600">{p.subject}</p>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">€{p.price}/session</span>
                      <Link
                        href={`/bookings/new?professorId=${p.id}`}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-secondary transition-colors"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/explore"
                className="rounded-lg bg-primary px-8 py-4 font-semibold text-white hover:bg-secondary transition-colors inline-flex"
              >
                View All Professors
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
              How LearnAI Works
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                { n: "1", title: "Explore Freely", desc: "Browse professors without creating an account.", color: "bg-primary" },
                { n: "2", title: "AI Matching", desc: "Our AI suggests the best professors for your objectives.", color: "bg-secondary" },
                { n: "3", title: "Schedule & Pay", desc: "Book sessions and pay securely when you're ready.", color: "bg-accent" },
                { n: "4", title: "Learn & Grow", desc: "Track progress on your dashboard after login (optional).", color: "bg-primary" },
              ].map((s) => (
                <div key={s.title} className="text-center">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${s.color} text-white`}>
                    <span className="text-xl font-bold">{s.n}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* Footer */}
        <footer id="about" className="bg-dark py-12 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-lg font-semibold">LearnAI</h3>
                <p className="text-gray-400">
                  Connecting students with expert professors through AI-powered matching and interactive learning tools.
                </p>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">For Students</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/explore" className="hover:text-white">Find Professors</Link></li>
                  <li><Link href="/bookings" className="hover:text-white">Book Sessions</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white">Learning Dashboard</Link></li>
                  <li><a href="#pricing" className="hover:text-white">Payment Options</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">For Professors</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/register" className="hover:text-white">Register to Teach</Link></li>
                  <li><Link href="/profile" className="hover:text-white">Profile Management</Link></li>
                  <li><Link href="/classroom" className="hover:text-white">Teaching Tools</Link></li>
                  <li><a href="#pricing" className="hover:text-white">Payment Setup</a></li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>support@learnai.com</li>
                  <li>+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} LearnAI. All rights reserved. Platform fee: 10%</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
