"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function HeaderActions() {
  const { data: session, status } = useSession();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user is in guest mode
    if (typeof window !== "undefined") {
      const guestMode = localStorage.getItem("guestMode");
      setIsGuest(guestMode === "true" && !session);
    }
  }, [session]);

  // If loading, show placeholder
  if (status === "loading") {
    return (
      <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200"></div>
    );
  }

  // If authenticated user
  if (session) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
      >
        Dashboard
      </Link>
    );
  }

  // If guest mode
  if (isGuest) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">🎭 Guest Mode</span>
        <Link
          href="/register"
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
        >
          Sign Up Free
        </Link>
      </div>
    );
  }

  // Default - not logged in, not guest
  return (
    <Link
      href="/login"
      className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
    >
      Get Started
    </Link>
  );
}
