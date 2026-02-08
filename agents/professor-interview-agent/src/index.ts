import http from "node:http";
import OpenAI from "openai";

/**
 * A2A JSON-RPC agent for MCP Context Forge.
 *
 * Context Forge will send JSON-RPC requests when:
 *  - agent_type is "jsonrpc" OR endpoint_url ends with "/"
 *
 * Request shape (from ContextForge):
 * {
 *   "jsonrpc":"2.0",
 *   "method":"message/send",
 *   "params": { ... },
 *   "id":1
 * }
 *
 * We respond:
 * {
 *   "jsonrpc":"2.0",
 *   "id":1,
 *   "result": ...
 * }
 */

const PORT = Number(process.env.PORT || 9999);

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY || "ollama",
  baseURL: process.env.LLM_BASE_URL || "http://localhost:11434/v1",
});

const MODEL = process.env.LLM_MODEL || "llama3:8b";

function systemPrompt() {
  return `
You are "Professor Nova", an expert technical interviewer and coach.

RULES:
- Ask exactly ONE question at a time.
- Keep outputs concise.
- When the user asks you to return JSON, you MUST return valid JSON only.
- Never include markdown fences.
`.trim();
}

async function runLLM(message: string) {
  const resp = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt() },
      { role: "user", content: message },
    ],
  });
  return resp.choices?.[0]?.message?.content ?? "";
}

function jsonrpcResult(id: any, result: any) {
  return JSON.stringify({ jsonrpc: "2.0", id, result });
}

function jsonrpcError(id: any, code: number, message: string, data?: any) {
  return JSON.stringify({ jsonrpc: "2.0", id, error: { code, message, data } });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    try {
      const payload = JSON.parse(body || "{}");
      const id = payload?.id ?? 1;
      const method = String(payload?.method || "");
      const params = payload?.params ?? {};

      // Minimal method support
      if (method !== "message/send") {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(jsonrpcError(id, -32601, `Unknown method: ${method}`));
        return;
      }

      const message = typeof params?.message === "string" ? params.message : "";
      if (!message || message.length < 1) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(jsonrpcError(id, -32602, "Missing params.message"));
        return;
      }

      const content = await runLLM(message);

      // If the model returns JSON text, keep it as JSON; otherwise return raw.
      let result: any = content;
      try {
        result = JSON.parse(content);
      } catch {
        result = { text: content };
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(jsonrpcResult(id, result));
    } catch (e: any) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(jsonrpcError(1, -32000, "Server error", { message: e?.message }));
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Professor Interview A2A agent listening on http://localhost:${PORT}/`);
});
