"use client";

import { useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-dark">Welcome to LearnAI</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            <span className="text-red-500 font-bold">G</span>
            <span>Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full rounded-lg bg-primary px-4 py-3 text-center font-semibold text-white hover:bg-secondary"
          >
            Continue with Email
          </Link>

          <p className="pt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up here
            </Link>
          </p>

          <p className="text-center text-xs text-gray-500">
            Login is optional — you only need it to book and save progress.
          </p>
        </div>
      </div>
    </div>
  );
}
