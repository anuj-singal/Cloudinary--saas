"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SunIcon, MoonIcon } from "lucide-react";
import Logo from "@/components/logo";

const infoLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
];

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage once
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  }, []);

  return(
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md flex flex-col md:flex-row justify-between items-center px-6 py-4 md:py-3 transition-colors">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href="/"
            className="text-2xl font-extrabold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
          >
            <Logo/>
          </Link>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <MoonIcon className="w-5 h-5 text-gray-700" />
            ) : (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 md:mt-0">
          {infoLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg font-medium text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* SPACER for fixed header */}
      <div className="h-24 md:h-20" />

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-8 mt-auto border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Cloudinary Studio. All rights reserved.</p>
          <div className="flex gap-4 text-sm flex-wrap justify-center md:justify-end">
            {infoLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-500 dark:hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
} 