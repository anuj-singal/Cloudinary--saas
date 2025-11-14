"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenToolIcon, RocketIcon, SparklesIcon } from "lucide-react";
import { blogs } from "./data";

const iconMap: Record<string, React.ReactNode> = {
  RocketIcon: <RocketIcon className="w-4 h-4 text-primary" />,
  PenToolIcon: <PenToolIcon className="w-4 h-4 text-primary" />,
  SparklesIcon: <SparklesIcon className="w-4 h-4 text-primary" />,
};

export default function BlogPage() {
  useEffect(() => {
    console.log("blogs imported:", blogs);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 transition-colors duration-500 bg-base-200 text-base-content">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mb-14"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Cloudinary Studio Blog
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          Insights, updates, and stories from the team building the next
          generation of media SaaS tools.
        </p>
      </motion.div>

      {/* BLOG GRID */}
      {(!blogs || blogs.length === 0) ? (
        <div className="text-center py-20">
          <p className="text-xl font-medium mb-4">No blogs found.</p>
          <p className="text-sm text-base-content/70 mb-6">
            Check your <code>data.ts</code> import or restart your dev server.
          </p>
        </div>
      ) : (
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
              className="bg-base-100 border border-base-300 rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative w-full h-40">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  {iconMap[blog.icon as string] ?? (
                    <RocketIcon className="w-4 h-4 text-primary" />
                  )}
                  <span className="font-semibold text-xs uppercase tracking-wide">
                    Featured
                  </span>
                </div>

                {/* Title + Description */}
                <h2 className="text-base-content font-bold mb-1 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-base-content/70 text-xs leading-relaxed line-clamp-3">
                  {blog.description}
                </p>

                {/* Read More */}
                <Link
                  href={`/blog/${blog.slug}`}
                  className="mt-4 inline-block text-primary font-semibold text-xs hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
          
        </motion.div>
      )}

      <Link
            href="/"
            className="inline-block mt-9 px-8 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white"
          >
            Back to Dashboard
          </Link>

    </div>
  );
}
