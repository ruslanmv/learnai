import VoiceButton from "@/components/learn/VoiceButton";
import LearnerShell from "@/components/learn/shared/LearnerShell";
import StageHero from "@/components/learn/stage/StageHero";

export default function SeniorPage() {
  return (
    <LearnerShell
      title="Senior Learner Mode"
      subtitle="Large text, clear actions, patient help"
      badge="Older adults"
      tone="calm"
    >
      <div className="space-y-6 text-lg">
        <StageHero
          title="Practical Learning Today"
          description="Focus on technology safety, daily digital skills, and memory practice."
        />
        <div className="rounded-2xl bg-white p-8 shadow">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Use WhatsApp safely",
              "Avoid scam messages",
              "Online banking safety",
              "Memory exercise",
            ].map((l) => (
              <button
                key={l}
                className="rounded-xl border-2 border-gray-300 p-5 text-left text-2xl"
              >
                {l}
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <VoiceButton label="Explain slowly" />
            <button className="rounded-xl bg-gray-200 px-6 py-3 text-xl font-semibold">
              Repeat explanation
            </button>
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}
