"use client";

import { useState } from "react";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<"text" | "logo">("text");
  const [text, setText] = useState("MyBrand");
  const [logoId, setLogoId] = useState("your_logo_public_id");
  const [result, setResult] = useState<{ original: string; watermarked: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", watermarkType);
    if (watermarkType === "text") formData.append("text", text);
    if (watermarkType === "logo") formData.append("logoId", logoId);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${window.location.origin}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.watermarked) {
        setResult({
          original: data.original.url,
          watermarked: data.watermarked.url,
        });
      } else alert(data.error || "Something went wrong");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload & Watermark</h1>

      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4" />

      <div className="mb-4">
        <label className="mr-2">Watermark Type:</label>
        <select value={watermarkType} onChange={(e) => setWatermarkType(e.target.value as any)}>
          <option value="text">Text</option>
          <option value="logo">Logo</option>
        </select>
      </div>

      {watermarkType === "text" && (
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Watermark text"
          className="border p-1 mb-4 w-full"
        />
      )}

      {watermarkType === "logo" && (
        <input
          value={logoId}
          onChange={(e) => setLogoId(e.target.value)}
          placeholder="Logo public ID"
          className="border p-1 mb-4 w-full"
        />
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Watermark"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Original Image:</h2>
          <img src={result.original} alt="Original" className="max-w-full border mb-4" />
          <h2 className="font-semibold mb-2">Watermarked Image:</h2>
          <img src={result.watermarked} alt="Watermarked" className="max-w-full border" />
        </div>
      )}
    </div>
  );
}
