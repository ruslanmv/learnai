import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Professor = {
  id: string;
  name: string;
  subject: string;
  rating: number;
  price: number;
  image: string;
};

export default async function ExplorePage() {
  // Fetch all active teachers from database
  let professors: Professor[] = [];

  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: "TEACHER",
        teacherProfile: {
          isActive: true,
        },
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

    professors = teachers.map((u, i) => {
      const p = u.teacherProfile;
      return {
        id: u.id,
        name: u.name || `Professor ${i + 1}`,
        subject:
          Array.isArray(p?.subjects) && p.subjects.length > 0
            ? p.subjects.slice(0, 2).join(" & ")
            : p?.title ?? "Expert Professor",
        rating: typeof p?.rating === "number" ? p.rating : 4.6 + (i % 4) * 0.1,
        price: p?.hourlyRate ? Number(p.hourlyRate) : 35 + (i % 5) * 5,
        image: u.image || `https://picsum.photos/800/600?random=${20 + i}`,
      };
    });
  } catch (error) {
    console.error("Error fetching professors:", error);
    // Fallback to demo data
    professors = Array.from({ length: 12 }).map((_, i) => ({
      id: String(i + 1),
      name: `Professor ${i + 1}`,
      subject: ["Math", "Physics", "AI", "Languages"][i % 4],
      rating: 4.6 + (i % 4) * 0.1,
      price: 35 + (i % 5) * 5,
      image: `https://picsum.photos/800/600?random=${20 + i}`,
    }));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600" />
            <span className="text-xl font-bold text-gray-900">LearnAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Explore Professors
            </h1>
            <p className="mt-2 text-gray-600">
              Browse freely. Login only when you decide to book a session.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Search (subject, name, language)…"
              className="w-full rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 md:w-80"
            />
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600">
              Search
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {professors.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="h-44 w-full object-cover" />

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
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

                  <Link
                    href={`/bookings/new?professorId=${p.id}`}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
                  >
                    Book
                  </Link>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Booking may require login to confirm details.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
