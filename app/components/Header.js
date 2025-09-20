export default function Header() {
  return (
    <header>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="/ClauseAI.jpg" alt="ClauseAI Logo" />
        <h2>ClauseAI</h2>
      </div>
      <nav>
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#upload">Upload</a>
        <a href="#chatbot">Chatbot</a>
      </nav>
    </header>
  );
}
