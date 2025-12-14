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
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <SessionProviderWrapper>
          <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white shadow-sm">
              <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-primary" />
                    <span className="text-xl font-bold text-dark">LearnAI</span>
                  </div>

                  <div className="hidden space-x-8 text-sm md:flex">
                    <a href="/" className="text-gray-600 transition-colors hover:text-primary">
                      Home
                    </a>
                    <a
                      href="/dashboard"
                      className="text-gray-600 transition-colors hover:text-primary"
                    >
                      Professors
                    </a>
                    <a
                      href="#pricing"
                      className="text-gray-600 transition-colors hover:text-primary"
                    >
                      Pricing
                    </a>
                    <a href="#about" className="text-gray-600 transition-colors hover:text-primary">
                      About
                    </a>
                  </div>

                  <div className="flex items-center space-x-4">
                    <a
                      href="/login"
                      className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
                    >
                      Get Started
                    </a>
                    <button className="text-gray-600 md:hidden">
                      <span className="sr-only">Open menu</span>☰
                    </button>
                  </div>
                </div>
              </nav>
            </header>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="mt-8 bg-dark py-12 text-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">LearnAI</h3>
                    <p className="text-sm text-gray-400">
                      Connecting students with expert professors through AI-powered matching and
                      interactive learning tools.
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">For Students</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>
                        <a href="/dashboard" className="transition-colors hover:text-white">
                          Find Professors
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="transition-colors hover:text-white">
                          Book Sessions
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="transition-colors hover:text-white">
                          Learning Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/login" className="transition-colors hover:text-white">
                          Payment Options
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">For Professors</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>
                        <a href="/login" className="transition-colors hover:text-white">
                          Register to Teach
                        </a>
                      </li>
                      <li>
                        <a href="/login" className="transition-colors hover:text-white">
                          Payment Setup
                        </a>
                      </li>
                      <li>
                        <a href="/classroom/demo" className="transition-colors hover:text-white">
                          Teaching Tools
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="transition-colors hover:text-white">
                          Profile Management
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Contact</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>support@learnai.com</li>
                      <li>+1 (555) 123-4567</li>
                      <li className="mt-4 flex space-x-4 text-lg">
                        <a href="#" className="transition-colors hover:text-white">
                          f
                        </a>
                        <a href="#" className="transition-colors hover:text-white">
                          t
                        </a>
                        <a href="#" className="transition-colors hover:text-white">
                          in
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-xs text-gray-400">
                  <p>© 2024 LearnAI. All rights reserved. Platform fee: 10%</p>
                </div>
              </div>
            </footer>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
