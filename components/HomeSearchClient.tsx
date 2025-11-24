"use client";

import { useState } from "react";
import { FaRobot, FaChalkboardTeacher, FaCreditCard } from "react-icons/fa";

export default function HomeSearchClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
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
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto"
      >
        <input
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe what you want to learn (e.g. 'Linear algebra in Italian for exam preparation')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent text-white px-6 py-3 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Finding..." : "Find my professor"}
        </button>
      </form>

      {error && (
        <p className="text-center text-sm text-red-500 max-w-lg mx-auto">
          {error}
        </p>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Suggested professors
            </h3>
            <div className="space-y-3">
              {result.teachers?.map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{t.name ?? "Unknown"}</div>
                      <div className="text-xs text-gray-500">
                        {t.subjects?.join(", ")}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-yellow-500 font-medium">
                        ⭐ {Number(t.rating ?? 0).toFixed(1)}
                      </div>
                      <div className="text-gray-500">
                        {t.hourlyRate} $/h
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {t.bio}
                  </p>
                  <div className="flex justify-end">
                    <a
                      href="/login"
                      className="inline-flex items-center gap-1 rounded-lg bg-primary text-white text-xs px-3 py-1.5 hover:bg-secondary"
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
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              AI explanation
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
              {result.explanation || "AI explanation not available."}
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
              <FaRobot />
              <span>
                LearnAI assistant analyzes your request and the professor profiles to build the best match.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
