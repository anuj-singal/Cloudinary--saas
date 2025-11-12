// app/docs/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenIcon, WrenchIcon, CodeIcon, MessageCircleIcon } from "lucide-react";

const supportSections = [
  {
    id: 1,
    title: "Getting Started Guide",
    description: "Set up your account, connect your project, and start uploading media in minutes.",
    icon: <BookOpenIcon className="w-5 h-5 text-primary" />,
    link: "#",
  },
  {
    id: 2,
    title: "Troubleshooting Tips",
    description: "Step-by-step solutions for common errors, upload issues, or transformation problems.",
    icon: <WrenchIcon className="w-5 h-5 text-primary" />,
    link: "#",
  },
  {
    id: 3,
    title: "API & Integration Guides",
    description: "Integrate Cloudinary Studio into your workflow using our APIs, SDKs, and docs.",
    icon: <CodeIcon className="w-5 h-5 text-primary" />,
    link: "#",
  },
  {
    id: 4,
    title: "Contact Support",
    description: "Need further assistance? Reach out to our support team directly.",
    icon: <MessageCircleIcon className="w-5 h-5 text-primary" />,
    link: "#",
  },
];

export default function SupportPage() {
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
          Support & Help Center 🚀
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          Everything you need to get started, troubleshoot, and optimize your media workflow with Cloudinary Studio.
        </p>
      </motion.div>

      {/* SUPPORT GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full"
      >
        {supportSections.map((section) => (
          <motion.div
            key={section.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="bg-base-100 border border-base-300 rounded-3xl shadow-lg overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300"
          >
            {/* ICON */}
            <div className="flex items-center gap-2 mb-3 text-primary">
              {section.icon}
              <span className="font-semibold text-sm uppercase tracking-wide">Support</span>
            </div>

            {/* TITLE + DESCRIPTION */}
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2 min-h-[48px]">{section.title}</h2>
              <p className="text-base-content/70 text-sm leading-relaxed min-h-[64px]">
                {section.description}
              </p>
            </div>

            {/* LINK BUTTON */}
            <Link
              href={section.link}
              className="mt-4 inline-block text-primary font-semibold text-sm hover:underline"
            >
              Read More →
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-16"
      >
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white"
        >
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
