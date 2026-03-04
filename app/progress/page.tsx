   "use client";   

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function ProgressPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useAuth();
  const router = useRouter();
  const course = userData?.course || (typeof window !== "undefined" ? localStorage.getItem("eduNexCourse") : "") || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("eduNexDark");
      if (s === "true") setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (!user || !course) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [notesSnap, pyqSnap, subjSnap] = await Promise.all([
          getDocs(query(collection(db, "notes"), where("course", "==", course))),
          getDocs(query(collection(db, "pyqs"), where("course", "==", course))),
          getDocs(query(collection(db, "subjects"), where("course", "==", course))),
        ]);
        setNotes(notesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPyqs(pyqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setSubjects(subjSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [user, course]);

  const dm = darkMode;
  const userName = userData?.name || user?.displayName || "Student";
  const joinDate = userData?.createdAt?.seconds
    ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const STATS = [
    { label: "Notes Available", val: notes.length, icon: "📄", color: "#6366f1", sub: "Study materials" },
    { label: "PYQ Papers", val: pyqs.length, icon: "📝", color: "#0d9488", sub: "Practice papers" },
    { label: "Subjects", val: subjects.length, icon: "📚", color: "#f59e0b", sub: "Topics covered" },
    { label: "AI Sessions", val: 0, icon: "✦", color: "#ec4899", sub: "Doubts cleared" },
  ];

  const TIPS = [
    { icon: "🎯", title: "Set Daily Goals", desc: "Study at least 2-3 subjects daily for consistent progress." },
    { icon: "📝", title: "Practice PYQs", desc: "Solve previous year papers to understand exam patterns." },
    { icon: "🤖", title: "Use AI Tutor", desc: "Ask doubts instantly — don't let confusion pile up." },
    { icon: "🔁", title: "Revise Regularly", desc: "Revise notes every week to improve retention." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --brand:#4f46e5;--accent:#0d9488;
          --bg:${dm?"#080b12":"#f0f4ff"};
          --surface:${dm?"#0f1420":"#ffffff"};
          --surface2:${dm?"#161d2e":"#f8faff"};
          --text:${dm?"#e8eeff":"#0a0f1e"};
          --sub:${dm?"#6272a4":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.06)":"rgba(79,70,229,0.08)"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
        .nav{height:64px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 5%;position:sticky;top:0;z-index:100;}
        .nav-logo{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:1.1rem;background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;}
        .nav-right{display:flex;align-items:center;gap:10px;}
        .back-btn{padding:7px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:0.82rem;font-weight:700;color:var(--sub);font-family:'Plus Jakarta Sans',sans-serif;}
        .back-btn:hover{color:var(--text);}
        .theme-btn{width:36px;height:36px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.9rem;}
        .page{max-width:900px;margin:0 auto;padding:32px 5% 80px;}

        /* PROFILE BANNER */
        .profile-banner{background:linear-gradient(135deg,#4f46e5,#0d9488);border-radius:24px;padding:28px 32px;display:flex;align-items:center;gap:20px;margin-bottom:24px;position:relative;overflow:hidden;}
        .profile-banner::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.06);}
        .pb-avatar{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;color:white;flex-shrink:0;overflow:hidden;border:3px solid rgba(255,255,255,0.3);}
        .pb-avatar img{width:100%;height:100%;object-fit:cover;}
        .pb-info h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.3rem;font-weight:800;color:white;margin-bottom:4px;}
        .pb-info p{color:rgba(255,255,255,0.72);font-size:0.82rem;}
        .pb-badges{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;}
        .pb-badge{padding:3px 12px;border-radius:100px;background:rgba(255,255,255,0.15);color:white;font-size:0.72rem;font-weight:700;}

        /* STATS */
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;position:relative;overflow:hidden;transition:0.2s;}
        .stat-card:hover{transform:translateY(-2px);border-color:var(--sc,#6366f1);}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--sc,#6366f1);}
        .stat-icon{font-size:1.4rem;margin-bottom:10px;opacity:0.8;}
        .stat-val{font-family:'Bricolage Grotesque',sans-serif;font-size:2rem;font-weight:800;color:var(--sc,#6366f1);margin-bottom:2px;}
        .stat-label{font-size:0.75rem;font-weight:700;color:var(--text);margin-bottom:2px;}
        .stat-sub{font-size:0.68rem;color:var(--sub);}

        /* OVERVIEW */
        .section-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:800;margin-bottom:16px;}
        .overview-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;}
        .overview-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;}
        .ov-title{font-size:0.78rem;font-weight:800;color:var(--sub);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;}
        .ov-stat{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);}
        .ov-stat:last-child{border-bottom:none;padding-bottom:0;}
        .ov-label{font-size:0.85rem;font-weight:600;display:flex;align-items:center;gap:8px;}
        .ov-val{font-size:0.85rem;font-weight:800;color:var(--brand);}

        /* TIPS */
        .tips-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;}
        .tip-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px;display:flex;gap:14px;align-items:flex-start;transition:0.2s;}
        .tip-card:hover{border-color:rgba(79,70,229,0.2);}
        .tip-icon{width:40px;height:40px;border-radius:12px;background:rgba(79,70,229,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
        .tip-title{font-weight:800;font-size:0.88rem;margin-bottom:4px;}
        .tip-desc{font-size:0.78rem;color:var(--sub);line-height:1.5;}

        /* CTA */
        .cta-card{background:${dm?"linear-gradient(135deg,rgba(79,70,229,0.15),rgba(13,148,136,0.1))":"linear-gradient(135deg,rgba(79,70,229,0.05),rgba(13,148,136,0.03))"};border:1px solid ${dm?"rgba(129,140,248,0.2)":"rgba(79,70,229,0.1)"};border-radius:20px;padding:28px;text-align:center;}
        .cta-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1.2rem;font-weight:800;margin-bottom:8px;}
        .cta-sub{font-size:0.85rem;color:var(--sub);margin-bottom:20px;line-height:1.6;}
        .cta-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
        .cta-btn{padding:11px 24px;border-radius:12px;font-weight:700;font-size:0.88rem;cursor:pointer;transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;border:none;}
        .cta-btn.primary{background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;}
        .cta-btn.primary:hover{opacity:0.9;transform:translateY(-1px);}
        .cta-btn.outline{background:transparent;color:var(--brand);border:1.5px solid rgba(79,70,229,0.3);}
        .cta-btn.outline:hover{background:rgba(79,70,229,0.06);}

        .skel{background:${dm?"rgba(255,255,255,0.05)":"rgba(79,70,229,0.05)"};border-radius:18px;animation:shimmer 1.5s infinite;}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr);}.overview-grid{grid-template-columns:1fr;}.tips-grid{grid-template-columns:1fr;}}
      `}</style>

      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/dashboard")}>EduNex AI</div>
        <div className="nav-right">
          <div className="theme-btn" onClick={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem("eduNexDark", String(n)); }}>
            {dm ? "☀️" : "🌙"}
          </div>
          <button className="back-btn" onClick={() => router.push("/dashboard")}>← Dashboard</button>
        </div>
      </nav>

      <div className="page">
        {/* PROFILE BANNER */}
        <div className="profile-banner">
          <div className="pb-avatar">
            {userData?.photo || user?.photoURL
              ? <img src={userData?.photo || user?.photoURL || ""} alt="" />
              : (userName?.[0] ?? "S").toUpperCase()}
          </div>
          <div className="pb-info">
            <h2>{userName}</h2>
            <p>Member since {joinDate}</p>
            <div className="pb-badges">
              <span className="pb-badge">📚 {course}</span>
              <span className="pb-badge">🎓 Student</span>
              <span className="pb-badge">✓ Verified</span>
            </div>
          </div>
        </div>

        {/* STATS */}
        {loading ? (
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height: 100 }} />)}
          </div>
        ) : (
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-card" style={{ "--sc": s.color } as React.CSSProperties}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* OVERVIEW */}
        <div className="section-title">📊 Your Overview</div>
        <div className="overview-grid">
          <div className="overview-card">
            <div className="ov-title">Study Material</div>
            {[
              { label: "📄 Notes", val: notes.length },
              { label: "📝 PYQ Papers", val: pyqs.length },
              { label: "📚 Subjects", val: subjects.length },
            ].map((item, i) => (
              <div key={i} className="ov-stat">
                <span className="ov-label">{item.label}</span>
                <span className="ov-val">{item.val}</span>
              </div>
            ))}
          </div>
          <div className="overview-card">
            <div className="ov-title">Account Info</div>
            {[
              { label: "👤 Name", val: userName.split(" ")[0] },
              { label: "📧 Email", val: user?.email?.split("@")[0] + "..." },
              { label: "📅 Joined", val: joinDate },
              { label: "🎓 Course", val: course || "—" },
            ].map((item, i) => (
              <div key={i} className="ov-stat">
                <span className="ov-label">{item.label}</span>
                <span className="ov-val" style={{ fontSize: "0.78rem" }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TIPS */}
        <div className="section-title">💡 Study Tips</div>
        <div className="tips-grid">
          {TIPS.map((t, i) => (
            <div key={i} className="tip-card">
              <div className="tip-icon">{t.icon}</div>
              <div>
                <div className="tip-title">{t.title}</div>
                <div className="tip-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-card">
          <div className="cta-title">🚀 Keep Learning!</div>
          <div className="cta-sub">You have access to {notes.length} notes and {pyqs.length} PYQ papers. Keep studying and use the AI Tutor for instant doubt-clearing!</div>
          <div className="cta-btns">
            <button className="cta-btn primary" onClick={() => router.push("/ai-tutor")}>✦ Ask AI Tutor</button>
            <button className="cta-btn outline" onClick={() => router.push("/notes")}>📄 View Notes</button>
          </div>
        </div>
      </div>
    </>
  );
}