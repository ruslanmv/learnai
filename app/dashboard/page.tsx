import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Fetch data for both authenticated and guest users
  const [topTeachers, topStudents] = await Promise.all([
    prisma.teacherProfile.findMany({
      where: { isActive: true },
      include: { user: true },
      orderBy: { rating: "desc" },
      take: 6,
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  // Get user data if authenticated
  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> | null = null;
  let isTeacher = false;
  let isAdmin = false;

  if (session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });
    isTeacher = user?.role === "TEACHER";
    isAdmin = user?.role === "ADMIN";
  }

  // Guest mode rendering
  if (!user) {
    return (
      <AppLayout>
        <div className="container mx-auto space-y-8 px-4 py-10">
        {/* Guest Welcome Section */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-white shadow-lg">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            👋 Welcome to LearnAI Explorer Mode!
          </h1>
          <p className="mb-6 text-lg opacity-90">
            Browse our amazing professors and explore all features. When you&apos;re ready to book
            sessions and start learning, just create a free account!
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-primary transition-colors hover:bg-gray-100"
            >
              🚀 Sign Up Free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Professors Section for Guests */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-dark">Browse Top Professors</h2>
            <span className="text-sm text-gray-500">All available for booking</span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topTeachers.map((t) => (
              <div
                key={t.id}
                className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-3">
                  <div className="mb-1 font-semibold text-gray-900">{t.user.name ?? "Professor"}</div>
                  <div className="text-sm text-gray-600">
                    {t.title || t.subjects.slice(0, 2).join(", ")}
                  </div>
                </div>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <div className="flex items-center text-yellow-500">
                    ⭐ <span className="ml-1 font-semibold">{t.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-500">({t.totalReviews})</span>
                  </div>
                  <div className="font-semibold text-primary">${t.hourlyRate.toString()}/hr</div>
                </div>
                <Link
                  href="/register"
                  className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-secondary"
                >
                  Sign Up to Book
                </Link>
              </div>
            ))}
          </div>

          {topTeachers.length === 0 && (
            <p className="py-8 text-center text-gray-500">
              No professors available yet. Check back soon!
            </p>
          )}
        </section>

        {/* Features CTA */}
        <div className="rounded-xl border-2 border-primary bg-blue-50 p-6">
          <h3 className="mb-3 text-xl font-bold text-gray-900">
            Ready to Start Learning? 🎓
          </h3>
          <p className="mb-4 text-gray-700">
            Create your free account to unlock all features:
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Book 1-on-1 sessions with expert professors
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Access interactive whiteboard and video calls
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Get AI-powered professor recommendations
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              Track your learning progress
            </li>
          </ul>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary"
          >
            Create Free Account →
          </Link>
        </div>
        </div>
      </AppLayout>
    );
  }

  // Authenticated user rendering
  return (
    <AppLayout>
      <div className="container mx-auto space-y-8 px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark md:text-3xl">
            Welcome back, {user.name || "Learner"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Role: <span className="font-semibold capitalize">{user.role.toLowerCase()}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {isTeacher && (
            <a
              href="/classroom/demo"
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-primary"
            >
              Open demo classroom
            </a>
          )}
          {!isTeacher && (
            <a
              href="/"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary"
            >
              Find a professor
            </a>
          )}
        </div>
      </div>

      {/* Top professors & students */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center justify-between text-lg font-semibold text-dark">
            Top Professors
            <span className="text-xs text-gray-500">Based on rating & activity</span>
          </h2>
          <div className="space-y-2 text-sm">
            {topTeachers.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <div>
                  <div className="font-medium text-gray-900">{t.user.name ?? "Unknown"}</div>
                  <div className="text-xs text-gray-500">
                    {t.title || t.subjects.slice(0, 3).join(", ")}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-semibold text-yellow-500">⭐ {t.rating.toFixed(1)}</div>
                  <div className="text-gray-500">{t.totalReviews} reviews</div>
                </div>
              </div>
            ))}
            {topTeachers.length === 0 && (
              <p className="text-xs text-gray-500">
                No professors yet. Admin can add them via the database or a future admin panel.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-dark">Students overview</h2>
          <div className="space-y-2 text-sm">
            {topStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <div>
                  <div className="font-medium text-gray-900">{s.name ?? "Student"}</div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                </div>
                <div className="text-xs text-gray-500">Joined {s.createdAt.toDateString()}</div>
              </div>
            ))}
            {topStudents.length === 0 && (
              <p className="text-xs text-gray-500">
                No students yet. Share your LearnAI portal to invite the first learners.
              </p>
            )}
          </div>
        </section>
      </div>

      {isAdmin && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-dark">Admin notes</h2>
          <p className="text-sm text-gray-600">
            You can use this dashboard data to export top professors and top students to your
            recruitment pipeline. A future version can expose CSV export and direct HR integrations.
          </p>
        </section>
      )}
      </div>
    </AppLayout>
  );
}
