"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen bg-base-200 transition-all duration-500">
      {/* FIXED NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-base-100/70 shadow-sm border-b border-base-300 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left - Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-base-content hover:text-primary transition-colors flex items-center gap-2"
          >
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            {infoLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md font-medium text-sm text-base-content hover:bg-base-300 hover:text-primary transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Home + Dashboard buttons */}
            <Link
              href="/home"
              className="px-3 py-1.5 rounded-lg bg-base-300 hover:bg-base-200 text-base-content flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <HomeIcon className="w-4 h-4" /> Home
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/80 text-primary-content flex items-center gap-2 text-sm font-medium shadow-sm transition-colors"
            >
              <LayoutDashboardIcon className="w-4 h-4" /> Dashboard
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-full bg-base-300 hover:bg-base-200 transition-colors shadow-sm"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <MoonIcon className="w-5 h-5 text-base-content" />
              ) : (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md bg-base-300 hover:bg-base-200 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <XIcon className="w-5 h-5 text-base-content" />
            ) : (
              <MenuIcon className="w-5 h-5 text-base-content" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-base-100/90 backdrop-blur-md border-t border-base-300 px-6 py-4 flex flex-col gap-3">
            {infoLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block w-full text-base-content font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-wrap gap-3 mt-3">
              <Link
                href="/home"
                onClick={() => setMenuOpen(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-base-300 hover:bg-base-200 text-center text-base-content text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-primary hover:bg-primary/80 text-primary-content text-center text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-base-300 hover:bg-base-200 text-sm font-medium text-base-content"
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SPACER */}
      <div className="h-20" />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <div className="bg-base-100/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-base-300 transition-all">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-base-100/80 backdrop-blur-md border-t border-base-300 py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-base-content/80">
            © {new Date().getFullYear()} Cloudinary Studio — Built with &hearts; by
            Anuj Singal
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-s text-base-content/90">
            {infoLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
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
