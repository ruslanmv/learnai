"use client";

import Link from "next/link";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" />
              <span className="text-xl font-bold text-dark">LearnAI</span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/explore" className="text-gray-600 hover:text-primary transition-colors">
                Professors
              </Link>
              <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* IMPORTANT: Explore is public */}
              <Link
                href="/explore"
                className="hidden rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:inline-flex"
              >
                Explore
              </Link>

              {/* Login optional: modal only on click */}
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-secondary transition-colors"
              >
                Get Started
              </button>

              <button className="md:hidden text-gray-600" aria-label="Open menu">
                ☰
              </button>
            </div>
          </div>
        </nav>
      </header>

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
