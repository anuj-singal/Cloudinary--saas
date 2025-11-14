"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MenuIcon,
  XIcon,
  RocketIcon,
  ImageIcon,
  VideoIcon,
  PlugIcon,
  SettingsIcon,
  ShieldIcon,
  PaletteIcon,
  LayersIcon,
  CodeIcon,
  ClipboardIcon,
  CheckIcon,
  DatabaseIcon,
  NetworkIcon,
  ServerIcon,
  CloudIcon,
  KeyIcon,
} from "lucide-react";

const sections = [
  { id: "getting-started", label: "Getting Started", icon: <RocketIcon className="w-5 h-5 mr-2 text-primary" /> },
  { id: "image-tools", label: "Image Tools", icon: <ImageIcon className="w-5 h-5 mr-2 text-primary" /> },
  { id: "video-tools", label: "Video Tools", icon: <VideoIcon className="w-5 h-5 mr-2 text-primary" /> },
  { id: "api-reference", label: "API Reference", icon: <PlugIcon className="w-5 h-5 mr-2 text-primary" /> },
  { id: "advanced", label: "Advanced Integrations", icon: <SettingsIcon className="w-5 h-5 mr-2 text-primary" /> },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      for (const sec of sections) {
        const element = document.getElementById(sec.id);
        if (element && element.offsetTop <= scrollPos && element.offsetTop + element.offsetHeight > scrollPos) {
          setActiveSection(sec.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative bg-base-300 dark:bg-neutral-900 rounded-lg overflow-hidden border border-base-200 dark:border-neutral-700 group">
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-base-content/90 dark:text-neutral-200">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => handleCopy(code, id)}
        className={`absolute text-base-content top-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          copied === id
            ? "bg-green-500 text-white shadow-md"
            : "bg-base-100 dark:bg-neutral-800 border border-base-300 dark:border-neutral-700 hover:bg-base-200 dark:hover:bg-neutral-700"
        }`}
      >
        {copied === id ? (
          <>
            <CheckIcon className="w-3.5 h-3.5" /> Copied
          </>
        ) : (
          <>
            <ClipboardIcon className="w-3.5 h-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen bg-base-200 dark:bg-neutral-950 text-base-content dark:text-neutral-100 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-base-100 dark:bg-neutral-900 border-r border-base-300 dark:border-neutral-700 p-6 z-30 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">Documentation</h2>
          <button onClick={() => setMenuOpen(false)} className="lg:hidden btn btn-ghost btn-square btn-sm">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeSection === sec.id
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 dark:hover:bg-neutral-800 text-base-content dark:text-neutral-300"
              }`}
            >
              {sec.icon}
              {sec.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE MENU BUTTON */}
      <button onClick={() => setMenuOpen(true)} className="lg:hidden fixed top-4 left-4 z-20 btn btn-ghost btn-square">
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 px-6 sm:px-10 pt-20 pb-16 space-y-24">
        {/* GETTING STARTED */}
        <motion.section
          id="getting-started"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 border border-base-300 dark:border-neutral-700 rounded-2xl p-8 bg-base-100 dark:bg-neutral-900 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <RocketIcon className="w-6 h-6 mr-3 text-primary" />
            <h1 className="text-3xl font-bold">Getting Started</h1>
          </div>

          <p className="text-base mb-4 leading-relaxed text-base-content/80 dark:text-neutral-400">
            Cloudinary Studio empowers you to transform, compress, and manage media directly in your browser.
            Whether you're building a SaaS, portfolio, or automation platform — this is your modern foundation.
          </p>

          <h3 className="font-semibold text-lg mt-6 mb-2">Quick Start</h3>
          <ul className="list-disc pl-6 space-y-2 text-base-content/80 dark:text-neutral-400">
            <li>Sign in using Clerk authentication.</li>
            <li>Upload or paste a Cloudinary media URL.</li>
            <li>Select a transformation tool — Watermark, Compress, Convert, etc.</li>
            <li>Preview results and download instantly.</li>
          </ul>

          <h3 className="font-semibold text-lg mt-6 mb-3">Local Setup</h3>
          <CodeBlock
            id="code1"
            code={`git clone https://github.com/anuj-singal/Cloudinary--saas.git
cd Cloudinary--saas
npm install
npm run dev`}
          />
        </motion.section>

        {/* IMAGE TOOLS */}
        <motion.section
          id="image-tools"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 border border-base-300 dark:border-neutral-700 rounded-2xl p-8 bg-base-100 dark:bg-neutral-900 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <ImageIcon className="w-6 h-6 mr-3 text-primary" />
            <h2 className="text-3xl font-bold">Image Tools</h2>
          </div>

          <p className="mb-4 text-base-content/80 dark:text-neutral-400">
            Enhance and optimize your images with Cloudinary’s powerful transformation features — directly inside your app.
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="flex items-center font-semibold text-lg mb-2">
                <ShieldIcon className="w-5 h-5 mr-2 text-primary" /> Watermark
              </h3>
              <p>Add text or logo overlays to secure your media with adjustable opacity and placement.</p>
            </div>
            <div>
              <h3 className="flex items-center font-semibold text-lg mb-2">
                <PaletteIcon className="w-5 h-5 mr-2 text-primary" /> Filters & Adjustments
              </h3>
              <p>Apply blur, brightness, contrast, or color tints for visual consistency.</p>
            </div>
            <div>
              <h3 className="flex items-center font-semibold text-lg mb-2">
                <LayersIcon className="w-5 h-5 mr-2 text-primary" /> Background Removal
              </h3>
              <p>Remove or replace backgrounds automatically using Cloudinary AI.</p>
            </div>
          </div>
        </motion.section>

        {/* VIDEO TOOLS */}
        <motion.section
          id="video-tools"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 border border-base-300 dark:border-neutral-700 rounded-2xl p-8 bg-base-100 dark:bg-neutral-900 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <VideoIcon className="w-6 h-6 mr-3 text-primary" />
            <h2 className="text-3xl font-bold">Video Tools</h2>
          </div>

          <p className="mb-4 text-base-content/80 dark:text-neutral-400">
            Transform and optimize videos for web performance using Cloudinary’s intelligent video processing APIs.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-base-content/80 dark:text-neutral-400">
            <li>Automatic video compression and resizing.</li>
            <li>Generate thumbnails and short previews dynamically.</li>
            <li>Convert formats for optimal delivery (MP4, WebM, etc.).</li>
          </ul>
        </motion.section>

        {/* API REFERENCE */}
        <motion.section
          id="api-reference"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 border border-base-300 dark:border-neutral-700 rounded-2xl p-8 bg-base-100 dark:bg-neutral-900 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <PlugIcon className="w-6 h-6 mr-3 text-primary" />
            <h2 className="text-3xl font-bold">API Reference</h2>
          </div>

          <p className="mb-4 text-base-content/80 dark:text-neutral-400">
            Integrate programmatically with Cloudinary-SaaS APIs for uploads, transformations, and retrieval.
          </p>

          <CodeBlock
            id="code2"
            code={`POST /api/upload
Authorization: Bearer <token>

{
  "file": "<base64 or URL>",
  "transform": "compress"
}`}
          />

          <p className="mt-3 text-base-content/70 dark:text-neutral-500">
            All routes are secured via Clerk authentication tokens.
          </p>
        </motion.section>

        {/* ADVANCED INTEGRATIONS */}
        <motion.section
          id="advanced"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 border border-base-300 dark:border-neutral-700 rounded-2xl p-8 bg-base-100 dark:bg-neutral-900 shadow-sm"
        >
          <div className="flex items-center mb-6">
            <SettingsIcon className="w-6 h-6 mr-3 text-primary" />
            <h2 className="text-3xl font-bold">Advanced Integrations</h2>
          </div>

          <p className="mb-4 text-base-content/80 dark:text-neutral-400">
            Extend the functionality with additional integrations and backend logic.
          </p>

          <ul className="space-y-3 text-base-content/80 dark:text-neutral-400">
            <li className="flex items-center gap-2"><DatabaseIcon className="w-5 h-5 text-primary" /> Prisma ORM for database management.</li>
            <li className="flex items-center gap-2"><NetworkIcon className="w-5 h-5 text-primary" /> Webhooks for Cloudinary upload callbacks.</li>
            <li className="flex items-center gap-2"><ServerIcon className="w-5 h-5 text-primary" /> Next.js API routes for custom transformations.</li>
            <li className="flex items-center gap-2"><CloudIcon className="w-5 h-5 text-primary" /> Cloudinary Admin API for media automation.</li>
            <li className="flex items-center gap-2"><KeyIcon className="w-5 h-5 text-primary" /> Secure environment variables & key handling.</li>
          </ul>
        </motion.section>
      </main>
    </div>
  );
}
