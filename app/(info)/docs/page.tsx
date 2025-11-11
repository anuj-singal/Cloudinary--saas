"use client";

import React, { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "image-tools", label: "Image Tools" },
  { id: "video-tools", label: "Video Tools" },
  { id: "api-reference", label: "API Reference" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Highlight active section while scrolling
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

  // Smooth scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
      setMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-base-100 border-r border-base-300 p-6 z-30 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">Docs</h2>
          <button
            onClick={() => setMenuOpen(false)}
            className="lg:hidden btn btn-ghost btn-square btn-sm"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeSection === sec.id
                  ? "bg-primary text-primary-content shadow-md"
                  : "hover:bg-base-200 text-base-content"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 btn btn-ghost btn-square"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 px-6 sm:px-10 pt-20 pb-16 space-y-32">
        {/* Getting Started */}
        <section id="getting-started" className="scroll-mt-24">
          <h1 className="text-4xl font-bold mb-4">🚀 Getting Started</h1>
          <p className="text-lg text-base-content/80 leading-relaxed">
            Welcome to <span className="font-semibold text-primary">Cloudinary Studio</span> Docs.  
            Here you’ll learn how to set up and use each tool efficiently.
          </p>

          <div className="mt-6 space-y-3">
            <p>1️⃣ Clone the repo or visit the deployed app.</p>
            <p>2️⃣ Sign in using Clerk for authentication.</p>
            <p>3️⃣ Navigate to any tool (e.g., Watermark, Video Compress) from the sidebar.</p>
            <p>4️⃣ Upload your image or video and apply transformations instantly.</p>
          </div>
        </section>

        {/* Image Tools */}
        <section id="image-tools" className="scroll-mt-24">
          <h2 className="text-3xl font-bold mb-3">🖼️ Image Tools</h2>
          <p className="text-base text-base-content/80 mb-4">
            The image toolkit helps you edit, optimize, and personalize your visuals with ease.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Watermark:</strong> Add custom text or logo watermark to protect your brand.</li>
            <li><strong>Image Filters:</strong> Apply aesthetic filters and color tones.</li>
            <li><strong>Format Conversion:</strong> Convert between PNG, JPG, and WEBP effortlessly.</li>
            <li><strong>Background Removal:</strong> Instantly remove backgrounds with AI precision.</li>
          </ul>
        </section>

        {/* Video Tools */}
        <section id="video-tools" className="scroll-mt-24">
          <h2 className="text-3xl font-bold mb-3">🎥 Video Tools</h2>
          <p className="text-base text-base-content/80 mb-4">
            Powerful video compression and optimization tools for creators and developers.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Video Compress:</strong> Reduce file size without quality loss.</li>
            <li><strong>Preview Player:</strong> Watch optimized versions before downloading.</li>
            <li><strong>Cloud Storage:</strong> Uploads are securely managed via Cloudinary API.</li>
          </ul>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="scroll-mt-24">
          <h2 className="text-3xl font-bold mb-3">🔌 API Reference</h2>
          <p className="text-base text-base-content/80 mb-4">
            You can integrate Cloudinary Studio features via API calls. Example endpoints:
          </p>
          <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto text-sm">
{`POST /api/upload
POST /api/convert
POST /api/compress
POST /api/watermark`}
          </pre>
          <p className="mt-3 text-sm text-base-content/70">
            All endpoints accept <code>multipart/form-data</code> and return processed file URLs.
          </p>
        </section>
      </main>
    </div>
  );
}
