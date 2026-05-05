import LearnerShell from "@/components/learn/shared/LearnerShell";
import StageHero from "@/components/learn/stage/StageHero";

export default function BuilderPage() {
  return (
    <LearnerShell
      title="Builder Missions"
      subtitle="Project-first learning with hints and feedback"
      badge="Ages 12–15"
      tone="focused"
    >
      <div className="space-y-6">
        <StageHero
          title="Mission: Build a calculator in Python"
          description="Learn variables, write a function, fix a bug, explain your approach."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="font-semibold">Mission Steps</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
              <li>Learn variables</li>
              <li>Write your first function</li>
              <li>Fix one bug with hints</li>
              <li>Explain what changed</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="font-semibold">Hint Panel</h3>
            <p className="mt-2 text-gray-700">
              Ask for a hint first. Unlock full solution only after a genuine attempt.
            </p>
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}
