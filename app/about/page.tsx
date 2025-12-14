import Link from "next/link";
import { FaBrain, FaGithub, FaGlobe, FaHeart, FaRocket, FaStar, FaUsers } from "react-icons/fa";
import { AppLayout } from "@/components/AppLayout";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export const metadata = {
  title: "About - LearnAI",
  description:
    "Learn about LearnAI's mission to connect students with expert professors through AI-powered matching.",
};

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">About LearnAI</h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl opacity-90">
            Revolutionizing education through AI-powered connections between students and expert
            professors
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              LearnAI is dedicated to democratizing access to quality education by connecting students
              with expert professors from around the world. We believe that everyone deserves access to
              personalized, high-quality learning experiences, regardless of their location or
              circumstances.
            </p>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Our AI-powered platform intelligently matches students with the perfect professor based on
              their learning style, subject needs, and schedule. With integrated whiteboard technology
              and seamless payment processing, we make it easy for students to learn and professors to
              teach.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">What Makes Us Different</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <FaBrain className="text-2xl" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">AI-Powered Matching</h3>
              <p className="text-gray-600">
                Our intelligent algorithm finds the perfect professor for your learning needs
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white">
                <FaRocket className="text-2xl" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Interactive Learning</h3>
              <p className="text-gray-600">
                Real-time whiteboard and video integration for engaging 1-on-1 sessions
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Global Community</h3>
              <p className="text-gray-600">
                Connect with expert professors and students from around the world
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <FaHeart className="text-2xl" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Fair Pricing</h3>
              <p className="text-gray-600">Only 10% platform fee - professors keep 90% of earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-5xl font-bold text-primary">1000+</div>
              <div className="text-xl font-semibold text-gray-900">Expert Professors</div>
              <p className="mt-2 text-gray-600">Teaching across 50+ subjects</p>
            </div>

            <div className="rounded-xl bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-5xl font-bold text-secondary">10,000+</div>
              <div className="text-xl font-semibold text-gray-900">Students Learning</div>
              <p className="mt-2 text-gray-600">From over 100 countries</p>
            </div>

            <div className="rounded-xl bg-white p-8 text-center shadow-lg">
              <div className="mb-4 text-5xl font-bold text-accent">100,000+</div>
              <div className="text-xl font-semibold text-gray-900">Sessions Completed</div>
              <p className="mt-2 text-gray-600">With 4.8+ average rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Credits Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold">Created By</h2>

            <div className="mb-8 flex justify-center">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-4xl font-bold text-primary">
                  RM
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-2xl font-bold">Ruslan Magana</h3>
            <p className="mb-6 text-lg text-gray-300">
              AI Engineer & Full-Stack Developer passionate about making education accessible to
              everyone
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://ruslanmv.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition-transform hover:scale-105"
              >
                <FaGlobe />
                Visit ruslanmv.com
              </a>

              <a
                href="https://github.com/ruslanmv/learnai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
              >
                <FaGithub />
                View on GitHub
              </a>
            </div>

            {/* Star on GitHub CTA */}
            <div className="rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-400 to-orange-400 p-8">
              <div className="mb-4 text-4xl">⭐</div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Like This Project?</h3>
              <p className="mb-6 text-gray-900">
                If you find LearnAI useful, please consider starring the repository on GitHub! Your
                support helps us continue improving the platform.
              </p>
              <a
                href="https://github.com/ruslanmv/learnai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-8 py-4 font-bold text-white transition-transform hover:scale-105"
              >
                <FaStar />
                Star on GitHub
              </a>
            </div>

            {/* Credits for Features */}
            <div className="mt-12 rounded-xl bg-white bg-opacity-10 p-6 backdrop-blur-sm">
              <h4 className="mb-4 text-xl font-semibold">Need Custom Development?</h4>
              <p className="mb-4 text-gray-300">
                Looking for AI-powered solutions, full-stack development, or educational technology
                consulting? Ruslan is available for freelance projects and consulting.
              </p>
              <a
                href="https://ruslanmv.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-yellow-400 underline hover:text-yellow-300"
              >
                Request a quote at ruslanmv.com →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Built With Modern Tech</h2>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">⚛️</div>
              <div className="font-semibold text-gray-900">Next.js 15</div>
              <div className="text-sm text-gray-600">React Framework</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">🎨</div>
              <div className="font-semibold text-gray-900">Tailwind CSS</div>
              <div className="text-sm text-gray-600">Styling</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">🗄️</div>
              <div className="font-semibold text-gray-900">Prisma</div>
              <div className="text-sm text-gray-600">Database ORM</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">🤖</div>
              <div className="font-semibold text-gray-900">OpenAI</div>
              <div className="text-sm text-gray-600">AI Matching</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">🔐</div>
              <div className="font-semibold text-gray-900">NextAuth.js</div>
              <div className="text-sm text-gray-600">Authentication</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">💳</div>
              <div className="font-semibold text-gray-900">PayPal</div>
              <div className="text-sm text-gray-600">Payments</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">✏️</div>
              <div className="font-semibold text-gray-900">tldraw</div>
              <div className="text-sm text-gray-600">Whiteboard</div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="mb-3 text-4xl">☁️</div>
              <div className="font-semibold text-gray-900">Vercel</div>
              <div className="text-sm text-gray-600">Deployment</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Start Learning?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Join thousands of students and professors already using LearnAI
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-colors hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              Browse Professors
            </Link>
          </div>
        </div>
      </section>
      </div>
    </AppLayout>
  );
}
