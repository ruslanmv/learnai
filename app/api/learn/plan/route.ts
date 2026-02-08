import { NextResponse } from "next/server";
import { z } from "zod";
import { invokeTeacherAgent } from "@/lib/contextforge";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  agentName: z.string().min(2),
  jobDescription: z.string().min(20),
  seniority: z.string().optional(),
  focusAreas: z.array(z.string()).optional(),
  language: z.string().optional(),
});

function buildPrompt(b: z.infer<typeof BodySchema>) {
  return `
Create a concise technical interview plan for the job description.
Return ONLY valid JSON (no markdown):

{
  "plan_bullets": string[],        // 3-6 bullets
  "rubric": { "dimensions": string[], "scoring_notes": string[] },
  "opening_question": string
}

Seniority: ${b.seniority ?? "unspecified"}
Language: ${b.language ?? "en"}
Focus areas: ${JSON.stringify(b.focusAreas ?? [])}

JOB DESCRIPTION:
${b.jobDescription}
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = BodySchema.parse(await req.json());

    const result = await invokeTeacherAgent({
      agentName: body.agentName,
      interactionType: "query",
      parameters: {
        method: "message/send",
        params: {
          message: buildPrompt(body),
          kind: "plan",
        },
      },
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 400 },
    );
  }
}
