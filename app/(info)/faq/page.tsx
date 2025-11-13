// app/docs/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon, MailIcon, LinkedinIcon, GithubIcon } from "lucide-react";

const faqs = [
  {
    question: "What is Cloudinary Studio?",
    answer:
      "Cloudinary Studio is a developer-first SaaS platform to manage, transform, and optimize media with ease. We focus on simplicity, speed, and AI-powered automation.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes! Our free tier allows unlimited uploads and transformations with access to core features. No credit card required.",
  },
  {
    question: "How do I integrate Cloudinary Studio with my project?",
    answer:
      "You can integrate using our API or SDKs. The dashboard provides step-by-step guides and code examples for Next.js, React, and Node.js projects.",
  },
  {
    question: "Is my media secure?",
    answer:
      "Absolutely. Cloudinary Studio uses secure authentication, role-based access, and encrypted storage to ensure your media stays safe.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "Cloudinary Studio supports all common image, video, and document formats, including JPEG, PNG, GIF, MP4, PDF, and more.",
  },
  {
    question: "Can I preview my images?",
    answer:
      "Yes! You can preview your images after using the tools and before downloading. You can also preview your videos.",
  },
  {
    question: "Does Cloudinary Studio support AI-based transformations?",
    answer:
      "Yes! Use AI-powered features like automatic background removal, smart cropping, and image enhancement to streamline workflows.",
  },
  {
    question: "Where can I get help or support?",
    answer:
      "You can reach out via email, LinkedIn, or GitHub. We also provide documentation and guides in the FAQ section.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-20 bg-base-200 text-base-content">
      {/* HEADER */}
      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          FAQ's
        </h1>
        <p className="text-base-content/70 text-lg leading-relaxed">
          Answers to frequently asked questions about Cloudinary Studio, our features, and usage.
        </p>
      </div>

      {/* FAQ CARDS */}
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-base-100 border border-base-300 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center text-left font-semibold text-lg hover:text-primary transition-colors duration-200"
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUpIcon className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-primary" />
              )}
            </button>
            <div
              className={`mt-4 text-base-content/70 leading-relaxed transition-all duration-300 ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      {/* ASK A QUESTION */}
      <div className="mt-16 text-center max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Have a question?</h2>
        <p className="text-base-content/70 mb-6">
          Feel free to reach out directly. I'm happy to answer your queries!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="mailto:anujsingal203@gmail.com"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white"
          >
            <MailIcon className="w-5 h-5" /> Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/anujsingal"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 text-white"
          >
            <LinkedinIcon className="w-5 h-5" /> LinkedIn
          </a>
          <a
            href="https://github.com/anuj-singal"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-500 text-white"
          >
            <GithubIcon className="w-5 h-5" /> GitHub
          </a>
        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
