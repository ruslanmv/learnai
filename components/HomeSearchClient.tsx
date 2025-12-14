"use client";

import { useState } from "react";
import { FaChalkboardTeacher, FaCreditCard, FaRobot } from "react-icons/fa";

export default function HomeSearchClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/recommend-professors", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error from server");
      }
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mx-auto flex max-w-xl flex-col gap-3 md:flex-row">
        <input
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe what you want to learn (e.g. 'Linear algebra in Italian for exam preparation')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Finding..." : "Find my professor"}
        </button>
      </form>

      {error && <p className="mx-auto max-w-lg text-center text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Suggested professors</h3>
            <div className="space-y-3">
              {result.teachers?.map((t: any) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{t.name ?? "Unknown"}</div>
                      <div className="text-xs text-gray-500">{t.subjects?.join(", ")}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-medium text-yellow-500">
                        ⭐ {Number(t.rating ?? 0).toFixed(1)}
                      </div>
                      <div className="text-gray-500">{t.hourlyRate} $/h</div>
                    </div>
                  </div>
                  <p className="line-clamp-3 text-xs text-gray-600">{t.bio}</p>
                  <div className="flex justify-end">
                    <a
                      href="/login"
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs text-white hover:bg-secondary"
                    >
                      <FaChalkboardTeacher className="h-3 w-3" />
                      Book session
                    </a>
                  </div>
                </div>
              ))}
              {(!result.teachers || result.teachers.length === 0) && (
                <p className="text-sm text-gray-500">
                  No professors match this query yet. Try more general keywords.
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">AI explanation</h3>
            <div className="whitespace-pre-line rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              {result.explanation || "AI explanation not available."}
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
              <FaRobot />
              <span>
                LearnAI assistant analyzes your request and the professor profiles to build the best
                match.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
