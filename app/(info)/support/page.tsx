"use client";

import { MailIcon, GithubIcon, LinkedinIcon, UploadCloudIcon, CreditCardIcon, SettingsIcon, HelpCircleIcon, RocketIcon } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const categories = [
    {
      title: "Upload & Media Issues",
      description:
        "Having trouble uploading files or using transformations? Learn how to handle media uploads, transformations, and delivery smoothly.",
      icon: <UploadCloudIcon className="w-6 h-6 text-primary" />,
    },
    {
      title: "Account & Authentication",
      description:
        "Manage your Cloudinary Studio account, reset your credentials, or configure authentication with your preferred provider.",
      icon: <SettingsIcon className="w-6 h-6 text-primary" />,
    },
    {
      title: "Billing & Plans",
      description:
        "Understand pricing tiers, upgrade or downgrade your plan, and manage payment methods with transparency.",
      icon: <CreditCardIcon className="w-6 h-6 text-primary" />,
    },
    {
      title: "Developer & API Support",
      description:
        "Need API help or facing integration issues? Get technical guidance and explore examples from our open-source projects.",
      icon: <RocketIcon className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-20 bg-base-200 text-base-content">
      {/* HEADER */}
      <div className="text-center mb-16 max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cloudinary Studio Support
        </h1>
        <p className="text-lg text-base-content/70 leading-relaxed">
          We're here to help you make the most of Cloudinary Studio — from setup to scaling.
          Browse common support topics or reach out directly for personalized assistance.
        </p>
      </div>

      {/* SUPPORT CATEGORIES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl w-full mb-20">
        {categories.map((item, index) => (
          <div
            key={index}
            className="bg-base-100 rounded-2xl border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-start"
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* CONTACT SECTION */}
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl font-extrabold mb-4">Still Need Help?</h2>
        <p className="text-base text-base-content/70 mb-6">
          Our support team is always ready to assist you.  
          You can reach out through any of the following platforms:
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="mailto:anujsingal203@gmail.com"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-content hover:bg-primary/80 transition"
          >
            <MailIcon className="w-4 h-4" /> Gmail
          </Link>

          <Link
            href="https://github.com/anuj-singal"
            target="_blank"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-base-300 hover:bg-base-200 transition"
          >
            <GithubIcon className="w-4 h-4" /> GitHub
          </Link>

          <Link
            href="https://linkedin.com/in/anujsingal"
            target="_blank"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-base-300 hover:bg-base-200 transition"
          >
            <LinkedinIcon className="w-4 h-4 text-blue-500" /> LinkedIn
          </Link>
        </div>
      </div>

      {/* FOOTNOTE */}
      <p className="text-sm text-base-content/60 mt-12 text-center">
        © {new Date().getFullYear()} Cloudinary Studio — All rights reserved.
      </p>
    </div>
  );
}
