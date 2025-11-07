"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Background Replace",
    video: "/background_replace.mp4",
    description: [
      "Replace or customize image and video backgrounds seamlessly with AI.",
      "Perfect for presentations, creative projects, or social media content.",
    ],
  },
  {
    title: "Background Removal",
    video: "/background_removal.mp4",
    description: [
      "Automatically remove backgrounds from images or videos with pixel-perfect precision.",
      "Save time and achieve professional-quality results instantly.",
    ],
  },
  {
    title: "Video Compression",
    video: "/compress_size.mp4",
    description: [
      "Compress your videos to reduce file size while keeping high quality.",
      "Share faster and save storage without sacrificing clarity.",
    ],
    tvBorder: true,
  },
  {
    title: "Image Filters",
    images: [
      "/image_filter1.png",
      "/image_filter2.png",
      "/image_filter3.png",
      "/image_filter4.png",
    ],
    description: [
      "Apply cinematic filters and tone adjustments with one click.",
      "Compare multiple filter styles side-by-side to find the perfect look.",
    ],
    grid: true,
  },
  {
    title: "Image Crop",
    images: ["/image_crop.png"],
    description: [
      "Crop images to any aspect ratio effortlessly.",
      "Perfect for social media posts, banners, or profile pictures.",
    ],
    largeImage: true,
  },
  {
    title: "Watermarking",
    images: ["/watermark.png", "/watermark2.png"],
    description: [
      "Protect your images or videos by adding text or logo watermarks.",
      "Customizable placement, size, and opacity to match your brand.",
    ],
    stacked: true,
  },
  {
    title: "Video Preview",
    video: "/video_preview.mp4",
    description: [
      "Generate quick, lightweight previews for large videos.",
      "Ideal for sharing drafts or showcasing content without full download.",
    ],
    tvBorder: true,
    darker: true, // make last feature slightly darker
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative bg-black text-white overflow-hidden" id="features">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-black/80 to-black" />

      <div className="max-w-7xl mx-auto px-6 py-32 space-y-32 relative z-10">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`relative ${feature.darker ? "opacity-70" : ""}`}
          >
            {/* Scroll-reveal glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute -inset-10 bg-cyan-500/10 blur-3xl rounded-full"
            />

            <div
              className={`relative flex flex-col md:flex-row items-center gap-12 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Media Section */}
              <div className="relative w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex justify-center items-center">
                {/* Video */}
                {feature.video && (
                  <div className="relative w-full h-[300px] md:h-[400px] flex justify-center items-center">
                    <video
                      src={feature.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain rounded-3xl"
                    />
                    {feature.tvBorder && (
                      <img
                        src="/tv.png"
                        alt="TV Border"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />
                    )}
                  </div>
                )}

                {/* Image grid (2x2) */}
                {feature.images && feature.grid && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 justify-center">
                    {feature.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${feature.title} ${idx + 1}`}
                        className="rounded-xl object-cover w-full shadow-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Large Image (Crop) */}
                {feature.images && feature.largeImage && (
                  <img
                    src={feature.images[0]}
                    alt={feature.title}
                    className="rounded-xl object-cover w-full md:w-96 shadow-lg"
                  />
                )}

                {/* Stacked images (Watermark) */}
                {feature.images && feature.stacked && (
                  <div className="flex flex-col gap-6 p-4 justify-center items-center">
                    {feature.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${feature.title} ${idx + 1}`}
                        className="rounded-xl object-cover w-80 md:w-96 shadow-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-3xl" />
              </div>

              {/* Text Section */}
              <div className="w-full md:w-1/2 space-y-2">
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-md leading-snug">
                  {feature.title}
                </h2>
                {feature.description.map((desc, idx) => (
                  <p
                    key={idx}
                    className="text-lg text-gray-300 max-w-lg leading-tight"
                  >
                    {desc}
                  </p>
                ))}
              </div>
            </div>

            {/* Divider line */}
            {i < features.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-full h-px mt-20 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[150%] bg-gradient-to-b from-cyan-500/10 via-blue-600/10 to-black pointer-events-none blur-3xl" />
    </section>
  );
}
