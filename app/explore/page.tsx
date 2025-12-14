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
            <h1 className="text-3xl font-bold text-dark">Professors</h1>
            <p className="mt-2 text-gray-600">
              Browse freely. Login only when you decide to book.
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
          {professors.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl bg-white shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
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
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-secondary"
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
