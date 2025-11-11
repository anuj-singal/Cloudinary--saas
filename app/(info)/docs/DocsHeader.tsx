"use client";

import { useEffect, useState } from "react";
import { MenuIcon, SunIcon, MoonIcon } from "lucide-react";

export default function DocsHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") || "light";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-base-100/90 backdrop-blur-md border-b border-base-300 h-14 flex items-center justify-between px-4 sm:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden btn btn-ghost btn-square">
          <MenuIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-primary tracking-tight">Cloudinary Studio Docs</h1>
      </div>

      <button
        onClick={toggleTheme}
        className="btn btn-circle btn-ghost btn-sm border border-base-300 hover:bg-base-300"
        title="Toggle theme"
      >
        {theme === "light" ? (
          <MoonIcon className="w-4 h-4" />
        ) : (
          <SunIcon className="w-4 h-4 text-yellow-400" />
        )}
      </button>
    </header>
  );
}
