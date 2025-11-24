import "./globals.css";
import type { ReactNode } from "react";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "LearnAI - Connect with Expert Professors",
  description:
    "AI-powered platform connecting students with expert professors for personalized 1-on-1 learning sessions with integrated whiteboard and payment systems.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen bg-gray-50`}>
        <SessionProviderWrapper>
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
              <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg" />
                    <span className="text-xl font-bold text-dark">LearnAI</span>
                  </div>

                  <div className="hidden md:flex space-x-8 text-sm">
                    <a href="/" className="text-gray-600 hover:text-primary transition-colors">
                      Home
                    </a>
                    <a href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                      Professors
                    </a>
                    <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                      Pricing
                    </a>
                    <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
                      About
                    </a>
                  </div>

                  <div className="flex items-center space-x-4">
                    <a
                      href="/login"
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
                    >
                      Get Started
                    </a>
                    <button className="md:hidden text-gray-600">
                      <span className="sr-only">Open menu</span>
                      ☰
                    </button>
                  </div>
                </div>
              </nav>
            </header>

            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-dark text-white py-12 mt-8">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">LearnAI</h3>
                    <p className="text-gray-400 text-sm">
                      Connecting students with expert professors through AI-powered matching and interactive learning
                      tools.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">For Students</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>
                        <a href="/dashboard" className="hover:text-white transition-colors">
                          Find Professors
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="hover:text-white transition-colors">
                          Book Sessions
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="hover:text-white transition-colors">
                          Learning Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/login" className="hover:text-white transition-colors">
                          Payment Options
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">For Professors</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>
                        <a href="/login" className="hover:text-white transition-colors">
                          Register to Teach
                        </a>
                      </li>
                      <li>
                        <a href="/login" className="hover:text-white transition-colors">
                          Payment Setup
                        </a>
                      </li>
                      <li>
                        <a href="/classroom/demo" className="hover:text-white transition-colors">
                          Teaching Tools
                        </a>
                      </li>
                      <li>
                        <a href="/dashboard" className="hover:text-white transition-colors">
                          Profile Management
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>support@learnai.com</li>
                      <li>+1 (555) 123-4567</li>
                      <li className="flex space-x-4 mt-4 text-lg">
                        <a href="#" className="hover:text-white transition-colors">
                          f
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                          t
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                          in
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-xs">
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
