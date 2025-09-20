"use client";
import { useState } from "react";

export default function PDFPreviewCard({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = async () => {
      const typedarray = new Uint8Array(reader.result);
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.107/pdf.worker.min.js";

      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((i) => i.str).join(" ") + "\n";
      }
      setText(fullText);
      onAnalyze(fullText);
    };
    reader.readAsArrayBuffer(f);
  };

  return (
    <div className="card" id="upload">
      <h3>Upload & Preview PDF</h3>
      <input type="file" onChange={handleFile} />
      {file && <p>📄 {file.name}</p>}
      {text && <pre style={{ whiteSpace: "pre-wrap" }}>{text.slice(0, 500)}...</pre>}
    </div>
  );
}
