import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { AppLayout } from "@/components/AppLayout";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing - LearnAI",
  description: "Simple, transparent pricing for students and professors. Only 10% platform fee.",
};

export default function PricingPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">Simple, Transparent Pricing</h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl opacity-90">
            No subscriptions. No hidden fees. Pay per session with only 10% platform fee.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* For Students */}
            <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-transform hover:scale-105">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-white">
                🎓
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">For Students</h3>
              <p className="mb-6 text-gray-600">Learn from expert professors on-demand</p>

              <div className="mb-6">
                <div className="mb-2 text-4xl font-bold text-gray-900">Pay Per Session</div>
                <p className="text-gray-600">Set by professors ($30-$100/hour typically)</p>
              </div>

              <ul className="mb-8 space-y-3">
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>AI-powered professor matching</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Interactive whiteboard sessions</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Microsoft Teams integration</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Secure PayPal payments</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Session recordings & notes</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Performance dashboard</span>
                </li>
              </ul>

              <Link
                href="/dashboard"
                className="block w-full rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-secondary"
              >
                Find Professors
              </Link>
            </div>

            {/* For Professors */}
            <div className="rounded-xl border-2 border-primary bg-white p-8 shadow-xl transition-transform hover:scale-105">
              <div className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                BEST VALUE
              </div>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl text-white">
                👨‍🏫
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">For Professors</h3>
              <p className="mb-6 text-gray-600">Earn money teaching what you love</p>

              <div className="mb-6">
                <div className="mb-2 text-4xl font-bold text-gray-900">Keep 90%</div>
                <p className="text-gray-600">We only take 10% platform fee</p>
              </div>

              <ul className="mb-8 space-y-3">
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Set your own hourly rate</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Flexible teaching schedule</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Automatic student matching</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Integrated payment processing</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Professional teaching tools</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Build your teaching brand</span>
                </li>
              </ul>

              <Link
                href="/register"
                className="block w-full rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-secondary"
              >
                Start Teaching
              </Link>
            </div>

            {/* For Institutions */}
            <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-transform hover:scale-105">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl text-white">
                🏢
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">For Institutions</h3>
              <p className="mb-6 text-gray-600">Recruit top talent from our platform</p>

              <div className="mb-6">
                <div className="mb-2 text-4xl font-bold text-gray-900">Custom</div>
                <p className="text-gray-600">Contact us for enterprise pricing</p>
              </div>

              <ul className="mb-8 space-y-3">
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Access to performance rankings</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Recruit top-rated students</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Find skilled professors</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Bulk session packages</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="mr-3 mt-1 text-accent" />
                  <span>Custom integration options</span>
                </li>
              </ul>

              <a
                href="https://ruslanmv.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border-2 border-primary px-6 py-3 text-center font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  How does payment work?
                </h3>
                <p className="text-gray-600">
                  Students pay per session through PayPal. Professors receive 90% of the session fee
                  directly to their PayPal account. LearnAI takes only a 10% platform fee to maintain
                  and improve the service.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Can I try before I buy?
                </h3>
                <p className="text-gray-600">
                  Yes! You can browse professor profiles, read reviews, and use our AI matching system
                  for free. You only pay when you book and complete a session.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  What if I'm not satisfied with a session?
                </h3>
                <p className="text-gray-600">
                  We have a satisfaction guarantee. If you're not happy with your first session with a
                  professor, contact our support team within 24 hours for a full refund.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  How do professors set their rates?
                </h3>
                <p className="text-gray-600">
                  Professors set their own hourly rates based on their expertise, experience, and market
                  demand. Rates typically range from $30 to $100 per hour, but professors are free to
                  charge what they believe their time is worth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </AppLayout>
  );
}
