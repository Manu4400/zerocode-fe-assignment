import React, { useState, useEffect, useRef } from "react";
import AuthForm from "./AuthForm";

const API = "http://localhost:4000";

type Message = { role: "user" | "bot"; content: string };

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check session on mount
  useEffect(() => {
    fetch(`${API}/me`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setUser(data.username));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Handle input history navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputHistory.length === 0) return;
    if (e.key === "ArrowUp") {
      setHistoryIndex(idx => {
        const newIdx = idx === null ? inputHistory.length - 1 : Math.max(0, idx - 1);
        setInput(inputHistory[newIdx]);
        return newIdx;
      });
    } else if (e.key === "ArrowDown") {
      setHistoryIndex(idx => {
        if (idx === null) return null;
        const newIdx = idx + 1;
        if (newIdx >= inputHistory.length) {
          setInput("");
          return null;
        }
        setInput(inputHistory[newIdx]);
        return newIdx;
      });
    }
  };

  // Simulate bot response (replace with your AI API)
  const sendMessage = async (msg: string) => {
    setLoading(true);
    const newChat: Message[] = [...chat, { role: "user", content: msg }];
    setChat(newChat);
    setInputHistory(prev => [...prev, msg]);
    setHistoryIndex(null);

    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newChat.map(m => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content
          }))
        })
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: "bot", content: data.reply }]);
    } catch {
      setChat(prev => [...prev, { role: "bot", content: "Error getting reply." }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  if (!user) return <AuthForm onAuth={setUser} />;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex-1">ChatBox AI</h1>
        <span className="mr-4 text-gray-600">Hi, {user}</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => {
            fetch(`${API}/logout`, { method: "POST", credentials: "include" }).then(() => setUser(null));
          }}
        >
          Logout
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl flex flex-col flex-grow bg-white rounded-lg shadow-lg mt-6 mb-4 overflow-hidden">
          <div className="flex flex-col flex-grow overflow-y-auto px-2 sm:px-6 py-4" style={{ minHeight: "60vh" }}>
            {chat.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <p>Start the conversation!</p>
              </div>
            )}
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-4 ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow
                  ${msg.role === "bot" ? "bg-gray-100 text-gray-800 rounded-bl-none" : "bg-blue-500 text-white rounded-br-none"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex mb-4 justify-start">
                <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-500 max-w-xs shadow animate-pulse">
                  Bot is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>
      <footer className="w-full bg-white shadow px-0 py-4">
        <form
          className="flex max-w-2xl mx-auto items-center"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow p-3 rounded-l-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-r-3xl hover:bg-blue-600 transition font-semibold"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;