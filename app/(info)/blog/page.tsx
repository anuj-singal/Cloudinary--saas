"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenToolIcon, RocketIcon, SparklesIcon } from "lucide-react";
import { blogs } from "./data";

const iconMap = {
  RocketIcon: <RocketIcon className="w-5 h-5 text-primary" />,
  PenToolIcon: <PenToolIcon className="w-5 h-5 text-primary" />,
  SparklesIcon: <SparklesIcon className="w-5 h-5 text-primary" />,
};

export default function BlogPage() {
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
          Cloudinary Studio Blog
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          Insights, product updates, and stories from the team building the next
          generation of media SaaS tools.
        </p>
      </motion.div>

      {/* BLOG GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full"
      >
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="bg-base-100 border border-base-300 rounded-3xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="relative w-full h-48">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3 text-primary">
                {iconMap[blog.icon as keyof typeof iconMap]}
                <span className="font-semibold text-sm uppercase tracking-wide">
                  Featured
                </span>
              </div>

              {/* Fixed height area for title + desc to avoid flicker */}
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-2 min-h-[52px]">
                  {blog.title}
                </h2>
                <p className="text-base-content/70 text-sm leading-relaxed min-h-[70px]">
                  {blog.description}
                </p>
              </div>

              {/* Read more link */}
              <Link
                href={`/blog/${blog.slug}`}
                className="mt-4 inline-block text-primary font-semibold text-sm hover:underline"
              >
                Read More →
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
