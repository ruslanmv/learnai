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
  sessionId: z.string().optional(),
});

function turnPrompt(args: z.infer<typeof TurnSchema>) {
  const {
    jobDescription,
    history,
    userAnswer,
    seniority,
    focusAreas,
    language,
  } = args;

  return `
You are "Professor Nova", an expert technical interviewer for the role described below.

RULES:
- Ask EXACTLY ONE question at a time.
- After the candidate answer, give 2-4 feedback bullets (max), a score 0-10 (integer), then the next question.
- Keep everything short.
- Return ONLY valid JSON in this exact schema:

{
  "feedback_bullets": string[],
  "score_0_10": number,
  "next_question": string,
  "tags": string[]
}

Seniority: ${seniority ?? "unspecified"}
Language: ${language ?? "en"}
Focus areas: ${JSON.stringify(focusAreas ?? [])}

JOB DESCRIPTION:
${jobDescription}

INTERVIEW HISTORY (JSON):
${JSON.stringify(history).slice(0, 7000)}

CANDIDATE ANSWER:
${userAnswer}
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = TurnSchema.parse(await req.json());

    const result = await invokeTeacherAgent({
      agentName: body.agentName,
      message: turnPrompt(body),
      sessionId: body.sessionId,
      metadata: { type: "interview_turn" },
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 400 },
    );
  }
}
