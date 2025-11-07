// components/logo.tsx
"use client";

import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none cursor-pointer">
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 12 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="rounded-full p-1"
        aria-hidden
      >
        <Cloud className="w-8 h-8 text-sky-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.95 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.18 }}
      >
        <h1 className="leading-tight">
          <span
            className="bg-clip-text text-transparent font-extrabold"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 45%, #06b6d4 100%)",
            }}
          >
            Cloudinary
          </span>
          {!compact && (
            <span className="ml-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Studio
            </span>
          )}
        </h1>
      </motion.div>
    </div>
  );
}
