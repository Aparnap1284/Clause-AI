"use client";
import { useState } from "react";

export default function FileUploader({ onUpload }) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);
    onUpload(data, file.name);
  };

  return (
    <div className="bg-white shadow-2xl p-6 rounded-2xl text-center transform hover:scale-105 transition">
      <label className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition">
        {loading ? "Analyzing..." : "📂 Upload PDF"}
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
        />
      </label>
    </div>
  );
}
