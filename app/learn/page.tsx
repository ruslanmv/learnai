import { redirect } from "next/navigation";
import { LearnerStage, stageToPath } from "@/lib/learn/stages";

export default async function LearnPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }>;
}) {
  const params = await (searchParams ?? Promise.resolve({} as { stage?: string }));
  const stage = (params.stage as LearnerStage | undefined) ?? "LITTLE_LEARNER";
  redirect(stageToPath(stage));
}
