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
  ScissorsLineDashed,
} from "lucide-react";
import Image from "next/image";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
  { href: "/image-filters", icon: ImagePlus, label: "Image Filter" },
  { href: "/format-convert", icon: Recycle, label: "Convert Format" },
  { href: "/watermark", icon: Droplet, label: "Watermark" },
  { href: "/video-trim", icon: ScissorsLineDashed, label: "Video Trim/crop" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    router.push("/home")
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="drawer-content flex flex-col min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        <div className="lg:hidden sticky top-0 z-40 bg-base-100/95 backdrop-blur-md border-b border-base-300/20">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-square hover:bg-base-200 transition-colors duration-200"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
              Rezio
            </h1>
            <div className="w-12"></div>
          </div>
        </div>

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="sidebar-drawer" className="drawer-overlay lg:hidden"></label>
        <aside className="w-80 h-full bg-gradient-to-b from-base-200 via-base-200 to-base-300 flex flex-col shadow-2xl border-r border-base-300/30">
          
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn btn-ghost btn-square btn-sm hover:bg-base-300"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-6 py-8 border-b border-base-300/50">
            <div
              onClick={() => router.push("/")}
              className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-all duration-300 drop-shadow-lg hover:drop-shadow-xl"
              style={{ 
                fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
                textShadow: theme === 'dark' ? '0 0 20px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(139, 92, 246, 0.2)'
              }}
            >
              Rezio
            </div>
            
            {/* Enhanced Theme Toggle Button */}
            <button
              onClick={handleThemeToggle}
              className={`relative w-12 h-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border-2 ${
                theme === 'light'
                  ? 'bg-slate-100 border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200 hover:text-white'
              }`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {theme === 'light' ? (
                  <MoonIcon className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <SunIcon className="w-5 h-5 transition-transform duration-300" />
                )}
              </div>
              
              {/* Subtle glow effect */}
              <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-amber-200/20 to-orange-200/20 opacity-0 hover:opacity-100'
                  : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 hover:opacity-100'
              }`}></div>
            </button>
          </div>

          <div className="flex-grow px-4 py-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center space-x-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg scale-105"
                      : "hover:bg-base-100 hover:shadow-md hover:scale-102 text-base-content"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${
                    pathname === item.href ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {user && (
            <div className="px-4 pb-6 border-t border-base-300/50 bg-gradient-to-r from-base-200/50 to-base-300/50">
              <div className="pt-6">
                <div className="bg-base-100 rounded-xl p-4 mb-4 shadow-sm border border-base-300/30">
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100 relative overflow-hidden">
                        <Image
                          src={user.imageUrl}
                          alt={user.username || user.emailAddresses[0].emailAddress}
                          fill
                          sizes="48px"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-base-content truncate">
                        {user.username || user.firstName || "User"}
                      </p>
                      <p className="text-xs text-base-content/60 truncate">
                        {user.emailAddresses[0].emailAddress}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="w-full btn btn-outline btn-error hover:btn-error hover:text-error-content transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span className="font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}