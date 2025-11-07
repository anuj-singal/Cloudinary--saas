// app/docs/page.tsx
"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-5xl font-bold mb-6">faq's - Coming Soon 🚀</h1>
      <p className="text-gray-300 text-lg mb-8 text-center max-w-xl">
        This section will have all the faq's for Cloudinary Studio.
      </p>
      <Link
        href="/"
        className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 transition-transform duration-300 shadow-lg font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
