import Link from "next/link";
import { LEARNING_STAGES } from "@/lib/learn/stages";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }>;
}) {
  const params = await (searchParams ?? Promise.resolve({} as { stage?: string }));
  const selected = params.stage;
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Who is learning today?</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {["My child", "Me", "My parent / older family member", "My student group"].map((item) => (
          <button
            key={item}
            className="rounded-xl border bg-white p-4 text-left hover:border-primary"
          >
            {item}
          </button>
        ))}
      </div>
      <h2 className="mt-10 text-2xl font-semibold">Choose age or level</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LEARNING_STAGES.map((stage) => (
          <Link
            key={stage.stage}
            href={`/learn?stage=${stage.stage}`}
            className={`rounded-xl border p-4 hover:border-primary ${selected === stage.stage ? "border-primary bg-indigo-50" : "bg-white"}`}
          >
            <p className="font-semibold">
              {stage.icon} {stage.title}
            </p>
            <p className="text-sm text-gray-600">{stage.age}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
