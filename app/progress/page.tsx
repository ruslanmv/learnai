export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Learning Progress</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { k: "Streak", v: "5 days" },
            { k: "Skills improved", v: "3" },
            { k: "New badges", v: "1" },
          ].map((i) => (
            <div key={i.k} className="rounded-xl bg-white p-5 shadow">
              <p className="text-gray-600">{i.k}</p>
              <p className="text-2xl font-bold">{i.v}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
