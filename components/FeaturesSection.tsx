"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Background Replace",
    video: "/background_replace.mp4",
    description:
      "Replace or customize image and video backgrounds seamlessly using advanced AI.",
  },
  {
    title: "Background Removal",
    video: "/background_removal.mp4",
    description:
      "Automatically remove backgrounds from images or videos with pixel-perfect precision.",
  },
  {
    title: "Video Compression",
    video: "/compress_size.mp4",
    description:
      "Compress your videos to reduce size while keeping the highest quality possible.",
  },
  {
    title: "Image Filters",
    video: "/image_filter.mp4",
    description:
      "Apply professional-grade filters and effects to enhance your visuals instantly.",
  },
  {
    title: "Video Preview",
    video: "/video_preview.mp4",
    description:
      "Generate quick, lightweight previews for large video files — perfect for sharing or showcasing.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative bg-black text-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`relative flex flex-col md:flex-row items-center gap-12 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Video Section */}
            <div className="relative w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <video
                src={feature.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-3xl opacity-80 hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 space-y-5">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                {feature.title}
              </h2>
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Soft background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-black pointer-events-none blur-3xl" />
    </section>
  );
}
