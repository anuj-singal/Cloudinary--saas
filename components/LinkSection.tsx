"use client";

import { motion } from "framer-motion";

const links = [
  { title: "Docs", url: "/docs", description: "Get started with guides and tutorials." },
  { title: "Pricing", url: "/pricing", description: "Check out our plans and free tier limits." },
  { title: "Blog", url: "/blog", description: "Latest updates, tips, and feature highlights." },
  { title: "Support", url: "/support", description: "Contact our team for help and guidance." },
  { title: "About Us", url: "/about", description: "Learn more about Cloudinary Studio and its mission." },
  { title: "FAQ", url: "/faq", description: "Frequently asked questions about features and usage." },
];


export default function LinksSection() {
  return (
    <section className="bg-black/90 py-2 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 gap-2 text-white">
        {links.map((link, i) => (
          <motion.a
            key={link.title}
            href={link.url}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group p-6 rounded-2xl hover:bg-gray-800/50 transition-colors shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
              {link.title} →
            </h3>
            <p className="text-gray-300 text-sm leading-snug">{link.description}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
