import HomeSearchClient from "@/components/HomeSearchClient";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FaBrain,
  FaChalkboardTeacher,
  FaChartLine,
  FaCreditCard,
  FaGlobe,
  FaMoneyBillWave,
  FaRobot,
  FaUserTie,
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
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
        <div className="container mx-auto space-y-10 px-4 text-center">
          <div>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Learn Smarter with AI-Powered Tutoring
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl opacity-90 md:text-2xl">
              Connect with expert professors, schedule 1-on-1 sessions, and learn with interactive
              whiteboards.
            </p>
          </div>

          <div className="mb-4 flex flex-col justify-center gap-4 md:flex-row">
            <Link
              href="/login"
              className="rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-colors hover:bg-gray-100"
            >
              Start Learning Today
            </Link>
            <a
              href="#features"
              className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              How It Works
            </a>
          </div>

          {/* AI search & info cards */}
          <HomeSearchClient />

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white bg-opacity-10 p-6 backdrop-blur-sm">
              <FaRobot className="mb-4 text-3xl" />
              <h3 className="mb-2 text-xl font-semibold">AI Professor Matching</h3>
              <p className="text-sm">
                Our AI finds the perfect professor based on your learning needs and preferences.
              </p>
            </div>
            <div className="rounded-lg bg-white bg-opacity-10 p-6 backdrop-blur-sm">
              <FaChalkboardTeacher className="mb-4 text-3xl" />
              <h3 className="mb-2 text-xl font-semibold">Interactive Whiteboard</h3>
              <p className="text-sm">
                Real-time collaboration with integrated whiteboard and Microsoft Teams.
              </p>
            </div>
            <div className="rounded-lg bg-white bg-opacity-10 p-6 backdrop-blur-sm">
              <FaCreditCard className="mb-4 text-3xl" />
              <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
              <p className="text-sm">
                Pay per session with PayPal, professors receive 90% of payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
            Why Choose LearnAI?
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FaBrain />}
              title="AI-Powered Matching"
              description="Our intelligent system analyzes your learning style, subject needs, and schedule to match you with the perfect professor."
              color="primary"
            />
            <FeatureCard
              icon={<FaVideo />}
              title="1-on-1 Sessions"
              description="Personalized learning experiences with interactive whiteboard and Microsoft Teams integration."
              color="secondary"
            />
            <FeatureCard
              icon={<FaMoneyBillWave />}
              title="Simple Payments"
              description="Pay per session with PayPal. Professors receive 90% of payment, we only take 10% platform fee."
              color="accent"
            />
            <FeatureCard
              icon={<FaChartLine />}
              title="Performance Dashboard"
              description="Track top professors and students. Our ranking system helps recruiters find talent for real jobs."
              color="primary"
            />
            <FeatureCard
              icon={<FaGlobe />}
              title="Multi-language Support"
              description="Learn and teach in your preferred language with our comprehensive language support system."
              color="secondary"
            />
            <FeatureCard
              icon={<FaUserTie />}
              title="Teacher Registration"
              description="Easy registration for professors by topic. Build your teaching profile and start earning immediately."
              color="accent"
            />
          </div>
        </div>
      </section>

      {/* Top Professors Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
            Top Rated Professors
          </h2>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {topTeachers.length > 0 ? (
              topTeachers.map((t, idx) => (
                <div key={t.id} className="overflow-hidden rounded-xl bg-white shadow-md">
                  <div className="flex h-48 w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                    {t.user.name ?? "Professor"} photo
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xl font-semibold">
                        {t.user.name ?? `Professor #${idx + 1}`}
                      </h3>
                      <div className="flex items-center text-sm text-yellow-400">
                        <span className="mr-1">★</span>
                        <span className="text-gray-700">{t.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">
                      {t.title || t.subjects.join(", ") || "Expert Professor"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        ${t.hourlyRate.toString()}/session
                      </span>
                      <Link
                        href="/login"
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-secondary"
                      >
                        Book Session
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
              className="rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-secondary"
            >
              View All Professors
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20" id="about">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-dark md:text-4xl">
            How LearnAI Works
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <StepCard
              step={1}
              title="Sign Up & Profile"
              description="Create your account as student or professor and complete your profile."
              color="primary"
            />
            <StepCard
              step={2}
              title="AI Matching"
              description="Our AI suggests the best professors based on your learning objectives."
              color="secondary"
            />
            <StepCard
              step={3}
              title="Schedule & Pay"
              description="Book sessions, pay securely with PayPal, and get ready to learn."
              color="accent"
            />
            <StepCard
              step={4}
              title="Learn & Grow"
              description="Join interactive sessions with whiteboard and track your progress on the dashboard."
              color="primary"
            />
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
    <div className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="flex h-48 w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
        {name} photo
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex items-center text-sm text-yellow-400">
            <span className="mr-1">★</span>
            <span className="text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="mb-4 text-sm text-gray-600">{subject}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">${price}/session</span>
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-secondary"
          >
            Book Session
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

  return (
    <div className="text-center">
      <div
        className={`h-16 w-16 ${bg} mx-auto mb-4 flex items-center justify-center rounded-full text-white`}
      >
        <span className="text-xl font-bold">{step}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
