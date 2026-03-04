"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const YEARS = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"];

export default function PYQsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const { user, userData } = useAuth();
  const router = useRouter();
  const course = userData?.course || localStorage.getItem("eduNexCourse") || "";

  useEffect(() => {
    const s = localStorage.getItem("eduNexDark");
    if (s === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (!user || !course) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [pyqSnap, subjSnap] = await Promise.all([
          getDocs(query(collection(db, "pyqs"), where("course", "==", course), orderBy("uploadedAt", "desc"))),
          getDocs(query(collection(db, "subjects"), where("course", "==", course))),
        ]);
        setPyqs(pyqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setSubjects(subjSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [user, course]);

  const dm = darkMode;
  const filtered = pyqs.filter(p =>
    (selectedSubject === "All" || p.subject === selectedSubject) &&
    (selectedYear === "All" || p.year === selectedYear) &&
    (p.title?.toLowerCase().includes(search.toLowerCase()) || p.subject?.toLowerCase().includes(search.toLowerCase()))
  );

  const YEAR_COLORS: Record<string, string> = {
    "2025": "#3b82f6", "2024": "#6366f1", "2023": "#0d9488", "2022": "#f59e0b",
    "2021": "#ec4899", "2020": "#8b5cf6", "2019": "#10b981",
    "2018": "#f97316", "2017": "#14b8a6", "2016": "#a855f7", "2015": "#06b6d4",
    "2014": "#84cc16", "2013": "#f43f5e", "2012": "#8b5cf6", "2011": "#0ea5e9", "2010": "#d97706",
  };

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
        .page{max-width:1100px;margin:0 auto;padding:32px 5% 80px;}
        .page-label{font-size:0.72rem;font-weight:800;color:#818cf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;}
        .page-title{font-family:'Bricolage Grotesque',sans-serif;font-size:2rem;font-weight:800;margin-bottom:6px;}
        .page-sub{font-size:0.88rem;color:var(--sub);margin-bottom:28px;}
        .controls{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;}
        .search-wrap{flex:1;min-width:200px;position:relative;}
        .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:0.9rem;color:var(--sub);}
        .search-input{width:100%;padding:11px 14px 11px 38px;background:var(--surface);border:1.5px solid var(--border);border-radius:12px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;outline:none;transition:0.2s;}
        .search-input:focus{border-color:var(--brand);}
        .search-input::placeholder{color:var(--sub);}
        .filter-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:20px;}
        .filter-row::-webkit-scrollbar{display:none;}
        .filter-btn{padding:7px 14px;border-radius:100px;font-size:0.75rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:0.2s;border:1.5px solid var(--border);background:var(--surface);color:var(--sub);font-family:'Plus Jakarta Sans',sans-serif;}
        .filter-btn.active{background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border-color:transparent;}
        .filter-btn:hover:not(.active){border-color:var(--brand);color:var(--brand);}
        .filter-label{font-size:0.72rem;font-weight:800;color:var(--sub);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;}
        .pyqs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
        .pyq-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:22px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
        .pyq-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--yc,#6366f1);}
        .pyq-card:hover{transform:translateY(-4px);border-color:var(--yc,#6366f1);box-shadow:0 16px 40px ${dm?"rgba(0,0,0,0.3)":"rgba(79,70,229,0.1)"};}
        .pc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
        .pc-icon{width:44px;height:44px;border-radius:14px;background:rgba(79,70,229,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
        .pc-year{padding:4px 12px;border-radius:100px;font-size:0.75rem;font-weight:800;color:var(--yc,#6366f1);background:${dm?"rgba(99,102,241,0.12)":"rgba(99,102,241,0.08)"};}
        .pc-title{font-family:'Bricolage Grotesque',sans-serif;font-size:0.95rem;font-weight:800;margin-bottom:8px;line-height:1.3;}
        .pc-subject{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(13,148,136,0.1);color:var(--accent);border-radius:100px;font-size:0.7rem;font-weight:700;margin-bottom:10px;}
        .pc-open{display:flex;align-items:center;gap:6px;font-size:0.78rem;font-weight:700;color:var(--brand);margin-top:10px;}
        .empty{background:var(--surface);border:1.5px dashed var(--border);border-radius:20px;padding:60px 20px;text-align:center;}
        .empty-icon{font-size:3rem;opacity:0.2;margin-bottom:14px;}
        .empty-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;opacity:0.4;margin-bottom:6px;}
        .empty-sub{font-size:0.82rem;color:var(--sub);}
        .skel{background:${dm?"rgba(255,255,255,0.05)":"rgba(79,70,229,0.05)"};border-radius:20px;animation:shimmer 1.5s infinite;}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:640px){.pyqs-grid{grid-template-columns:1fr;}}
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
        <div className="page-label">📝 Practice Papers</div>
        <div className="page-title">PYQ Papers</div>
        <div className="page-sub">{course} • {pyqs.length} papers available</div>

        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search papers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="filter-label">Filter by Subject</div>
        <div className="filter-row" style={{ marginBottom: 12 }}>
          {["All", ...subjects.map(s => s.name)].map(s => (
            <button key={s} className={`filter-btn ${selectedSubject === s ? "active" : ""}`} onClick={() => setSelectedSubject(s)}>{s}</button>
          ))}
        </div>

        <div className="filter-label">Filter by Year</div>
        <div className="filter-row">
          {YEARS.map(y => (
            <button key={y} className={`filter-btn ${selectedYear === y ? "active" : ""}`} onClick={() => setSelectedYear(y)}>{y}</button>
          ))}
        </div>

        {loading ? (
          <div className="pyqs-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skel" style={{ height: 170 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📝</div>
            <div className="empty-title">{search ? "No results found" : "No PYQ papers yet"}</div>
            <div className="empty-sub">{search ? "Try different filters" : "Admin will upload papers for " + course + " soon"}</div>
          </div>
        ) : (
          <div className="pyqs-grid">
            {filtered.map((pyq) => {
              const yc = YEAR_COLORS[pyq.year] || "#6366f1";
              return (
                <div key={pyq.id} className="pyq-card" style={{ "--yc": yc } as React.CSSProperties} onClick={() => window.open(pyq.driveLink, "_blank")}>
                  <div className="pc-top">
                    <div className="pc-icon">📝</div>
                    {pyq.year && <span className="pc-year">{pyq.year}</span>}
                  </div>
                  <div className="pc-title">{pyq.title}</div>
                  <div className="pc-subject">📚 {pyq.subject}</div>
                  <div className="pc-open">↗ Open Paper</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}