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

function planPrompt(args: z.infer<typeof BodySchema>) {
  const { jobDescription, seniority, focusAreas, language } = args;

  return `
You are a professor that designs technical interview plans.
Return ONLY valid JSON:

{
  "plan_bullets": string[],        // 3-6 bullets
  "rubric": {
    "dimensions": string[],        // 4-8 items
    "scoring_notes": string[]      // short guidelines
  },
  "opening_question": string
}

Keep concise. No markdown. No extra keys.

Seniority: ${seniority ?? "unspecified"}
Language: ${language ?? "en"}
Focus areas: ${JSON.stringify(focusAreas ?? [])}

JOB DESCRIPTION:
${jobDescription}
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = BodySchema.parse(await req.json());

    const result = await invokeTeacherAgent({
      agentName: body.agentName,
      message: planPrompt(body),
      metadata: { type: "plan" },
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 400 },
    );
  }
}
