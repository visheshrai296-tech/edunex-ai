"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AboutPage() {
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
          --brand:#4f46e5;--accent:#0d9488;
          --bg:${dm?"#080b12":"#f8f9ff"};
          --surface:${dm?"#111827":"#ffffff"};
          --surface2:${dm?"#1a2235":"#f1f5f9"};
          --text:${dm?"#f0f4ff":"#0a0f1e"};
          --sub:${dm?"#6b7a9e":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);}
        .nav{height:64px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 5%;position:sticky;top:0;z-index:100;}
        .nav-logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:1.2rem;background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;}
        .back-btn{padding:8px 18px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--sub);transition:0.2s;}
        .back-btn:hover{color:var(--text);}
        .hero{padding:80px 5% 60px;max-width:900px;margin:0 auto;text-align:center;}
        .label{display:inline-block;padding:4px 14px;border-radius:100px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.25);font-size:0.72rem;font-weight:800;color:#818cf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;}
        h1{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.1;margin-bottom:20px;letter-spacing:-0.02em;}
        .grad{background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .sub{color:var(--sub);font-size:1.05rem;line-height:1.7;max-width:600px;margin:0 auto;}
        .content{max-width:800px;margin:0 auto;padding:0 5% 80px;}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:36px;margin-bottom:24px;}
        .card h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.4rem;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:10px;}
        .card p{color:var(--sub);line-height:1.8;font-size:0.95rem;margin-bottom:12px;}
        .card p:last-child{margin-bottom:0;}
        .mission-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px;}
        .mission-item{background:var(--surface2);border:1px solid var(--border);border-radius:16px;padding:20px;text-align:center;}
        .mission-icon{font-size:1.8rem;margin-bottom:10px;}
        .mission-title{font-weight:800;font-size:0.88rem;margin-bottom:6px;}
        .mission-desc{font-size:0.78rem;color:var(--sub);line-height:1.5;}
        .timeline{margin-top:20px;display:flex;flex-direction:column;gap:16px;}
        .tl-item{display:flex;gap:16px;align-items:flex-start;}
        .tl-dot{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#0d9488);display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0;margin-top:2px;}
        .tl-content h3{font-weight:800;font-size:0.92rem;margin-bottom:4px;}
        .tl-content p{font-size:0.82rem;color:var(--sub);line-height:1.6;}
        @media(max-width:640px){.mission-grid{grid-template-columns:1fr;}}
      `}</style>

      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/")}>EduNex AI</div>
        <button className="back-btn" onClick={() => router.push("/")}>← Back to Home</button>
      </nav>

      <div className="hero">
        <div className="label">About Us</div>
        <h1>We're on a Mission to Make <span className="grad">Education Accessible</span></h1>
        <p className="sub">EduNex AI was built with one goal — give every Indian student access to world-class study tools, regardless of where they come from.</p>
      </div>

      <div className="content">
        <div className="card">
          <h2>🎯 Our Mission</h2>
          <p>India has over 250 million students, yet quality study resources remain out of reach for most. Coaching classes are expensive, good notes are hard to find, and doubt-clearing is a luxury.</p>
          <p>EduNex AI changes that. We've built a platform that gives every student — from a small town or a metro city — access to AI-powered tutoring, organized notes, and previous year papers, all for free.</p>
          <div className="mission-grid">
            {[
              {icon:"🌍",title:"Accessible",desc:"Free for every student across India"},
              {icon:"🤖",title:"AI-Powered",desc:"Smart tutoring available 24/7"},
              {icon:"📚",title:"Quality First",desc:"Verified content by expert educators"},
            ].map((m,i) => (
              <div className="mission-item" key={i}>
                <div className="mission-icon">{m.icon}</div>
                <div className="mission-title">{m.title}</div>
                <div className="mission-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>📖 Our Story</h2>
          <p>EduNex AI was founded in 2025 by Vishesh, a developer who saw firsthand how difficult it was for students to find reliable study resources. After spending hours searching for good notes and PYQ papers online, he decided to build the solution himself.</p>
          <p>What started as a simple notes-sharing website quickly evolved into a full-fledged AI-powered education platform — with smart tutoring, progress tracking, and personalized content for every course.</p>
          <div className="timeline">
            {[
              {year:"2025",title:"The Idea",desc:"Vishesh starts building EduNex AI from scratch while studying."},
              {year:"2025",title:"First Launch",desc:"Basic notes and PYQ platform goes live with 100 students."},
              {year:"2026",title:"AI Integration",desc:"Gemini AI Tutor added — students get instant doubt-clearing."},
              {year:"2026",title:"10K+ Students",desc:"EduNex AI grows to serve students across India."},
            ].map((t,i) => (
              <div className="tl-item" key={i}>
                <div className="tl-dot">📅</div>
                <div className="tl-content">
                  <h3>{t.year} — {t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>💡 Why EduNex AI?</h2>
          <p>There are many ed-tech platforms in India, but most are expensive, cluttered, or don't understand the real problems students face. EduNex AI is different — it's built by a student, for students.</p>
          <p>We focus on what matters: getting you the right notes, the right practice papers, and instant answers to your doubts — without ads, paywalls, or distractions.</p>
        </div>
      </div>
    </>
  );
}