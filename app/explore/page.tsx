import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listTeacherAgents } from "@/lib/contextforge";

export const dynamic = "force-dynamic";

type TeacherCard = {
  id: string;
  kind: "HUMAN" | "AI";
  name: string;
  subject: string;
  rating: number;
  price: number;
  image: string;
  agentName?: string;
  tags?: string[];
};

function prettifyAgentName(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function bestSubjectFromTags(tags: string[]) {
  const ignore = new Set(["teacher"]);
  const t = tags.find((x) => !ignore.has(x));
  return t ? t.replace(/[-_]+/g, " ") : "";
}

export default async function ExplorePage() {
  let cards: TeacherCard[] = [];

  // 1) Human teachers from Prisma
  let humanCards: TeacherCard[] = [];
  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        teacherProfile: { isActive: true },
      },
      take: 30,
      orderBy: [
        { teacherProfile: { rating: "desc" } },
        { teacherProfile: { totalReviews: "desc" } },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        name: true,
        image: true,
        teacherProfile: {
          select: {
            subjects: true,
            hourlyRate: true,
            rating: true,
            totalReviews: true,
            title: true,
          },
        },
      },
    });

    humanCards = teachers.map((u, i) => {
      const p = u.teacherProfile;
      return {
        id: u.id,
        kind: "HUMAN" as const,
        name: u.name || `Professor ${i + 1}`,
        subject:
          Array.isArray(p?.subjects) && p.subjects.length > 0
            ? p.subjects.slice(0, 2).join(" & ")
            : p?.title ?? "Expert Professor",
        rating:
          typeof p?.rating === "number" ? p.rating : 4.6 + (i % 4) * 0.1,
        price: p?.hourlyRate ? Number(p.hourlyRate) : 35 + (i % 5) * 5,
        image: u.image || `https://picsum.photos/800/600?random=${20 + i}`,
      };
    });
  } catch (error) {
    console.error("Error fetching human professors:", error);
  }

  // 2) AI teachers from ContextForge A2A catalog
  let aiCards: TeacherCard[] = [];
  try {
    const agents = await listTeacherAgents();

    aiCards = agents.slice(0, 30).map((a, i) => ({
      id: a.id || a.name,
      kind: "AI" as const,
      name: prettifyAgentName(a.name),
      subject:
        bestSubjectFromTags(a.tags || []) ||
        (a.description ? a.description.slice(0, 48) : "AI Professor"),
      rating: 5.0,
      price: 0,
      image: `https://picsum.photos/800/600?random=${200 + i}`,
      agentName: a.name,
      tags: a.tags || [],
    }));
  } catch (error) {
    console.error("Error fetching AI teachers from ContextForge:", error);
  }

  // Combine: AI teachers first, then human teachers
  cards = [...aiCards, ...humanCards];

  // Fallback demo data if no teachers found
  if (cards.length === 0) {
    cards = Array.from({ length: 12 }).map((_, i) => ({
      id: String(i + 1),
      kind: "HUMAN" as const,
      name: `Professor ${i + 1}`,
      subject: ["Math", "Physics", "AI", "Languages"][i % 4],
      rating: 4.6 + (i % 4) * 0.1,
      price: 35 + (i % 5) * 5,
      image: `https://picsum.photos/800/600?random=${20 + i}`,
    }));
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold text-dark">LearnAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">Teachers</h1>
            <p className="mt-2 text-gray-600">
              AI professors are available instantly. Humans are bookable.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Search subject or name..."
              className="w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary md:w-80"
            />
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary">
              Search
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((p) => (
            <div
              key={`${p.kind}:${p.id}`}
              className="overflow-hidden rounded-xl bg-white shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <p className="text-gray-600">{p.subject}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        p.kind === "AI"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {p.kind === "AI" ? "AI" : "Human"}
                    </span>

                    <div className="flex items-center gap-1 text-yellow-400">
                      <span>★</span>
                      <span className="text-gray-700">
                        {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    {p.kind === "AI" ? "Instant" : `€${p.price}/session`}
                  </span>

                  {p.kind === "AI" ? (
                    <Link
                      href={`/learn?agent=${encodeURIComponent(p.agentName || "")}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-secondary"
                    >
                      Start
                    </Link>
                  ) : (
                    <Link
                      href={`/bookings/new?professorId=${p.id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-secondary"
                    >
                      Book
                    </Link>
                  )}
                </div>

                {p.kind === "AI" && p.tags?.length ? (
                  <p className="mt-3 text-xs text-gray-500 line-clamp-2">
                    Tags: {p.tags.slice(0, 6).join(", ")}
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-gray-500">
                    {p.kind === "AI"
                      ? "Runs an interview session instantly."
                      : "Booking may require login to confirm details."}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
