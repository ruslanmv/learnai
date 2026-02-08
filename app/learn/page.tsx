import { listTeacherAgents } from "@/lib/contextforge";
import LearnClient from "./LearnClient";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  searchParams,
}: {
  searchParams?: Promise<{ agent?: string }>;
}) {
  const params = await (searchParams ?? Promise.resolve({} as { agent?: string }));
  const agents = await listTeacherAgents();
  const options = agents.map((a) => ({
    name: a.name,
    label: a.name
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: a.description,
  }));

  return (
    <LearnClient
      agents={options.length ? options : [{ name: "", label: "No AI teachers configured" }]}
      defaultAgent={params?.agent}
    />
  );
}
