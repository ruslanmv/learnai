export default function ParentPage() {
  return (
    <main className="min-h-screen bg-rose-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Today Sofia learned</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-700">
            <li>Counted numbers 1–5</li>
            <li>Answered 4 of 5 correctly</li>
            <li>Needs more practice with number 4</li>
            <li>Enjoyed animal examples</li>
          </ul>
          <p className="mt-4 font-medium">Recommended tomorrow: Count jungle animals with Milo.</p>
        </div>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Parent Controls</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              "Session length",
              "Allowed subjects",
              "Language",
              "Voice on/off",
              "Content safety level",
              "Daily reminder",
              "Export progress",
            ].map((c) => (
              <button key={c} className="rounded-lg border bg-gray-50 p-3 text-left">
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
