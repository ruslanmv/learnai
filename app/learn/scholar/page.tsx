import LearnerShell from "@/components/learn/shared/LearnerShell";
import StageHero from "@/components/learn/stage/StageHero";

export default function ScholarPage() {
  return (
    <LearnerShell
      title="Scholar Exam Prep"
      subtitle="Data-driven study planning and mastery"
      badge="Ages 16–18"
      tone="focused"
    >
      <div className="space-y-6">
        <StageHero
          title="Math Exam Preparation"
          description="Focus weak areas first with teach-until-learned repetition."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-semibold">Weak Areas</h2>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>Trigonometry: 42%</li>
              <li>Algebra: 68%</li>
              <li>Probability: 75%</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-semibold">Recommended next session</h2>
            <p className="mt-2 text-gray-700">
              Trigonometry: sine/cosine basics with guided correction loop.
            </p>
            <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-white">
              Start 25-min session
            </button>
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}
