import LearningStageCard from "@/components/learn/LearningStageCard";
import { LEARNING_STAGES } from "@/lib/learn/stages";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary to-secondary py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">YourTeacher by LearnAI</p>
          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Your personal AI teacher from first words to PhD.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg md:text-2xl">
            One education system. Different interfaces for each stage of life.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-dark md:text-4xl">
          Choose your learning journey
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LEARNING_STAGES.map((stage) => (
            <LearningStageCard key={stage.stage} {...stage} />
          ))}
        </div>
      </section>
    </main>
  );
}
