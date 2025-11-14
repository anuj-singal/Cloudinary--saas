// app/docs/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserIcon, LightbulbIcon, GlobeIcon, HeartIcon, CoffeeIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 transition-colors duration-500 bg-base-200 text-base-content">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          About Cloudinary Studio 🚀
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          Cloudinary Studio is a developer-first SaaS platform empowering creators and teams to manage, transform, and optimize media effortlessly. 
          Our goal is to simplify workflows while giving full control to developers.
        </p>
      </motion.div>

      {/* FEATURES / SECTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full"
      >
        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-lg p-8 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
          <UserIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-base-content/70 leading-relaxed">
            To empower developers, startups, and creators with tools that make media handling simple, fast, and reliable. 
            We focus on accessibility and quality, ensuring even free users get the full experience.
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-lg p-8 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
          <LightbulbIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Our Philosophy</h2>
          <p className="text-base-content/70 leading-relaxed">
            Developer-first thinking, simplicity, and performance. We believe in transparency, giving our users control over their media and seamless integration with existing workflows.
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-lg p-8 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
          <GlobeIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Our Reach</h2>
          <p className="text-base-content/70 leading-relaxed">
            Cloudinary Studio is designed for developers worldwide. Whether you're a solo creator, a startup, or an enterprise team, our platform scales to fit your needs.
          </p>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-lg p-8 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
          <HeartIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Connect with Me</h2>
          <p className="text-base-content/70 leading-relaxed">
            I’m Anuj Singal, the creator behind Cloudinary Studio. Follow me on: 
            <br />
            <Link href="https://github.com/anuj-singal" target="_blank" className="text-primary hover:underline">GitHub</Link> |{" "}
            <Link href="https://linkedin.com/in/anujsingal" target="_blank" className="text-primary hover:underline">LinkedIn</Link>
          </p>
        </div>

        {/* FUN FACT / PERSONAL STORY CARD */}
        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-lg p-8 col-span-1 md:col-span-2 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
          <CoffeeIcon className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Fun Fact / My Journey</h2>
          <p className="text-base-content/70 leading-relaxed">
            Cloudinary Studio started as a small side project fueled by countless cups of coffee ☕ and a desire to simplify media handling for developers. 
            Over time, it grew into a full SaaS platform. The journey is ongoing, and the best is yet to come!
          </p>
        </div>
      </motion.div>

      {/* CTA BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16"
      >
        <Link
          href="/info/"
          className="inline-block px-8 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white"
        >
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
