"use client";

import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    const userMsg = { role: "user", content: input };
    const botMsg = { role: "bot", content: `🤖 AI Response: "${input}" scenario explained.` };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="chat-popup">
      <h2>💬 ClauseAI Chatbot</h2>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>{m.content}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask 'What if?' questions..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
