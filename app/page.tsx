import HomeSearchClient from "@/components/HomeSearchClient";
import { prisma } from "@/lib/prisma";
import { FaRobot, FaChalkboardTeacher, FaCreditCard, FaBrain, FaVideo, FaMoneyBillWave, FaChartLine, FaGlobe, FaUserTie } from "react-icons/fa";

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
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center space-y-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Smarter with AI-Powered Tutoring
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Connect with expert professors, schedule 1-on-1 sessions, and learn with interactive whiteboards.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
            <a
              href="/login"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Learning Today
            </a>
            <a
              href="#features"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              How It Works
            </a>
          </div>

          {/* AI search & info cards */}
          <HomeSearchClient />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-10">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <FaRobot className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Professor Matching</h3>
              <p className="text-sm">
                Our AI finds the perfect professor based on your learning needs and preferences.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <FaChalkboardTeacher className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Whiteboard</h3>
              <p className="text-sm">
                Real-time collaboration with integrated whiteboard and Microsoft Teams.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <FaCreditCard className="text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm">
                Pay per session with PayPal, professors receive 90% of payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-dark">
            Why Choose LearnAI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-dark">
            Top Rated Professors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {topTeachers.length > 0 ? (
              topTeachers.map((t, idx) => (
                <div key={t.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    {t.user.name ?? "Professor"} photo
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">
                        {t.user.name ?? `Professor #${idx + 1}`}
                      </h3>
                      <div className="flex items-center text-yellow-400 text-sm">
                        <span className="mr-1">★</span>
                        <span className="text-gray-700">
                          {t.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      {t.title || t.subjects.join(", ") || "Expert Professor"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold text-sm">
                        ${t.hourlyRate.toString()}/session
                      </span>
                      <a
                        href="/login"
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
                      >
                        Book Session
                      </a>
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
            <a
              href="/dashboard"
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              View All Professors
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white" id="about">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-dark">
            How LearnAI Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
    color === "primary"
      ? "bg-primary"
      : color === "secondary"
      ? "bg-secondary"
      : "bg-accent";
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center text-white mb-4 text-xl`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
        {name} photo
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex items-center text-yellow-400 text-sm">
            <span className="mr-1">★</span>
            <span className="text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4 text-sm">{subject}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-semibold text-sm">
            ${price}/session
          </span>
          <a
            href="/login"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
          >
            Book Session
          </a>
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
    color === "primary"
      ? "bg-primary"
      : color === "secondary"
      ? "bg-secondary"
      : "bg-accent";

  return (
    <div className="text-center">
      <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
        <span className="text-xl font-bold">{step}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
