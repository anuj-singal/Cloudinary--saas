import Image from "next/image";
import Link from "next/link";
import {
  RocketIcon,
  WrenchIcon,
  LightbulbIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { blogs } from "../data";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Blog Not Found</h1>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>
    );
  }

  const related = blogs.filter((b) => b.id !== blog.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col items-center px-6 py-16">
      {/* HEADER */}
      <div className="max-w-4xl text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          {blog.title}
        </h1>
        <p className="text-base-content/70 text-lg">
          Written by <span className="font-semibold">Cloudinary Studio Team</span> • November 2025
        </p>
      </div>

      {/* IMAGE */}
      <div className="relative w-full max-w-3xl h-[200px] rounded-2xl overflow-hidden shadow-xl mb-12">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover object-center hover:scale-105 transition-transform duration-700"
          priority
        />
      </div>

      {/* BODY CONTENT */}
      <article className="prose prose-lg prose-invert max-w-3xl text-justify leading-relaxed">
        {blog.slug === "ai-powered-uploads" && (
          <>
            <p className="text-lg text-base-content/80">
              <span className="float-left text-5xl font-extrabold mr-2 text-primary">T</span>
              he rise of AI has completely transformed how we manage and optimize media. At
              Cloudinary Studio, we took this a step further by building an AI-powered upload
              pipeline that automatically analyzes, tags, and enhances media the moment it’s added.
            </p>

            <h2 className="text-3xl font-bold mt-10 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-primary" /> How AI Enhances Uploads
            </h2>
            <p className="text-base-content/70">
              When you upload an image, our system uses computer vision models to detect objects,
              adjust color balance, and even remove noise or unwanted backgrounds automatically.
              These optimizations ensure your images look perfect across every device and platform.
            </p>

            <blockquote className="border-l-4 border-primary pl-4 italic text-base-content/70 my-8">
              “AI should empower developers — not complicate their workflows.”
            </blockquote>

            <p className="text-base-content/70">
              With AI-powered uploads, developers save hours on manual optimization and can focus on
              creating better user experiences. The system learns from every upload, becoming
              smarter and faster with time.
            </p>
          </>
        )}

        {blog.slug === "saas-dashboard-experience" && (
          <>
            <p className="text-lg text-base-content/80">
              <span className="float-left text-5xl font-extrabold mr-2 text-primary">B</span>
              uilding a SaaS dashboard that feels both powerful and lightweight is an art. We wanted
              to make Cloudinary Studio’s dashboard intuitive for developers — everything from user
              management to media analytics needed to be lightning-fast and beautifully simple.
            </p>

            <h2 className="text-3xl font-bold mt-10 mb-4 flex items-center gap-2">
              <WrenchIcon className="w-6 h-6 text-primary" /> Designing for Developers
            </h2>
            <p className="text-base-content/70">
              We started with user empathy: every button, animation, and color tone was crafted to
              make a developer feel in control. The dashboard runs on Next.js with Clerk for
              authentication and Tailwind for a minimal, clean interface.
            </p>

            <blockquote className="border-l-4 border-primary pl-4 italic text-base-content/70 my-8">
              “Good design disappears when it works perfectly.”
            </blockquote>

            <p className="text-base-content/70">
              With real-time stats, light/dark mode, and seamless navigation, our dashboard gives
              developers everything they need — no fluff, just performance.
            </p>
          </>
        )}

        {blog.slug === "media-optimization-philosophy" && (
          <>
            <p className="text-lg text-base-content/80">
              <span className="float-left text-5xl font-extrabold mr-2 text-primary">A</span>
              t Cloudinary Studio, our core philosophy is simple: media optimization should “just
              work.” Developers shouldn’t waste time resizing, converting, or reformatting assets
              manually. Our goal has always been to automate media delivery intelligently.
            </p>

            <h2 className="text-3xl font-bold mt-10 mb-4 flex items-center gap-2">
              <RocketIcon className="w-6 h-6 text-primary" /> Automation First
            </h2>
            <p className="text-base-content/70">
              We’ve built an automation pipeline that detects file type, target device, and network
              conditions — then delivers the most optimized version in milliseconds. This ensures
              fast load times without sacrificing quality.
            </p>

            <blockquote className="border-l-4 border-primary pl-4 italic text-base-content/70 my-8">
              “If media slows your site down, your stack is broken — not your content.”
            </blockquote>

            <p className="text-base-content/70">
              Our developer-first philosophy means minimal setup, maximum speed. With just a few
              lines of code, you can transform how your app handles media — automatically and
              intelligently.
            </p>
          </>
        )}
      </article>

      {/* RELATED POSTS */}
      <section className="max-w-6xl w-full mt-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 justify-center">
          <SparklesIcon className="w-6 h-6 text-primary" /> Related Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {related.map((item) => (
            <div
              key={item.id}
              className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-base-content/70 text-sm mb-4">
                  {item.description}
                </p>
                <Link
                  href={`/blog/${item.slug}`}
                  className="text-primary font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BACK BUTTON */}
      <div className="mt-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Blogs
        </Link>
      </div>
    </div>
  );
}
