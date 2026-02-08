"use client";

import { useMemo, useState } from "react";

type AgentOption = {
  name: string;
  label: string;
  description?: string;
};

type Plan = {
  plan_bullets?: string[];
  rubric?: { dimensions?: string[]; scoring_notes?: string[] };
  opening_question?: string;
};

type Turn = { q: string; a: string; score?: number };

export default function LearnClient({ agents, defaultAgent }: { agents: AgentOption[]; defaultAgent?: string }) {
  const options = useMemo(() => agents, [agents]);
  const [agentName, setAgentName] = useState(defaultAgent || options?.[0]?.name || "");
  const [jobDescription, setJobDescription] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);

  const [history, setHistory] = useState<Turn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPlan() {
    setLoading(true);
    setError(null);
    setPlan(null);
    setHistory([]);
    setCurrentQuestion("");

    try {
      const res = await fetch("/api/learn/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentName, jobDescription }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Plan failed");

      // ContextForge jsonrpc returns {result:{...}} OR sometimes just {...}
      const payload = data.result?.result ?? data.result;
      setPlan(payload);
      setCurrentQuestion(payload?.opening_question || "Tell me about yourself and why this role.");
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/learn/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          agentName,
          jobDescription,
          history,
          userAnswer: answer,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Turn failed");

      const payload = data.result?.result ?? data.result;
      const score: number | undefined = typeof payload?.score_0_10 === "number" ? payload.score_0_10 : undefined;
      const nextQ: string = String(payload?.next_question || "Next question?");

      setHistory((h) => [...h, { q: currentQuestion, a: answer, score }]);
      setAnswer("");
      setCurrentQuestion(nextQ);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold text-dark">LearnAI</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-dark">Interview Coach</h1>
        <p className="mt-2 text-gray-600">Pick a professor and paste the job description.</p>

        <div className="mt-6 rounded-xl bg-white p-4 shadow">
          <label className="block text-sm font-semibold text-gray-700">Professor</label>
          <select
            className="mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          >
            {options.map((a) => (
              <option key={a.name} value={a.name}>
                {a.label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-semibold text-gray-700">Job description</label>
          <textarea
            className="mt-2 w-full rounded-lg border bg-white px-3 py-2 text-sm"
            rows={8}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              disabled={loading || jobDescription.trim().length < 20 || !agentName}
              onClick={createPlan}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Create plan
            </button>

            {error ? <span className="text-sm text-red-600">{error}</span> : null}
          </div>
        </div>

        {plan ? (
          <div className="mt-6 rounded-xl bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your plan</h2>
              <span className="text-xs text-gray-500">3-6 bullets</span>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {(plan.plan_bullets || []).slice(0, 6).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {plan ? (
          <div className="mt-6 rounded-xl bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Session</h2>
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-800">
              <span className="font-semibold">Question:</span> {currentQuestion}
            </div>

            <textarea
              className="mt-3 w-full rounded-lg border bg-white px-3 py-2 text-sm"
              rows={4}
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="mt-3 flex items-center justify-between">
              <button
                disabled={loading || !answer.trim()}
                onClick={submitAnswer}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Submit
              </button>
              <span className="text-xs text-gray-500">Turns: {history.length}</span>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
