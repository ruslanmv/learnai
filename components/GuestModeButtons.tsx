"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function GuestModeButtons() {
  const router = useRouter();

  function exploreAsGuest() {
    // Set guest mode in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("guestMode", "true");
    }
    // Redirect to dashboard to browse professors
    router.push("/dashboard");
  }

  return (
    <div className="mb-4 flex flex-col justify-center gap-4 md:flex-row">
      <Link
        href="/login"
        className="rounded-lg bg-white px-8 py-4 font-semibold text-primary transition-colors hover:bg-gray-100"
      >
        Start Learning Today
      </Link>
      <button
        onClick={exploreAsGuest}
        className="rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-primary"
      >
        🎭 Explore as Guest
      </button>
    </div>
  );
}
