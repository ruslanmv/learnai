import type { ReactNode } from "react";
import Link from "next/link";

type LearnerShellProps = {
  title: string;
  subtitle: string;
  badge?: string;
  tone?: "playful" | "calm" | "focused" | "professional";
  children: ReactNode;
};

const toneClasses: Record<NonNullable<LearnerShellProps["tone"]>, string> = {
  playful: "from-amber-50 to-orange-100",
  calm: "from-sky-50 to-indigo-100",
  focused: "from-slate-50 to-gray-100",
  professional: "from-zinc-50 to-stone-200",
};

export default function LearnerShell({
  title,
  subtitle,
  badge,
  tone = "focused",
  children,
}: LearnerShellProps) {
  return (
    <main className={`min-h-screen bg-gradient-to-b ${toneClasses[tone]}`}>
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              YourTeacher by LearnAI
            </p>
            <h1 className="text-xl font-semibold text-dark">{title}</h1>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {badge ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {badge}
              </span>
            ) : null}
            <Link
              href="/progress"
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Progress
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">{children}</section>
    </main>
  );
}
