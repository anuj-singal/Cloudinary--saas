"use client";

import { useState } from "react";

export default function BgRemovalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");
    setLoading(true);
    setResultUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bgColor", bgColor);
    formData.append("bgImage", bgImage);

    try {
      const res = await fetch("/api/bg-removal", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process image");

      setResultUrl(data.secure_url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">🪄 Background Remover & Changer</h1>

      <div className="flex flex-col gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="p-2 bg-gray-800 rounded"
        />

        <div className="flex gap-4 mt-4">
          <div>
            <label className="block mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-16 h-10 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Background Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/bg.jpg"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className="p-2 rounded bg-gray-800 w-64"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
        >
          {loading ? "Processing..." : "Remove & Replace Background"}
        </button>

        {resultUrl && (
          <div className="mt-8">
            <h2 className="text-lg mb-2 font-semibold">Result:</h2>
            <img
              src={resultUrl}
              alt="Result"
              className="max-w-lg rounded shadow-lg border"
            />
            <a
              href={resultUrl}
              download
              className="block mt-3 text-blue-400 hover:underline"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
