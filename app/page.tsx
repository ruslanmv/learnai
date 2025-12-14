import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import PricingSection from "@/components/PricingSection";
import { getTopProfessors } from "@/lib/topProfessors";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topProfessors = await getTopProfessors();

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketingHeader />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-indigo-600 to-violet-600 py-20 text-white">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Learn Smarter with AI-Powered Tutoring
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg opacity-90 md:text-2xl">
              Connect with expert professors, schedule 1-on-1 sessions, and learn with interactive
              tools. Login is optional.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">
              {/* IMPORTANT: no auto-login */}
              <Link
                href="/explore"
                className="rounded-xl bg-white px-8 py-4 font-semibold text-indigo-600 hover:bg-gray-100"
              >
                Start Learning Today
              </Link>
              <a
                href="#features"
                className="rounded-xl border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white hover:text-indigo-600"
              >
                How It Works
              </a>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div className="text-3xl">🤖</div>
                <h3 className="mt-3 text-xl font-semibold">AI Professor Matching</h3>
                <p className="mt-2 opacity-90">
                  Find the perfect professor based on your goals and learning style.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div className="text-3xl">🧑‍🏫</div>
                <h3 className="mt-3 text-xl font-semibold">Interactive Sessions</h3>
                <p className="mt-2 opacity-90">
                  Learn 1-on-1 with real-time collaboration and a clean classroom experience.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <div className="text-3xl">💳</div>
                <h3 className="mt-3 text-xl font-semibold">Secure Payments</h3>
                <p className="mt-2 opacity-90">
                  Pay per session. Simple pricing and a transparent platform fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Why Choose LearnAI?
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "AI-Powered Matching",
                  desc: "We help you find the best professor for your needs faster than manual searching.",
                  icon: "🧠",
                  color: "bg-indigo-600",
                },
                {
                  title: "1-on-1 Sessions",
                  desc: "Personalized learning with the attention you never get in large classes.",
                  icon: "🎥",
                  color: "bg-violet-600",
                },
                {
                  title: "Simple Payments",
                  desc: "Pay per session. Transparent fees. No confusing subscriptions required.",
                  icon: "💸",
                  color: "bg-emerald-600",
                },
                {
                  title: "Performance Dashboard",
                  desc: "Track your learning outcomes, bookings, and progress when you decide to login.",
                  icon: "📈",
                  color: "bg-indigo-600",
                },
                {
                  title: "Multi-language Support",
                  desc: "Learn and teach in your preferred language with a global audience.",
                  icon: "🌍",
                  color: "bg-violet-600",
                },
                {
                  title: "Teacher Registration",
                  desc: "Professors can set topics, pricing, and availability in a simple onboarding flow.",
                  icon: "🧑‍💼",
                  color: "bg-emerald-600",
                },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color} text-white`}
                  >
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Professors */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Top Rated Professors
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {topProfessors.map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={`${p.name} - ${p.subject}`}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{p.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>★</span>
                        <span className="text-sm font-medium text-gray-700">
                          {p.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-gray-600">{p.subject}</p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-semibold text-indigo-600">€{p.price}/session</span>

                      {/* No forced login: book can redirect to login later if needed */}
                      <Link
                        href={`/bookings/new?professorId=${p.id}`}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/explore"
                className="inline-flex rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white hover:bg-violet-600"
              >
                View All Professors
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
              How LearnAI Works
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                {
                  n: "1",
                  title: "Explore Freely",
                  desc: "Browse professors and profiles without creating an account.",
                },
                {
                  n: "2",
                  title: "Pick the Best Match",
                  desc: "Choose by topic, rating, language, or availability.",
                },
                {
                  n: "3",
                  title: "Schedule & Pay",
                  desc: "When you book, login is requested to confirm details safely.",
                },
                {
                  n: "4",
                  title: "Learn & Grow",
                  desc: "Track progress and sessions once you decide to use the dashboard.",
                },
              ].map((s, i) => (
                <div key={s.title} className="text-center">
                  <div
                    className={[
                      "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white",
                      i % 3 === 0
                        ? "bg-indigo-600"
                        : i % 3 === 1
                          ? "bg-violet-600"
                          : "bg-emerald-600",
                    ].join(" ")}
                  >
                    <span className="text-xl font-bold">{s.n}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* Footer */}
        <footer id="about" className="bg-gray-900 py-12 text-white">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold">LearnAI</h3>
                <p className="mt-3 text-gray-400">
                  Connecting students with expert professors through AI-powered matching and
                  interactive learning tools.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">For Students</h3>
                <ul className="mt-3 space-y-2 text-gray-400">
                  <li>
                    <Link className="hover:text-white" href="/explore">
                      Find Professors
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="/bookings">
                      Book Sessions
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="/dashboard">
                      Learning Dashboard
                    </Link>
                  </li>
                  <li>
                    <a className="hover:text-white" href="#pricing">
                      Payment Options
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">For Professors</h3>
                <ul className="mt-3 space-y-2 text-gray-400">
                  <li>
                    <Link className="hover:text-white" href="/register">
                      Register to Teach
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="/profile">
                      Profile Management
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-white" href="/classroom">
                      Teaching Tools
                    </Link>
                  </li>
                  <li>
                    <a className="hover:text-white" href="#pricing">
                      Payment Setup
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Contact</h3>
                <ul className="mt-3 space-y-2 text-gray-400">
                  <li>support@learnai.com</li>
                  <li>+39 (000) 000-0000</li>
                  <li className="mt-4 flex gap-4">
                    <a className="hover:text-white" href="#">
                      Facebook
                    </a>
                    <a className="hover:text-white" href="#">
                      Twitter
                    </a>
                    <a className="hover:text-white" href="#">
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} LearnAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
