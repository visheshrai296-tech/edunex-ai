"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Message {
  role: "user" | "ai";
  text: string;
  time: string;
}

const SUGGESTIONS = [
  "Explain photosynthesis in simple words",
  "What is Newton's second law?",
  "Help me understand integration",
  "What are the causes of World War 2?",
  "Explain OOPs concepts in programming",
  "How does the human digestive system work?",
];

export default function AITutorPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [course, setCourse] = useState("General"); // State banayi build error hatane ke liye
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user, userData } = useAuth();
  const router = useRouter();

  const userName = userData?.name || user?.displayName || "Student";

  useEffect(() => {
    // LocalStorage ab sirf browser mein chalega
    const s = localStorage.getItem("eduNexDark");
    if (s === "true") setDarkMode(true);

    const savedCourse = userData?.course || localStorage.getItem("eduNexCourse") || "General";
    setCourse(savedCourse);
  }, [userData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getTime = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const systemPrompt = `You are EduNex AI Tutor — a friendly, smart academic assistant for Indian students.
Student name: ${userName}
Course/Class: ${course}

Guidelines:
- Be friendly, encouraging and patient
- Give clear step-by-step explanations
- Use simple language suitable for ${course} students
- You can respond in Hindi, English or Hinglish based on student's language
- Use examples and analogies to explain concepts
- For math/science, show step-by-step solutions
- Keep responses focused and not too long
- Encourage the student when they get things right`;

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", text: msg, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const newHistory = [...history, { role: "user", parts: [{ text: msg }] }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, systemPrompt }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const aiMsg: Message = { role: "ai", text: data.text, time: getTime() };
      setMessages(prev => [...prev, aiMsg]);
      setHistory([...newHistory, { role: "model", parts: [{ text: data.text }] }]);

    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "⚠️ Sorry, something went wrong. Please try again!",
        time: getTime(),
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const renderText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code style='background:rgba(99,102,241,0.12);padding:2px 6px;border-radius:5px;font-size:0.88em;'>$1</code>")
      .replace(/^### (.*)/gm, "<h3 style='font-size:1rem;font-weight:800;margin:12px 0 6px;'>$1</h3>")
      .replace(/^## (.*)/gm, "<h2 style='font-size:1.1rem;font-weight:800;margin:12px 0 6px;'>$1</h2>")
      .replace(/^- (.*)/gm, "<div style='display:flex;gap:8px;margin:3px 0'><span>•</span><span>$1</span></div>")
      .replace(/\n/g, "<br/>");
  };

  const dm = darkMode;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --brand:#6366f1;--accent:#0d9488;
          --bg:${dm?"#080b12":"#f0f4ff"};
          --surface:${dm?"#0f1420":"#ffffff"};
          --surface2:${dm?"#161d2e":"#f8faff"};
          --text:${dm?"#e8eeff":"#0a0f1e"};
          --sub:${dm?"#6272a4":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.06)":"rgba(79,70,229,0.08)"};
          --user-bg:linear-gradient(135deg,#4f46e5,#0d9488);
          --ai-bg:${dm?"#161d2e":"#ffffff"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);height:100vh;overflow:hidden;}
        .layout{display:flex;flex-direction:column;height:100vh;}
        .nav{height:60px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 20px;flex-shrink:0;}
        .nav-left{display:flex;align-items:center;gap:12px;}
        .back-btn{width:34px;height:34px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.9rem;color:var(--sub);transition:0.2s;}
        .back-btn:hover{color:var(--text);}
        .nav-title{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:1rem;}
        .nav-badge{padding:3px 10px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.2);color:#818cf8;border-radius:100px;font-size:0.7rem;font-weight:800;}
        .nav-right{display:flex;align-items:center;gap:8px;}
        .clear-btn{padding:6px 14px;background:transparent;border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:0.75rem;font-weight:700;color:var(--sub);transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .clear-btn:hover{border-color:rgba(239,68,68,0.3);color:#ef4444;}
        .theme-btn{width:34px;height:34px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.9rem;}
        .chat-area{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
        .chat-area::-webkit-scrollbar{width:4px;}
        .chat-area::-webkit-scrollbar-track{background:transparent;}
        .chat-area::-webkit-scrollbar-thumb{background:var(--border);border-radius:10px;}
        .welcome{text-align:center;padding:40px 20px;max-width:560px;margin:0 auto;}
        .welcome-icon{width:72px;height:72px;border-radius:24px;background:linear-gradient(135deg,#4f46e5,#0d9488);display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 20px;box-shadow:0 12px 30px rgba(79,70,229,0.3);}
        .welcome h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.5rem;font-weight:800;margin-bottom:8px;}
        .welcome p{color:var(--sub);font-size:0.88rem;line-height:1.6;margin-bottom:28px;}
        .suggestions{display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left;}
        .suggestion{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:12px 14px;cursor:pointer;font-size:0.8rem;font-weight:600;color:var(--sub);transition:0.2s;line-height:1.4;}
        .suggestion:hover{border-color:var(--brand);color:var(--text);background:${dm?"rgba(99,102,241,0.06)":"rgba(79,70,229,0.03)"};}
        .msg-row{display:flex;gap:10px;align-items:flex-end;animation:fadeUp 0.2s ease;}
        .msg-row.user{flex-direction:row-reverse;}
        .msg-avatar{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:800;}
        .msg-avatar.ai{background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;}
        .msg-avatar.user{background:var(--surface2);border:1px solid var(--border);color:var(--sub);}
        .msg-bubble{max-width:72%;padding:14px 16px;border-radius:18px;font-size:0.875rem;line-height:1.65;}
        .msg-bubble.ai{background:var(--surface);border:1px solid var(--border);border-bottom-left-radius:4px;color:var(--text);}
        .msg-bubble.user{background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border-bottom-right-radius:4px;}
        .msg-time{font-size:0.65rem;color:var(--sub);margin-top:4px;text-align:right;}
        .msg-time.ai{text-align:left;}
        .typing{display:flex;align-items:center;gap:4px;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:18px;border-bottom-left-radius:4px;width:fit-content;}
        .typing span{width:7px;height:7px;border-radius:50%;background:var(--brand);animation:bounce 1.2s infinite;}
        .typing span:nth-child(2){animation-delay:0.2s;}
        .typing span:nth-child(3){animation-delay:0.4s;}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
        .input-area{background:var(--surface);border-top:1px solid var(--border);padding:14px 16px;flex-shrink:0;}
        .input-wrap{max-width:800px;margin:0 auto;display:flex;gap:10px;align-items:flex-end;background:var(--surface2);border:1.5px solid var(--border);border-radius:16px;padding:10px 14px;transition:0.2s;}
        .input-wrap:focus-within{border-color:var(--brand);box-shadow:0 0 0 3px ${dm?"rgba(99,102,241,0.1)":"rgba(79,70,229,0.06)"};}
        textarea{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;resize:none;max-height:120px;line-height:1.5;}
        textarea::placeholder{color:var(--sub);}
        .send-btn{width:38px;height:38px;border-radius:12px;background:${loading?"var(--surface)":"linear-gradient(135deg,#4f46e5,#0d9488)"};border:none;color:white;cursor:${loading?"not-allowed":"pointer"};display:flex;align-items:center;justify-content:center;font-size:1rem;transition:0.2s;flex-shrink:0;}
        .send-btn:hover:not(:disabled){transform:scale(1.05);}
        .input-hint{text-align:center;font-size:0.68rem;color:var(--sub);margin-top:8px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:600px){.suggestions{grid-template-columns:1fr;}.msg-bubble{max-width:88%;}}
      `}</style>

      <div className="layout">
        <nav className="nav">
          <div className="nav-left">
            <button className="back-btn" onClick={() => router.push("/dashboard")}>←</button>
            <div className="nav-title">✦ AI Tutor</div>
            <span className="nav-badge">Powered by Groq ⚡</span>
          </div>
          <div className="nav-right">
            {messages.length > 0 && (
              <button className="clear-btn" onClick={() => { setMessages([]); setHistory([]); }}>🗑 Clear Chat</button>
            )}
            <div className="theme-btn" onClick={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem("eduNexDark", String(n)); }}>
              {dm ? "☀️" : "🌙"}
            </div>
          </div>
        </nav>

        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              <h2>Hey {userName.split(" ")[0]}! 👋</h2>
              <p>I&apos;m your AI Tutor, here to help with any doubt — Math, Science, Hindi, English, Programming and more. Ask me anything!</p>
              <div className="suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <div key={i} className="suggestion" onClick={() => sendMessage(s)}>💬 {s}</div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`msg-row ${msg.role}`}>
                  <div className={`msg-avatar ${msg.role}`}>
                    {msg.role === "ai" ? "✦" : (userName?.[0] ?? "S").toUpperCase()}
                  </div>
                  <div>
                    <div
                      className={`msg-bubble ${msg.role}`}
                      dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                    />
                    <div className={`msg-time ${msg.role}`}>{msg.time}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="msg-row">
                  <div className="msg-avatar ai">✦</div>
                  <div className="typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-wrap">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
              onKeyDown={handleKey}
              placeholder="Ask any doubt... (Hindi/English dono chalega)"
              rows={1}
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              {loading ? "⏳" : "↑"}
            </button>
          </div>
          <div className="input-hint">Enter to send • Shift+Enter for new line</div>
        </div>
      </div>
    </>
  );
}