"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white flex flex-col justify-center">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />

      {/* Subtle floating glows */}
      <div className="absolute -top-40 left-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full -translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          Cloudinary Studio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-8 text-xl sm:text-2xl max-w-2xl text-gray-300 leading-relaxed"
        >
          AI-powered <span className="text-cyan-400 font-semibold">media workspace </span>  
          to <span className="text-blue-400">compress, enhance, and transform </span>  
          your images and videos — effortlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/home"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg font-semibold"
          >
            Launch App →
          </Link>
          <Link
            href="#features"
            scroll={false} // prevent Next.js default routing
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 rounded-full border border-gray-500 text-gray-300 hover:bg-white/10 transition-all duration-300 font-medium"
          >
            Explore Features
          </Link>


        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 text-sm text-gray-500 tracking-widest uppercase"
        >
          Trusted by developers. Built for creativity.
        </motion.p>
      </div>
    </section>
  );
}
