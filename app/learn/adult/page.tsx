import LearnerShell from "@/components/learn/shared/LearnerShell";
import StageHero from "@/components/learn/stage/StageHero";

export default function AdultPage() {
  return (
    <LearnerShell
      title="Professional Learning Paths"
      subtitle="Certification and project outcomes"
      badge="18+"
      tone="professional"
    >
      <div className="space-y-6">
        <StageHero
          title="Track: AWS Solutions Architect"
          description="Use Learn, Practice, Exam, and Review Mistakes modes in one workflow."
        />
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-wrap gap-2">
            {["Learn", "Practice", "Exam", "Review Mistakes"].map((m) => (
              <button key={m} className="rounded-full border px-4 py-2 text-sm font-medium">
                {m}
              </button>
            ))}
          </div>
          <p className="mt-4 text-gray-700">Current weak domain: VPC Networking</p>
        </div>
      </div>
    </LearnerShell>
  );
}
