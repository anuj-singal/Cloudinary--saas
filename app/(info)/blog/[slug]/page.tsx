import Image from "next/image";
import Link from "next/link";
import { blogs } from "../data";

interface BlogDetailProps {
  params: { slug: string };
}

export default function BlogDetailPage({ params }: BlogDetailProps) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold mb-6">Blog Not Found</h1>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 rounded-full bg-primary text-primary-content font-semibold hover:bg-primary/80 transition"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-base-200 text-base-content">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <div className="relative w-full max-w-3xl h-80 mb-6 rounded-2xl overflow-hidden">
        <Image src={blog.image} alt={blog.title} fill className="object-cover" />
      </div>
      <p className="text-base-content/70 text-lg max-w-3xl mb-8">{blog.description}</p>
      <Link
        href="/blog"
        className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold hover:scale-105 transition-transform"
      >
        Back to Blogs
      </Link>
    </div>
  );
}
