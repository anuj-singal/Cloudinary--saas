"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  SunIcon,
  MoonIcon,
  XIcon,
  ImagePlus,
  Recycle,
  Droplet,
  Palette,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/components/logo";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
  { href: "/image-filters", icon: ImagePlus, label: "Image Filter" },
  { href: "/format-convert", icon: Recycle, label: "Convert Format" },
  { href: "/watermark", icon: Droplet, label: "Watermark" },
  { href: "/bg-removal", icon: Palette, label: "Background Removal" },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-base-200 to-base-300 shadow-2xl border-r border-base-300 z-40 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo + Close/Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-base-300/80">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="scale-125">
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-2">
  
            {/* Close (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden btn btn-ghost btn-square btn-sm hover:bg-base-300"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-primary to-primary/70 text-primary-content shadow-md"
                    : "hover:bg-base-100 hover:shadow-sm text-base-content"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform ${
                    pathname === item.href
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* SIGN OUT (anchored bottom) */}
        {user && (
          <div className="mt-auto p-4 border-t border-base-300/50">
            <button
              onClick={handleSignOut}
              className="w-full btn btn-outline border-error text-error hover:bg-error hover:text-error-content transition-all duration-200 shadow-sm hover:shadow-lg font-semibold"
            >
              <LogOutIcon className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-72">
        {/* FIXED NAVBAR (desktop only) */}
        <header className="hidden lg:flex fixed top-0 left-0 lg:left-72 right-0 h-16 bg-base-100/80 backdrop-blur-md border-b border-base-300/40 items-center justify-between px-4 sm:px-8 z-30 shadow-sm">
          {/* Left - Docs Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/docs")}
              className="btn btn-sm btn-primary shadow-md hover:scale-105 transition-transform"
            >
              <LayoutDashboardIcon className="w-4 h-4 mr-2" /> Docs
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle (visible + to left of Upload) */}
            <button
              onClick={handleThemeToggle}
              className="btn btn-circle btn-ghost btn-sm border border-base-300 hover:bg-base-300"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="w-4 h-4" />
              ) : (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {/* Upload Button */}
            <button
              onClick={() => router.push("/video-upload")}
              className="btn btn-sm btn-accent rounded-full shadow-sm hover:scale-105 transition-transform flex items-center gap-2"
              title="Go to Video Upload"
            >
              <UploadIcon className="w-4 h-4" />
              <span>Upload</span>
            </button>

            {/* User info */}
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full relative overflow-hidden">
                    <Image
                      src={user.imageUrl}
                      alt="user"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-base-content">
                  {user.primaryEmailAddress?.emailAddress ||
                    user.emailAddresses[0]?.emailAddress ||
                    "user@example.com"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* MOBILE TOPBAR - minimal */}
        <header className="flex lg:hidden fixed top-0 left-0 right-0 h-14 bg-base-100 border-b border-base-300 shadow-sm items-center justify-between px-4 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-square"
          >
            {theme === "light" ? (
                <MenuIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-4 h-4 text-yellow-400" />
              )}
            
          </button>

            {/* Theme toggle (visible + to left of Upload) */}
            <button
              onClick={handleThemeToggle}
              className="btn btn-circle btn-ghost btn-sm border border-base-300  hover:bg-base-300"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="w-4 h-4" />
              ) : (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              )}
            </button>

          <button
            onClick={() => router.push("/docs")}
            className="btn btn-xs btn-primary"
          >
            Docs
          </button>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">{children}</main>
      </div>
    </div>
  );
}
