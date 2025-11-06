"use client";

import { useState } from "react";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("MyBrand");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(40);
  const [position, setPosition] = useState("bottom-right");
  const [result, setResult] = useState<{ original: string; watermarked: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("color", color);
    formData.append("fontSize", fontSize.toString());
    formData.append("position", position);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/watermark", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Add Text Watermark</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full rounded"
      />

      <input
        className="border p-2 w-full rounded"
        placeholder="Watermark text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <label className="block mb-1 font-medium">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Font Size</label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block mb-1 font-medium">Position</label>
        <select
          className="border p-2 rounded w-full"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
          <option value="center">Center</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Apply Watermark"}
      </button>

      {result && (
        <div className="mt-6 space-y-4 text-center">
          <div>
            <h2 className="font-semibold mb-2">Original Image:</h2>
            <img src={result.original} alt="Original" className="rounded-xl border mx-auto" />
          </div>
          <div>
            <h2 className="font-semibold mb-2">Watermarked Image:</h2>
            <img src={result.watermarked} alt="Watermarked" className="rounded-xl border mx-auto mb-3" />
            <a
              href={result.watermarked}
              download
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download Watermarked Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
