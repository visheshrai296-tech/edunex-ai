"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const POSTS = [
  { tag: "Study Tips", color: "#6366f1", title: "How to Score 90%+ in Board Exams Using PYQ Papers", date: "Feb 28, 2026", read: "5 min read", desc: "Previous year question papers are the most underutilized study resource. Here's exactly how to use them to predict exam questions." },
  { tag: "AI Learning", color: "#0d9488", title: "Why AI Tutors Are Better Than Traditional Coaching for Doubt Clearing", date: "Feb 20, 2026", read: "4 min read", desc: "AI tutors are available 24/7, never get impatient, and can explain the same concept 10 different ways. Here's why students are switching." },
  { tag: "Productivity", color: "#f59e0b", title: "The Pomodoro Technique: How to Study for 6 Hours Without Burning Out", date: "Feb 15, 2026", read: "6 min read", desc: "Most students study wrong. Learn the science-backed technique that top rankers use to maximize focus and retention." },
  { tag: "BCA/BTech", color: "#ec4899", title: "Complete Roadmap for BCA Students: What to Study Each Semester", date: "Feb 10, 2026", read: "8 min read", desc: "A detailed semester-by-semester guide for BCA students covering all core subjects, practical skills and career preparation." },
  { tag: "Study Tips", color: "#6366f1", title: "Top 10 Mistakes Students Make While Preparing for 12th Board Exams", date: "Feb 5, 2026", read: "5 min read", desc: "Avoid these common mistakes that cost students marks every year. Based on analysis of thousands of board exam papers." },
  { tag: "AI Learning", color: "#0d9488", title: "How to Use AI for Learning: A Student's Complete Guide", date: "Jan 30, 2026", read: "7 min read", desc: "AI tools have changed how students learn. Here's a practical guide to using AI tutors, note summarizers, and study assistants." },
];

export default function BlogPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const s = localStorage.getItem("eduNexDark");
    if (s !== null) setDarkMode(s === "true");
  }, []);
  const dm = darkMode;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:${dm?"#080b12":"#f8f9ff"};--surface:${dm?"#111827":"#ffffff"};
          --surface2:${dm?"#1a2235":"#f1f5f9"};--text:${dm?"#f0f4ff":"#0a0f1e"};
          --sub:${dm?"#6b7a9e":"#64748b"};--border:${dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);}
        .nav{height:64px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 5%;position:sticky;top:0;z-index:100;}
        .nav-logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:1.2rem;background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;}
        .back-btn{padding:8px 18px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--sub);}
        .hero{padding:80px 5% 60px;max-width:900px;margin:0 auto;text-align:center;}
        .label{display:inline-block;padding:4px 14px;border-radius:100px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.25);font-size:0.72rem;font-weight:800;color:#818cf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;}
        h1{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;margin-bottom:16px;}
        .sub{color:var(--sub);font-size:1rem;line-height:1.7;}
        .content{max-width:900px;margin:0 auto;padding:0 5% 80px;}
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
        .post-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;cursor:pointer;transition:0.25s;position:relative;overflow:hidden;}
        .post-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--pc,#6366f1);}
        .post-card:hover{transform:translateY(-4px);border-color:var(--pc,#6366f1);box-shadow:0 16px 40px ${dm?"rgba(0,0,0,0.3)":"rgba(0,0,0,0.08)"};}
        .post-tag{display:inline-block;padding:3px 10px;border-radius:100px;font-size:0.7rem;font-weight:800;margin-bottom:12px;}
        .post-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:800;line-height:1.35;margin-bottom:10px;}
        .post-desc{font-size:0.82rem;color:var(--sub);line-height:1.6;margin-bottom:14px;}
        .post-meta{display:flex;gap:12px;font-size:0.72rem;color:var(--sub);}
        @media(max-width:640px){.grid{grid-template-columns:1fr;}}
      `}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/")}>EduNex AI</div>
        <button className="back-btn" onClick={() => router.push("/")}>← Back</button>
      </nav>
      <div className="hero">
        <div className="label">Blog</div>
        <h1>Study Smarter, <br/>Not Harder</h1>
        <p className="sub">Tips, guides and insights to help Indian students ace their exams.</p>
      </div>
      <div className="content">
        <div className="grid">
          {POSTS.map((p,i) => (
            <div className="post-card" key={i} style={{"--pc":p.color} as React.CSSProperties}>
              <span className="post-tag" style={{background:`${p.color}18`,color:p.color}}>{p.tag}</span>
              <div className="post-title">{p.title}</div>
              <div className="post-desc">{p.desc}</div>
              <div className="post-meta"><span>📅 {p.date}</span><span>⏱ {p.read}</span></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}