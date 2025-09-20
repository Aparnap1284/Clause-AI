"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(""); // Clear previous analysis when new file is selected
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a PDF first.");
      return;
    }

    setLoading(true);
    setAnalysis("Analyzing your document...");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      
      if (data.error) {
        setAnalysis("Error: " + data.error);
      } else {
        setAnalysis(data.result || "Analysis completed successfully.");
        
        // Add welcome message to chat after analysis
        if (chatMessages.length === 0) {
          setChatMessages([
            { role: "ai", text: "I've analyzed your document. Ask me anything about it!" }
          ]);
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysis("Error analyzing document. Please try again with a different PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", text: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Chat failed");
      }
      
      if (data.error) {
        setChatMessages([
          ...newMessages,
          { role: "ai", text: "Error: " + data.error },
        ]);
      } else {
        setChatMessages([
          ...newMessages,
          { role: "ai", text: data.reply || "I'm not sure how to respond to that." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages([
        ...newMessages,
        { role: "ai", text: "Sorry, I'm having trouble connecting right now. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleChat();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center rounded-b-2xl">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2">⚖️</span> ClauseAI
        </h1>
        <nav className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-yellow-300 text-white text-sm sm:text-base">Home</a>
          <a href="#upload" className="hover:text-yellow-300 text-white text-sm sm:text-base">Upload</a>
          <a href="#chat" className="hover:text-yellow-300 text-white text-sm sm:text-base">💬 Chat</a>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 space-y-8 max-w-4xl mx-auto w-full">
        {/* HERO SECTION */}
        <section className="text-center py-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ClauseAI – Smart Legal Analyzer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Upload your legal documents for AI-powered analysis. Get instant insights into risks, clauses, and recommendations.
          </p>
        </section>

        {/* UPLOAD & ANALYZE SECTION */}
        <section id="upload" className="bg-white text-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">📄 Upload Legal Document</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select PDF file</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF files only</p>
                </div>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
          
          {file && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
              <span className="text-blue-700 font-medium">📋 {file.name}</span>
              <button 
                onClick={() => setFile(null)} 
                className="ml-auto text-red-500 text-sm hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          )}
          
          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl shadow-md transition-colors flex items-center justify-center font-medium"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : "Analyze with AI"}
          </button>

          {analysis && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-gray-900 max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-2 text-blue-800">📑 Analysis Result:</h3>
              <div className="whitespace-pre-wrap text-sm">{analysis}</div>
            </div>
          )}
        </section>

        {/* CHATBOT SECTION */}
        <section id="chat" className="bg-white text-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">💬 ClauseAI Chatbot</h3>

          <div 
            ref={chatContainerRef}
            className="h-64 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50"
          >
            {chatMessages.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Ask me anything about your legal document
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block px-4 py-2 rounded-xl max-w-xs sm:max-w-md ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-xl bg-gray-200 text-gray-800">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask ClauseAI..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={chatLoading}
            />
            <button
              onClick={handleChat}
              disabled={chatLoading || !chatInput.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-md transition-colors"
            >
              Send
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 text-center p-4 rounded-t-2xl text-white mt-8">
        <p>⚖️ ClauseAI © 2025. All rights reserved.</p>
        <p className="text-sm opacity-80 mt-1">This tool is educational and not legal advice.</p>
      </footer>
    </div>
  );
}