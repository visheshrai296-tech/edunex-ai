"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ROLES = [
  { title: "Frontend Developer", type: "Remote · Full-time", tags: ["React", "Next.js", "TypeScript"], desc: "Build beautiful, responsive UI for EduNex AI. Work on dashboard, admin panel and new features." },
  { title: "Content Writer (Education)", type: "Remote · Part-time", tags: ["Writing", "Education", "Hindi/English"], desc: "Create high-quality study notes, blog posts and educational content for students." },
  { title: "AI/ML Engineer", type: "Remote · Full-time", tags: ["Python", "Gemini API", "LLMs"], desc: "Improve and extend our AI Tutor capabilities. Work with cutting-edge LLM technology." },
  { title: "Social Media Manager", type: "Remote · Part-time", tags: ["Instagram", "YouTube", "Marketing"], desc: "Grow EduNex AI's presence on social media and connect with student communities." },
];

export default function CareersPage() {
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
        .grad{background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .sub{color:var(--sub);font-size:1rem;line-height:1.7;max-width:560px;margin:0 auto 40px;}
        .content{max-width:800px;margin:0 auto;padding:0 5% 80px;}
        .perks{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:48px;}
        .perk{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px;text-align:center;}
        .perk-icon{font-size:1.6rem;margin-bottom:8px;}
        .perk-title{font-weight:800;font-size:0.88rem;margin-bottom:4px;}
        .perk-desc{font-size:0.75rem;color:var(--sub);line-height:1.5;}
        .section-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1.2rem;font-weight:800;margin-bottom:20px;}
        .role-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:20px;transition:0.2s;}
        .role-card:hover{border-color:rgba(79,70,229,0.3);transform:translateX(4px);}
        .role-info{flex:1;}
        .role-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:800;margin-bottom:4px;}
        .role-type{font-size:0.78rem;color:#10b981;font-weight:700;margin-bottom:8px;}
        .role-desc{font-size:0.82rem;color:var(--sub);line-height:1.5;margin-bottom:10px;}
        .role-tags{display:flex;gap:6px;flex-wrap:wrap;}
        .role-tag{padding:3px 10px;background:rgba(79,70,229,0.1);color:#818cf8;border-radius:100px;font-size:0.7rem;font-weight:700;}
        .apply-btn{padding:10px 22px;background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border:none;border-radius:12px;font-weight:700;font-size:0.85rem;cursor:pointer;white-space:nowrap;font-family:'Plus Jakarta Sans',sans-serif;}
        .apply-btn:hover{opacity:0.9;}
        @media(max-width:640px){.perks{grid-template-columns:1fr 1fr;}.role-card{flex-direction:column;align-items:flex-start;}}
      `}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/")}>EduNex AI</div>
        <button className="back-btn" onClick={() => router.push("/")}>← Back</button>
      </nav>
      <div className="hero">
        <div className="label">Careers</div>
        <h1>Build the Future of <span className="grad">Indian Education</span></h1>
        <p className="sub">Join our small but passionate team. We're looking for people who care deeply about making education accessible to every student.</p>
      </div>
      <div className="content">
        <div className="perks">
          {[
            {icon:"🏠",title:"Remote First",desc:"Work from anywhere in India"},
            {icon:"🕐",title:"Flexible Hours",desc:"Work when you're most productive"},
            {icon:"📈",title:"Fast Growth",desc:"Grow with the company from early stage"},
            {icon:"💰",title:"Competitive Pay",desc:"Market-rate salaries + equity"},
            {icon:"📚",title:"Learning Budget",desc:"₹10,000/year for courses & books"},
            {icon:"🎯",title:"Real Impact",desc:"Your work reaches 10K+ students"},
          ].map((p,i) => (
            <div className="perk" key={i}><div className="perk-icon">{p.icon}</div><div className="perk-title">{p.title}</div><div className="perk-desc">{p.desc}</div></div>
          ))}
        </div>
        <div className="section-title">Open Positions</div>
        {ROLES.map((r,i) => (
          <div className="role-card" key={i}>
            <div className="role-info">
              <div className="role-title">{r.title}</div>
              <div className="role-type">🟢 {r.type}</div>
              <div className="role-desc">{r.desc}</div>
              <div className="role-tags">{r.tags.map(t => <span key={t} className="role-tag">{t}</span>)}</div>
            </div>
            <button className="apply-btn" onClick={() => window.open("mailto:careers@edunex.ai?subject=Application: "+r.title)}>Apply →</button>
          </div>
        ))}
      </div>
    </>
  );
}