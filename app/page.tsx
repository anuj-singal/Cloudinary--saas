"use client";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { motion } from "framer-motion";
import Link from "next/link";
import LinksSection from "@/components/LinkSection";

export default function HomePage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* Hero */}
      <HeroSection />
              
      {/* Features */}
      <FeaturesSection />

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-cyan-800 via-blue-900 to-purple-900 py-30 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg mb-6"
        >
          Transform Your Media Instantly           
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed"
        >
          Compress videos, remove backgrounds, apply filters, and watermark images all in one place. 
          Cloudinary Studio makes media processing fast, easy, and professional.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/home"
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg font-semibold text-lg"
          >
            Go to Home →
          </Link>
        </motion.div>
      </section>
      {/* Quick Links / Resources */}
      <LinksSection />
    </main>
  );
}
