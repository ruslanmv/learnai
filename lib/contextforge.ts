/**
 * ContextForge Client
 *
 * Connects to MCP Context Forge to list AI teacher agents (A2A)
 * and invoke them for interview sessions.
 *
 * @module lib/contextforge
 */

import { z } from "zod";

const CF_BASE = process.env.CONTEXTFORGE_URL;
const CF_TOKEN = process.env.CONTEXTFORGE_TOKEN;
const TEACHER_TAG = process.env.CONTEXTFORGE_TEACHER_TAG || "teacher";

/**
 * ContextForge A2A agent (minimal fields for teacher catalog).
 */
export type ContextForgeA2AAgent = {
  id?: string;
  name: string;
  description?: string;
  tags?: string[];
  visibility?: string;
  enabled?: boolean;
};

function cfHeaders() {
  const h: Record<string, string> = { "content-type": "application/json" };
  if (CF_TOKEN) h.authorization = `Bearer ${CF_TOKEN}`;
  return h;
}

const A2AAgentSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  visibility: z.string().optional(),
  enabled: z.boolean().optional(),
});

/**
 * List all A2A agents tagged as "teacher" from ContextForge.
 * Returns empty array gracefully if ContextForge is not configured.
 */
export async function listTeacherAgents(): Promise<ContextForgeA2AAgent[]> {
  if (!CF_BASE) return [];

  const urls = [
    `${CF_BASE}/a2a`,
    `${CF_BASE}/a2a?tag=${encodeURIComponent(TEACHER_TAG)}`,
    `${CF_BASE}/a2a?tags=${encodeURIComponent(TEACHER_TAG)}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: cfHeaders(),
        cache: "no-store",
      });
      if (!res.ok) continue;

      const data = await res.json();

      const arr: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.agents)
            ? data.agents
            : [];

      const parsed = arr
        .map((x) => {
          const p = A2AAgentSchema.safeParse(x);
          return p.success ? p.data : null;
        })
        .filter(Boolean) as ContextForgeA2AAgent[];

      const teachers = parsed.filter((a) =>
        (a.tags || []).includes(TEACHER_TAG),
      );

      return teachers.filter((a) => a.enabled !== false);
    } catch {
      // try next url pattern
    }
  }

  return [];
}

export type InvokeA2AParams = {
  agentName: string;
  message: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Invoke an A2A agent by name (teacher agent).
 * Calls ContextForge: POST /a2a/{agent_name}/invoke
 */
export async function invokeTeacherAgent(
  params: InvokeA2AParams,
): Promise<any> {
  if (!CF_BASE) {
    throw new Error("CONTEXTFORGE_URL is not set");
  }

  const { agentName, message, sessionId, metadata } = params;

  const res = await fetch(
    `${CF_BASE}/a2a/${encodeURIComponent(agentName)}/invoke`,
    {
      method: "POST",
      headers: cfHeaders(),
      body: JSON.stringify({
        message,
        session_id: sessionId,
        metadata: metadata || {},
      }),
    },
  );

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`ContextForge invoke failed (${res.status}): ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
