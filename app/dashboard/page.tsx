import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      teacherProfile: true,
      studentProfile: true,
    },
  });

  if (!user) redirect("/login");

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

  const isTeacher = user.role === "TEACHER";
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-dark">
            Welcome back, {user.name || "Learner"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Role:{" "}
            <span className="font-semibold capitalize">
              {user.role.toLowerCase()}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          {isTeacher && (
            <a
              href="/classroom/demo"
              className="px-4 py-2 rounded-lg bg-secondary text-white text-sm font-semibold hover:bg-primary"
            >
              Open demo classroom
            </a>
          )}
          {!isTeacher && (
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-secondary"
            >
              Find a professor
            </a>
          )}
        </div>
      </div>

      {/* Top professors & students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-3 text-dark flex items-center justify-between">
            Top Professors
            <span className="text-xs text-gray-500">
              Based on rating & activity
            </span>
          </h2>
          <div className="space-y-2 text-sm">
            {topTeachers.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {t.user.name ?? "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t.title || t.subjects.slice(0, 3).join(", ")}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-yellow-500 font-semibold">
                    ⭐ {t.rating.toFixed(1)}
                  </div>
                  <div className="text-gray-500">
                    {t.totalReviews} reviews
                  </div>
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

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-3 text-dark">
            Students overview
          </h2>
          <div className="space-y-2 text-sm">
            {topStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {s.name ?? "Student"}
                  </div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Joined {s.createdAt.toDateString()}
                </div>
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
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-3 text-dark">
            Admin notes
          </h2>
          <p className="text-sm text-gray-600">
            You can use this dashboard data to export top professors and top
            students to your recruitment pipeline. A future version can expose
            CSV export and direct HR integrations.
          </p>
        </section>
      )}
    </div>
  );
}
