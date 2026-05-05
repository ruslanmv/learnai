import { LEARNING_STAGES } from "@/lib/learn/stages";

const TEACHERS = [
  { name: "Milo the Owl", focus: "Ages 3–6", style: "Playful stories and counting" },
  { name: "Luna Story Teacher", focus: "Ages 7–11", style: "Reading and imagination" },
  { name: "Ada Jr.", focus: "Ages 12–15", style: "Coding missions and logic" },
  { name: "Professor Turing", focus: "Ages 16+", style: "CS and AI mastery" },
  { name: "Sofia Digital Helper", focus: "Senior", style: "Patient digital literacy guidance" },
];

export default function TeachersPage() {
  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">AI Teacher Gallery</h1>
        <p className="mt-2 text-gray-600">Choose a persona based on learner stage and style.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {TEACHERS.map((t) => (
            <div key={t.name} className="rounded-xl border p-5">
              <h2 className="text-xl font-semibold">{t.name}</h2>
              <p className="text-gray-700">{t.focus}</p>
              <p className="mt-1 text-sm text-gray-600">{t.style}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl bg-gray-50 p-5">
          <p className="font-semibold">Supported learning stages:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LEARNING_STAGES.map((s) => (
              <span key={s.stage} className="rounded-full border bg-white px-3 py-1 text-sm">
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
