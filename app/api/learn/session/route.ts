import { NextResponse } from "next/server";
import { z } from "zod";
import { invokeTeacherAgent } from "@/lib/contextforge";

export const dynamic = "force-dynamic";

const TurnSchema = z.object({
  agentName: z.string().min(2),
  jobDescription: z.string().min(20),
  history: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
        score: z.number().int().min(0).max(10).optional(),
      }),
    )
    .default([]),
  userAnswer: z.string().min(1),
  seniority: z.string().optional(),
  focusAreas: z.array(z.string()).optional(),
  language: z.string().optional(),
});

function buildPrompt(b: z.infer<typeof TurnSchema>) {
  return `
You are a technical interviewer.

RULES:
- Ask EXACTLY ONE question at a time.
- After the candidate answer: 2-4 feedback bullets max, a score 0-10 (integer), then the next question.
- Keep everything short.

Return ONLY valid JSON in this exact schema:
{
  "feedback_bullets": string[],
  "score_0_10": number,
  "next_question": string,
  "tags": string[]
}

Seniority: ${b.seniority ?? "unspecified"}
Language: ${b.language ?? "en"}
Focus areas: ${JSON.stringify(b.focusAreas ?? [])}

JOB DESCRIPTION:
${b.jobDescription}

INTERVIEW HISTORY (JSON):
${JSON.stringify(b.history).slice(0, 7000)}

CANDIDATE ANSWER:
${b.userAnswer}
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = TurnSchema.parse(await req.json());

    const result = await invokeTeacherAgent({
      agentName: body.agentName,
      interactionType: "query",
      parameters: {
        method: "message/send",
        params: {
          message: buildPrompt(body),
          kind: "turn",
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
