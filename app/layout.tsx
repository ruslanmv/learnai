import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { GuestBanner } from "@/components/GuestBanner";
import { HeaderActions } from "@/components/HeaderActions";
import Link from "next/link";

export const metadata = {
  title: "LearnAI - Connect with Expert Professors",
  description:
    "AI-powered platform connecting students with expert professors for personalized 1-on-1 learning sessions with integrated whiteboard and payment systems.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <SessionProviderWrapper>
          <GuestBanner />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
