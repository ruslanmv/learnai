"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaTimes } from "react-icons/fa";

export function GuestBanner() {
  const { data: session } = useSession();
  const [isGuest, setIsGuest] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user is in guest mode
    const guestMode = localStorage.getItem("guestMode");
    const dismissed = sessionStorage.getItem("guestBannerDismissed");

    setIsGuest(guestMode === "true" && !session);
    setIsDismissed(dismissed === "true");
  }, [session]);

  useEffect(() => {
    // Clear guest mode if user logs in
    if (session) {
      localStorage.removeItem("guestMode");
      setIsGuest(false);
    }
  }, [session]);

  function dismissBanner() {
    sessionStorage.setItem("guestBannerDismissed", "true");
    setIsDismissed(true);
  }

  function exitGuestMode() {
    localStorage.removeItem("guestMode");
    setIsGuest(false);
  }

  if (!isGuest || isDismissed) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎭</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">You&apos;re browsing as a Guest</p>
              <p className="text-xs opacity-90">
                Explore all features freely. Sign up when you&apos;re ready to book sessions and save your progress.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/register"
              onClick={exitGuestMode}
              className="hidden rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-gray-100 sm:block"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              onClick={exitGuestMode}
              className="hidden rounded-lg border border-white px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-orange-600 sm:block"
            >
              Login
            </Link>
            <button
              onClick={dismissBanner}
              className="rounded p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20"
              aria-label="Dismiss banner"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="mt-2 flex space-x-2 sm:hidden">
          <Link
            href="/register"
            onClick={exitGuestMode}
            className="flex-1 rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-orange-600 transition-colors hover:bg-gray-100"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            onClick={exitGuestMode}
            className="flex-1 rounded-lg border border-white px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-orange-600"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
