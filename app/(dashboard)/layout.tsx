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
  Cloud,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

// -----------------------------
// Logo component (Animated Gradient)
// -----------------------------
function Logo({ theme }: { theme?: string }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer select-none">
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 12 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className={`rounded-full p-1`}
      >
        <Cloud
          className={`w-8 h-8 ${theme === "dark" ? "text-sky-400" : "text-sky-600"}`}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        className="text-2xl font-extrabold leading-tight"
      >
        <span
          className="bg-clip-text text-transparent font-extrabold"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 45%, #06b6d4 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Cloudinary
        </span>{" "}
        <span className="text-sm ml-1 text-gray-600 dark:text-gray-300 font-semibold">Studio</span>
      </motion.h1>
    </div>
  );
}

// -----------------------------
// Sidebar items
// -----------------------------
const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home" },
  { href: "/social-share", icon: Share2Icon, label: "Social" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
  { href: "/image-filters", icon: ImagePlus, label: "Image Filters" },
  { href: "/format-convert", icon: Recycle, label: "Convert" },
  { href: "/watermark", icon: Droplet, label: "Watermark" },
  { href: "/bg-removal", icon: Palette, label: "BG Remove" },
];

// -----------------------------
// Layout
// -----------------------------
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  // initialize theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const handleThemeToggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* SIDEBAR */}
      <aside className={`hidden lg:flex lg:flex-col w-72 px-4 py-6 gap-6 border-r border-gray-200 dark:border-slate-700 bg-opacity-60`}> 
        <div className="flex items-center justify-between">
          <div onClick={() => router.push("/")}>
            <Logo theme={theme} />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-base-200 dark:hover:bg-slate-800 transition"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-auto mt-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                      active
                        ? "bg-gradient-to-r from-sky-500/20 to-violet-500/20 shadow-inner text-sky-600"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? "text-sky-600" : ""}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pt-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-sky-400/20">
                <Image src={user.imageUrl} alt={user.username || "user"} width={44} height={44} className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">{user.username || user.firstName || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user.emailAddresses?.[0]?.emailAddress}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Not signed in</div>
          )}

          <div className="mt-4 flex gap-2">
            <button onClick={handleThemeToggle} className="flex-1 btn btn-ghost">
              {theme === "light" ? <MoonIcon className="w-4 h-4 mr-2" /> : <SunIcon className="w-4 h-4 mr-2" />}
              <span className="text-sm">{theme === "light" ? "Dark" : "Light"}</span>
            </button>
            {user && (
              <button onClick={handleSignOut} className="flex-1 btn btn-outline text-sm">
                <LogOutIcon className="w-4 h-4 mr-2" /> Sign out
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md">
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center" onClick={() => router.push("/")}> 
              <Logo theme={theme} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-sm text-gray-500">Workspace</div>
              <div className="px-3 py-1 rounded-full text-xs bg-sky-100/50 dark:bg-slate-800">Cloudinary Studio</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={handleThemeToggle} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                {theme === "light" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/profile')}>
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <Image src={user.imageUrl} alt={user.username || 'user'} width={36} height={36} className="object-cover" />
                  </div>
                </div>
              ) : (
                <Link href="/sign-in" className="text-sm font-medium text-sky-600">Sign in</Link>
              )}
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md">
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Example hero / action area */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-slate-700">
                {/* Upload + preview area placeholder */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Media Workspace</h2>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-outline">Upload</button>
                    <button className="btn btn-primary">New</button>
                  </div>
                </div>

                <div className="h-96 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">No media uploaded yet</p>
                    <p className="text-xs">Drag & drop files here or click Upload</p>
                  </div>
                </div>
              </div>

              <aside className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-slate-700">
                <h3 className="text-md font-semibold mb-3">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button className="w-full btn btn-ghost justify-start">Compress Image</button>
                  <button className="w-full btn btn-ghost justify-start">Convert Format</button>
                  <button className="w-full btn btn-ghost justify-start">Remove Background</button>
                  <button className="w-full btn btn-ghost justify-start">Add Watermark</button>
                </div>
              </aside>
            </section>

            {/* Feature cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Image Compression", desc: "Fast lossless & lossy compression" },
                { title: "Video Preview", desc: "Stream previews with format conversion" },
                { title: "Filters & Effects", desc: "Color grading and presets" },
                { title: "Background Removal", desc: "AI-powered BG removal" },
                { title: "Watermarking", desc: "Text & image watermarking" },
                { title: "Format Conversion", desc: "WebP, AVIF, MP4, MOV etc." },
              ].map((card) => (
                <div key={card.title} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                  <h4 className="font-semibold mb-2">{card.title}</h4>
                  <p className="text-sm text-gray-500 mb-4">{card.desc}</p>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline">Open</button>
                    <button className="btn btn-sm btn-primary">Try</button>
                  </div>
                </div>
              ))}
            </section>

            {/* children route content */}
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r z-40 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <Logo theme={theme} />
            <button onClick={() => setSidebarOpen(false)} className="p-2">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>
      )}
    </div>
  );
}
