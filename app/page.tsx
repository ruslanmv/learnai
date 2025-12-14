import HomeSearchClient from "@/components/HomeSearchClient";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FaBrain,
  FaChalkboardTeacher,
  FaChartLine,
  FaClock,
  FaCreditCard,
  FaGlobe,
  FaMoneyBillWave,
  FaRobot,
  FaShieldAlt,
  FaStar,
  FaUserTie,
  FaUsers,
  FaVideo,
} from "react-icons/fa";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const topTeachers = await prisma.teacherProfile.findMany({
    where: { isActive: true },
    include: { user: true },
    orderBy: { rating: "desc" },
    take: 3,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-block rounded-full bg-white bg-opacity-20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <span className="mr-2">🎓</span>
              AI-Powered Learning Platform
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              World-Class Education,
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Personalized for You
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed opacity-90 md:text-2xl">
              Connect with expert professors worldwide for 1-on-1 sessions with AI-powered matching,
              interactive whiteboards, and seamless video conferencing.
            </p>

            {/* CTA Buttons */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                Explore Professors
              </Link>
              <Link
                href="/pricing"
                className="rounded-lg border-2 border-white bg-white bg-opacity-10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-primary"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="rounded-lg bg-white bg-opacity-10 p-4 backdrop-blur-sm">
                <div className="mb-2 text-3xl font-bold">1,000+</div>
                <div className="text-sm opacity-90">Expert Professors</div>
              </div>
              <div className="rounded-lg bg-white bg-opacity-10 p-4 backdrop-blur-sm">
                <div className="mb-2 text-3xl font-bold">10k+</div>
                <div className="text-sm opacity-90">Active Students</div>
              </div>
              <div className="rounded-lg bg-white bg-opacity-10 p-4 backdrop-blur-sm">
                <div className="mb-2 text-3xl font-bold">100k+</div>
                <div className="text-sm opacity-90">Sessions Completed</div>
              </div>
              <div className="rounded-lg bg-white bg-opacity-10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center justify-center gap-1 text-3xl font-bold">
                  4.8 <FaStar className="text-xl text-yellow-400" />
                </div>
                <div className="text-sm opacity-90">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-dark md:text-4xl">
              Find Your Perfect Professor
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Let our AI match you with the ideal instructor based on your learning goals
            </p>
            <HomeSearchClient />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-dark md:text-5xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Enterprise-grade learning platform with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FaBrain />}
              title="AI-Powered Matching"
              description="Advanced algorithms analyze your learning style, goals, and schedule to connect you with the ideal professor instantly."
              color="primary"
            />
            <FeatureCard
              icon={<FaVideo />}
              title="Live Video Sessions"
              description="High-quality 1-on-1 video conferencing with Microsoft Teams integration for seamless learning experiences."
              color="secondary"
            />
            <FeatureCard
              icon={<FaChalkboardTeacher />}
              title="Interactive Whiteboard"
              description="Collaborate in real-time with professional-grade digital whiteboard technology powered by tldraw."
              color="accent"
            />
            <FeatureCard
              icon={<FaShieldAlt />}
              title="Secure Payments"
              description="Enterprise-level payment security with PayPal. Simple per-session billing with transparent pricing."
              color="primary"
            />
            <FeatureCard
              icon={<FaGlobe />}
              title="Global Reach"
              description="Connect with expert instructors and students from 100+ countries with multi-language support."
              color="secondary"
            />
            <FeatureCard
              icon={<FaChartLine />}
              title="Performance Analytics"
              description="Track progress with comprehensive dashboards. Employers can discover top talent through our ranking system."
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-dark md:text-5xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Get started in minutes with our simple, streamlined process
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <StepCard
              step={1}
              title="Browse & Discover"
              description="Explore our curated marketplace of expert professors across 50+ subjects worldwide."
              color="primary"
            />
            <StepCard
              step={2}
              title="AI Matching"
              description="Our intelligent system recommends the perfect instructors based on your unique needs."
              color="secondary"
            />
            <StepCard
              step={3}
              title="Book & Pay"
              description="Schedule sessions that fit your calendar and pay securely with PayPal."
              color="accent"
            />
            <StepCard
              step={4}
              title="Learn & Grow"
              description="Join live sessions with video, whiteboard, and track your progress over time."
              color="primary"
            />
          </div>
        </div>
      </section>

      {/* Top Professors Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Featured Expert Professors</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Learn from top-rated instructors trusted by thousands of students worldwide
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {topTeachers.length > 0 ? (
              topTeachers.map((t, idx) => (
                <div
                  key={t.id}
                  className="overflow-hidden rounded-xl bg-white shadow-xl transition-transform hover:scale-105"
                >
                  <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-6xl text-white">
                    👨‍🏫
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        {t.user.name ?? `Professor #${idx + 1}`}
                      </h3>
                      <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                        <FaStar className="text-yellow-500" />
                        {t.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">
                      {t.title || t.subjects.slice(0, 2).join(", ") || "Expert Professor"}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {t.subjects.slice(0, 3).map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <div>
                        <div className="text-xs text-gray-500">Starting at</div>
                        <div className="text-xl font-bold text-primary">
                          ${t.hourlyRate.toString()}/hr
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <ProfessorPlaceholder
                  name="Dr. John Smith"
                  rating={4.9}
                  subject="Mathematics & Physics"
                  price={45}
                />
                <ProfessorPlaceholder
                  name="Prof. Maria Garcia"
                  rating={4.8}
                  subject="Computer Science & AI"
                  price={50}
                />
                <ProfessorPlaceholder
                  name="Dr. David Chen"
                  rating={4.9}
                  subject="Languages & Literature"
                  price={40}
                />
              </>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-all hover:scale-105"
            >
              Explore All Professors
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-primary to-secondary p-12 text-center text-white shadow-2xl">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ready to Transform Your Learning?</h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of students and professionals advancing their education with LearnAI
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-all hover:scale-105"
              >
                Get Started for Free
              </Link>
              <Link
                href="/about"
                className="rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-primary"
              >
                Learn More
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-75">
              <FaClock />
              <span>No credit card required • Start learning in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent";
}) {
  const bg =
    color === "primary" ? "bg-primary" : color === "secondary" ? "bg-secondary" : "bg-accent";
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <div
        className={`h-12 w-12 ${bg} mb-4 flex items-center justify-center rounded-lg text-xl text-white`}
      >
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function ProfessorPlaceholder({
  name,
  rating,
  subject,
  price,
}: {
  name: string;
  rating: number;
  subject: string;
  price: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-xl transition-transform hover:scale-105">
      <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-6xl text-white">
        👨‍🏫
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
            <FaStar className="text-yellow-500" />
            {rating.toFixed(1)}
          </div>
        </div>
        <p className="mb-4 text-sm text-gray-600">{subject}</p>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div>
            <div className="text-xs text-gray-500">Starting at</div>
            <div className="text-xl font-bold text-primary">${price}/hr</div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  color,
}: {
  step: number;
  title: string;
  description: string;
  color: "primary" | "secondary" | "accent";
}) {
  const bg =
    color === "primary" ? "bg-primary" : color === "secondary" ? "bg-secondary" : "bg-accent";
  const border =
    color === "primary"
      ? "border-primary"
      : color === "secondary"
        ? "border-secondary"
        : "border-accent";

  return (
    <div className="relative text-center">
      <div
        className={`${bg} relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white`}
      >
        <span className="text-3xl font-bold">{step}</span>
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-base leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
