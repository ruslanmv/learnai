import ProgressStars from "@/components/learn/ProgressStars";
import LearnerShell from "@/components/learn/shared/LearnerShell";
import StageHero from "@/components/learn/stage/StageHero";

export default function ExplorerPage() {
  return (
    <LearnerShell
      title="Explorer World"
      subtitle="Quest-based learning in short bursts"
      badge="Ages 7–11"
      tone="calm"
    >
      <div className="space-y-6">
        <StageHero
          title="Today’s Quest: Discover Volcanoes"
          description="Watch a short explanation, answer 3 questions, and earn a badge."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <ol className="list-decimal space-y-2 pl-6 text-gray-700">
              <li>Watch a 2-minute explain video</li>
              <li>Answer 3 mini quiz questions</li>
              <li>Get Science Explorer badge</li>
            </ol>
            <button className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-white">
              Start quest
            </button>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="font-semibold">Badge Shelf</p>
            <div className="mt-3">
              <ProgressStars earned={4} total={7} />
            </div>
          </div>
        </div>
      </div>
    </LearnerShell>
  );
}
