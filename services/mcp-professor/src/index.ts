import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import OpenAI from "openai";

/**
 * Professor Interview MCP Server
 *
 * A single-agent MCP server that runs structured technical interviews
 * based on a job description. Stateless (client sends history), and
 * OpenAI-compatible (works with Ollama + Llama 3 via baseURL).
 *
 * ENV:
 *  - LLM_BASE_URL=http://localhost:11434/v1   (Ollama OpenAI-compatible)
 *  - LLM_API_KEY=ollama                       (any string for local)
 *  - LLM_MODEL=llama3:8b
 */

const llm = new OpenAI({
  apiKey: process.env.LLM_API_KEY || "ollama",
  baseURL: process.env.LLM_BASE_URL || "http://localhost:11434/v1",
});

const MODEL = process.env.LLM_MODEL || "llama3:8b";

/**
 * System prompt for the "Professor Nova" interviewer agent.
 */
function systemPrompt(jobDescription: string, extra?: Record<string, unknown>) {
  const focus = extra?.focusAreas
    ? `Focus areas: ${JSON.stringify(extra.focusAreas)}`
    : "";
  const seniority = extra?.seniority
    ? `Seniority: ${String(extra.seniority)}`
    : "";
  const language = extra?.language
    ? `Language: ${String(extra.language)}`
    : "Language: English";

  return `
You are "Professor Nova", an expert technical interviewer and coach.
Your job: run a structured interview based ONLY on the job description and common industry expectations.

STYLE RULES:
- Ask exactly ONE question at a time.
- Keep questions short.
- After each user answer:
  1) Give 2-4 bullet feedback max (specific, concrete)
  2) Give a score 0-10 (integer)
  3) Ask the next best question
- No long lectures. No generic motivation text.

OUTPUT FORMAT (MUST be valid JSON):
{
  "feedback_bullets": string[],
  "score_0_10": number,
  "next_question": string,
  "tags": string[]
}

JOB DESCRIPTION:
${jobDescription}

${seniority}
${focus}
${language}
`.trim();
}

/** Call LLM and require JSON response */
async function callJson(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
  const resp = await llm.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages,
    response_format: { type: "json_object" } as any,
  });

  const text = resp.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(text);
  } catch {
    return {
      feedback_bullets: ["(Parser note) Model did not return valid JSON."],
      score_0_10: 5,
      next_question: String(text).slice(0, 400),
      tags: ["parse_error"],
    };
  }
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "professor-interview-server",
  version: "1.0.0",
});

/**
 * Tool 1: Create interview plan (3-6 bullets) + rubric from job description
 */
server.tool(
  "professor.create_interview_plan",
  {
    jobDescription: z.string().min(20),
    seniority: z.string().optional(),
    language: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),
  },
  async ({ jobDescription, seniority, language, focusAreas }) => {
    const prompt = `
Create a short interview plan for this job description.
Return valid JSON:
{
  "plan_bullets": string[],       // 3-6 bullets
  "rubric": {
    "dimensions": string[],       // e.g. system design, leadership, ML ops
    "scoring_notes": string[]     // short guidelines
  },
  "opening_question": string
}
Keep text concise.
`.trim();

    const resp = await llm.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are an expert interview designer. Return ONLY JSON.",
        },
        {
          role: "user",
          content: `${prompt}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nSeniority:${seniority ?? ""}\nLanguage:${language ?? ""}\nFocus:${JSON.stringify(focusAreas ?? [])}`,
        },
      ],
    });

    const text = resp.choices?.[0]?.message?.content ?? "{}";
    return { content: [{ type: "text" as const, text }] };
  }
);

/**
 * Tool 2: Start interview - produce the first question + rubric reminder
 */
server.tool(
  "professor.start_interview",
  {
    jobDescription: z.string().min(20),
    seniority: z.string().optional(),
    language: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),
  },
  async (args) => {
    const opening = await callJson([
      { role: "system", content: systemPrompt(args.jobDescription, args) },
      {
        role: "user",
        content:
          "Start the interview now. Since there is no previous answer, feedback_bullets should be empty, score_0_10 should be 0, and next_question should be the first interview question.",
      },
    ]);

    opening.feedback_bullets ??= [];
    opening.score_0_10 ??= 0;

    return {
      content: [{ type: "text" as const, text: JSON.stringify(opening) }],
    };
  }
);

/**
 * Tool 3: Next turn - given history + user answer, return feedback + next question
 *
 * history is a compact array of turns: [{ "q": "...", "a": "...", "score": 7 }]
 */
server.tool(
  "professor.next_turn",
  {
    jobDescription: z.string().min(20),
    history: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
          score: z.number().int().min(0).max(10).optional(),
        })
      )
      .default([]),
    userAnswer: z.string().min(1),
    seniority: z.string().optional(),
    language: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),
  },
  async (args) => {
    const shortHistory = JSON.stringify(args.history).slice(0, 6000);

    const result = await callJson([
      { role: "system", content: systemPrompt(args.jobDescription, args) },
      {
        role: "user",
        content: `INTERVIEW HISTORY (JSON): ${shortHistory}`,
      },
      { role: "user", content: `USER ANSWER: ${args.userAnswer}` },
      {
        role: "user",
        content:
          "Give feedback + score + next_question in the required JSON format.",
      },
    ]);

    return {
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
    };
  }
);

/**
 * Tool 4: Wrap up - summary + next session + mini test (5 questions)
 */
server.tool(
  "professor.wrap_up",
  {
    jobDescription: z.string().min(20),
    history: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
          score: z.number().int().optional(),
        })
      )
      .default([]),
    seniority: z.string().optional(),
    language: z.string().optional(),
  },
  async ({ jobDescription, history, seniority, language }) => {
    const prompt = `
Return valid JSON:
{
  "what_you_learned": string[],       // 3-6 bullets
  "next_session": string[],           // 3 bullets
  "mini_test": { "questions": string[] } // exactly 5 questions
}
Keep concise.
`.trim();

    const resp = await llm.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON-only summarizer for interview coaching.",
        },
        {
          role: "user",
          content: `${prompt}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nSeniority:${seniority ?? ""}\nLanguage:${language ?? ""}\n\nHISTORY:\n${JSON.stringify(history).slice(0, 9000)}`,
        },
      ],
    });

    const text = resp.choices?.[0]?.message?.content ?? "{}";
    return { content: [{ type: "text" as const, text }] };
  }
);

// Start stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
