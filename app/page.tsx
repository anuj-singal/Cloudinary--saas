"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted text-foreground">
      {/* SaaS Name Header */}
      <header className="absolute top-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight"
        >
          🚀 Streamify SaaS
        </motion.h1>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-col items-center justify-center text-center space-y-6 px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold">
          Welcome to <span className="text-primary">Streamify</span>
        </h2>
        <p className="text-muted-foreground max-w-md">
          Upload, manage, and share videos effortlessly — powered by Cloudinary and Next.js.
        </p>

        <button
          onClick={() => router.push("/home")}
          className="mt-4 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium shadow hover:opacity-90 transition"
        >
          Go to Home
        </button>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Streamify SaaS. All rights reserved.
      </footer>
    </div>
  );
}
