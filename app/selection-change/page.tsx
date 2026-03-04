"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const COURSES = [
  { id: "9th",   icon: "📐", label: "9th Class",   desc: "Math, Science, English & more", color: "#6366f1" },
  { id: "10th",  icon: "🔬", label: "10th Class",  desc: "Board exam preparation",         color: "#0d9488" },
  { id: "11th",  icon: "⚗️", label: "11th Class",  desc: "Science, Commerce, Arts",        color: "#f59e0b" },
  { id: "12th",  icon: "🎯", label: "12th Class",  desc: "Board + entrance prep",          color: "#ec4899" },
  { id: "BCA",   icon: "💻", label: "BCA",         desc: "Bachelor of Computer Apps",      color: "#8b5cf6" },
  { id: "BTech", icon: "⚙️", label: "BTech",       desc: "Engineering courses",            color: "#ef4444" },
  { id: "BBA",   icon: "📊", label: "BBA",         desc: "Business Administration",        color: "#10b981" },
  { id: "Other", icon: "📚", label: "Other",       desc: "Any other course",               color: "#3b82f6" },
];

export default function SelectionChangePage() {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("eduNexDark");
    if (saved !== null) setDarkMode(saved === "true");
    if (!loading && !user) { window.location.href = "/"; return; }
    // Pre-select current course
    if (userData?.course) setSelected(userData.course);
  }, [loading, user, userData]);

  const handleSave = async () => {
    if (!selected || !user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { course: selected });
      localStorage.setItem("eduNexCourse", selected);
      router.push("/dashboard");
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const dm = darkMode;

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background: dm ? "#080b12" : "#f8f9ff" }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #4f46e5", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --brand:#4f46e5;
          --bg:${dm?"#080b12":"#f8f9ff"};
          --surface:${dm?"#111827":"#ffffff"};
          --surface2:${dm?"#1a2235":"#f1f5f9"};
          --text:${dm?"#f0f4ff":"#0a0f1e"};
          --sub:${dm?"#6b7a9e":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
        .bg-glow{position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 80% 50% at 50% -10%,${dm?"rgba(79,70,229,0.15)":"rgba(79,70,229,0.07)"} 0%,transparent 70%);}
        .nav{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;position:relative;z-index:10;}
        .nav-logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:1.2rem;background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;}
        .back-btn{padding:7px 16px;background:var(--surface);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:0.82rem;font-weight:600;color:var(--sub);transition:0.2s;}
        .back-btn:hover{color:var(--text);}
        .page{max-width:680px;margin:0 auto;padding:40px 20px 80px;position:relative;z-index:1;}
        .header{text-align:center;margin-bottom:40px;animation:fadeUp 0.5s ease both;}
        .badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:100px;background:${dm?"rgba(79,70,229,0.12)":"rgba(79,70,229,0.08)"};border:1px solid ${dm?"rgba(79,70,229,0.25)":"rgba(79,70,229,0.15)"};font-size:0.78rem;font-weight:700;color:#818cf8;margin-bottom:20px;}
        .header h1{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(1.8rem,5vw,2.8rem);font-weight:800;line-height:1.1;margin-bottom:12px;}
        .grad{background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .header p{color:var(--sub);font-size:0.95rem;line-height:1.6;}
        .current-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:100px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:0.78rem;font-weight:700;color:#10b981;margin-top:10px;}
        .courses-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:32px;}
        .course-card{background:var(--surface);border:2px solid var(--border);border-radius:20px;padding:22px 20px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;animation:fadeUp 0.5s ease both;}
        .course-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--cc,#6366f1);opacity:0;transition:opacity 0.2s;}
        .course-card:hover{border-color:var(--cc,#6366f1);transform:translateY(-3px);box-shadow:0 12px 30px ${dm?"rgba(0,0,0,0.3)":"rgba(0,0,0,0.08)"};}
        .course-card:hover::before,.course-card.selected::before{opacity:1;}
        .course-card.selected{border-color:var(--cc,#6366f1);background:${dm?"rgba(79,70,229,0.08)":"rgba(79,70,229,0.04)"};}
        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
        .card-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;}
        .check{width:22px;height:22px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.7rem;transition:0.2s;flex-shrink:0;}
        .check.active{background:var(--cc,#6366f1);border-color:var(--cc,#6366f1);color:white;}
        .card-label{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:800;margin-bottom:4px;}
        .card-desc{font-size:0.78rem;color:var(--sub);line-height:1.4;}
        .continue-wrap{position:sticky;bottom:24px;}
        .continue-btn{width:100%;padding:16px;background:${selected?"linear-gradient(135deg,#4f46e5,#0d9488)":"var(--surface2)"};color:${selected?"white":"var(--sub)"};border:${selected?"none":"1.5px solid var(--border)"};border-radius:16px;font-weight:800;font-size:1rem;cursor:${selected?"pointer":"not-allowed"};transition:all 0.25s;font-family:'Plus Jakarta Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:10px;}
        .continue-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 30px rgba(79,70,229,0.35);}
        .step-hint{text-align:center;font-size:0.75rem;color:var(--sub);margin-top:12px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:500px){.courses-grid{grid-template-columns:1fr;}}
      `}</style>

      <div className="bg-glow" />

      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/")}>EduNex AI</div>
        <button className="back-btn" onClick={() => router.back()}>← Back</button>
      </nav>

      <div className="page">
        <div className="header">
          <div className="badge">🎓 Change Course</div>
          <h1>Update Your <span className="grad">Course</span></h1>
          <p>Select a new course — your notes and PYQ papers will update automatically.</p>
          {userData?.course && (
            <div className="current-badge">✓ Current: {userData.course}</div>
          )}
        </div>

        <div className="courses-grid">
          {COURSES.map((c, i) => (
            <div
              key={c.id}
              className={`course-card ${selected === c.id ? "selected" : ""}`}
              style={{ "--cc": c.color, animationDelay: `${i * 0.05}s` } as React.CSSProperties}
              onClick={() => setSelected(c.id)}
            >
              <div className="card-top">
                <div className="card-icon" style={{ background: `${c.color}18` }}>{c.icon}</div>
                <div className={`check ${selected === c.id ? "active" : ""}`}
                  style={{ "--cc": c.color } as React.CSSProperties}>
                  {selected === c.id ? "✓" : ""}
                </div>
              </div>
              <div className="card-label">{c.label}</div>
              <div className="card-desc">{c.desc}</div>
            </div>
          ))}
        </div>

        <div className="continue-wrap">
          <button className="continue-btn" onClick={handleSave} disabled={!selected || saving}>
            {saving
              ? <><span style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}} /> Saving...</>
              : selected
                ? <>Save & Go to Dashboard →</>
                : "Select a course to continue"}
          </button>
          <div className="step-hint">Changes will reflect immediately on your dashboard</div>
        </div>
      </div>
    </>
  );
}