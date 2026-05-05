import ProgressStars from "@/components/learn/ProgressStars";
import TeacherAvatar from "@/components/learn/TeacherAvatar";
import VoiceButton from "@/components/learn/VoiceButton";
import LearnerShell from "@/components/learn/shared/LearnerShell";
import StageHero from "@/components/learn/stage/StageHero";

export default function KidsPage() {
  return (
    <LearnerShell
      title="Little Learner Room"
      subtitle="One activity at a time, voice-first, parent-safe"
      badge="Ages 3–6"
      tone="playful"
    >
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <StageHero
          title="Milo says: Can you count the apples?"
          description="Tap one answer. Great job gets stars."
        />
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <TeacherAvatar name="Milo the Owl" emoji="🦉" />
          <p className="mt-4 text-5xl">🍎 🍎 🍎</p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className="rounded-2xl bg-primary py-4 text-2xl font-bold text-white">
                {n}
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <VoiceButton label="Read question" />
            <button className="rounded-xl bg-gray-100 px-5 py-3 font-semibold">Parent Exit</button>
          </div>
          <div className="mt-5 flex justify-center">
            <ProgressStars earned={3} total={5} />
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}
