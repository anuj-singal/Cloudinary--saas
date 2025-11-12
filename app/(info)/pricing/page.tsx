"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ZapIcon,
  RocketIcon,
  ShieldIcon,
  CloudIcon,
} from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 transition-colors duration-500 bg-base-200 text-base-content">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1
          className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight"
          style={{ lineHeight: "1.2" }}
        >
          Cloudinary Studio Pricing
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          Transform, compress, and manage your media —{" "}
          <span className="text-primary font-semibold">
            absolutely free
          </span>{" "}
          for now. <br />
          We believe in empowering developers before monetizing the platform.
        </p>
      </motion.div>

      {/* PRICING CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full max-w-lg text-center bg-base-100 border border-base-300 rounded-3xl shadow-xl p-10"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400/10 to-purple-600/10 blur-2xl opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Free Tier</h2>
          <p className="text-base-content/70 mb-6">
            Start building without limits — no credit card required.
          </p>

          <h3 className="text-6xl font-extrabold mb-4">
            $0{" "}
            <span className="text-lg text-base-content/60 font-medium">
              / forever
            </span>
          </h3>

          <ul className="text-base-content/80 text-left space-y-3 mb-10 max-w-sm mx-auto">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-primary" />
              Unlimited uploads and transformations
            </li>
            <li className="flex items-center gap-2">
              <ZapIcon className="w-5 h-5 text-primary" />
              AI-powered optimization tools
            </li>
            <li className="flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-primary" />
              Secure authentication with Clerk
            </li>
            <li className="flex items-center gap-2">
              <CloudIcon className="w-5 h-5 text-primary" />
              Integrated Cloudinary API support
            </li>
            <li className="flex items-center gap-2">
              <RocketIcon className="w-5 h-5 text-primary" />
              Future access to pro features
            </li>
          </ul>

          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* FUTURE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-16 max-w-2xl text-base-content/70"
      >
        <p className="leading-relaxed">
          <span className="text-primary font-semibold">Coming Soon:</span>{" "}
          Premium plans with faster processing, higher limits, and collaboration
          tools. Your free projects will remain free forever.
        </p>
      </motion.div>
    </div>
  );
}
