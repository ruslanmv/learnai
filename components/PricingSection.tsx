import Link from "next/link";

export default function PricingSection() {
  const tiers = [
    {
      name: "Free Explorer",
      price: "€0",
      subtitle: "Browse and discover",
      features: [
        "Explore professors and topics",
        "View public profiles",
        "See ratings and pricing",
        "No account needed",
      ],
      cta: { label: "Explore Professors", href: "/explore" },
      highlight: false,
    },
    {
      name: "Pay Per Session",
      price: "From €35",
      subtitle: "Most popular",
      features: [
        "Book 1-on-1 sessions",
        "Secure payments",
        "Session history & receipts",
        "Save favorites & progress",
      ],
      cta: { label: "Start Booking", href: "/explore" },
      highlight: true,
    },
    {
      name: "For Professors",
      price: "90%",
      subtitle: "You keep 90%",
      features: [
        "Create your teaching profile",
        "Set availability & pricing",
        "Get booked by students",
        "Only 10% platform fee",
      ],
      cta: { label: "Start Teaching", href: "/register" },
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-dark md:text-4xl">
          Simple Pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
          Explore freely. Login only when you decide to book or save progress.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={[
                "rounded-xl border p-8",
                t.highlight
                  ? "border-primary bg-gradient-to-b from-indigo-50 to-white shadow-md"
                  : "border-gray-200 bg-gray-50",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-dark">{t.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{t.subtitle}</p>
                </div>
                {t.highlight ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </span>
                ) : null}
              </div>

              <div className="mt-6 text-4xl font-bold text-dark">{t.price}</div>
              <div className="mt-1 text-sm text-gray-600">
                {t.name === "For Professors" ? "of each session" : "per session"}
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.cta.href}
                className={[
                  "mt-8 inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                  t.highlight
                    ? "bg-primary text-white hover:bg-secondary"
                    : "bg-white text-dark border hover:bg-gray-50",
                ].join(" ")}
              >
                {t.cta.label}
              </Link>

              <p className="mt-3 text-center text-xs text-gray-500">
                {t.name === "Free Explorer"
                  ? "No account required."
                  : "Login only needed for booking & saving."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
