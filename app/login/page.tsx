"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
    setLoading(false);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-dark">Welcome to LearnAI</h1>
        <p className="mb-4 text-sm text-gray-600">
          Login with Google or your email to access your dashboard.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span className="text-lg text-red-500">G</span>
          <span>Continue with Google</span>
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-3 text-sm">
          <div>
            <label className="mb-1 block text-xs text-gray-700">Email address</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Continue with Email"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
