"use client";

import Link from "next/link";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600" />
            <span className="text-xl font-bold text-gray-900">LearnAI</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link className="text-gray-600 hover:text-indigo-600" href="/">
              Home
            </Link>
            <Link className="text-gray-600 hover:text-indigo-600" href="/explore">
              Professors
            </Link>
            <a className="text-gray-600 hover:text-indigo-600" href="#pricing">
              Pricing
            </a>
            <a className="text-gray-600 hover:text-indigo-600" href="#about">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="hidden rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:inline-flex"
            >
              Explore
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-600"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
