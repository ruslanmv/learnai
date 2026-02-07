import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

export const metadata = {
  title: "LearnAI - Connect with Expert Professors",
  description:
    "AI-powered platform connecting students with expert professors for personalized 1-on-1 learning sessions with integrated whiteboard and payment systems.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-gray-50 antialiased">
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
