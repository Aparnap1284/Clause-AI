"use client";

export default function AnalysisResult({ data }) {
  if (!data) return null;

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-lg font-bold mb-2">Analysis Result</h2>
      {data.summary ? (
        <div className="mb-4">
          <h3 className="font-semibold">PDF Summary:</h3>
          <p>Pages: {data.summary.pages}</p>
          <p>Words: {data.summary.words}</p>
          <p>Characters: {data.summary.characters}</p>
        </div>
      ) : null}

      <div>
        <h3 className="font-semibold">AI Analysis:</h3>
        <p>{data.analysis}</p>
      </div>
    </div>
  );
}
