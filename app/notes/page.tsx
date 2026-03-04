"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function NotesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [course, setCourse] = useState(""); 
  const { user, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("eduNexDark");
      if (s === "true") setDarkMode(true);

      const savedCourse = userData?.course || localStorage.getItem("eduNexCourse") || "";
      setCourse(savedCourse);
    }
  }, [userData]);

  useEffect(() => {
    if (!user || !course) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [notesSnap, subjSnap] = await Promise.all([
          getDocs(query(collection(db, "notes"), where("course", "==", course), orderBy("uploadedAt", "desc"))),
          getDocs(query(collection(db, "subjects"), where("course", "==", course))),
        ]);
        setNotes(notesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setSubjects(subjSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [user, course]);

  const dm = darkMode;
  const filtered = notes.filter(n =>
    (selectedSubject === "All" || n.subject === selectedSubject) &&
    (n.title?.toLowerCase().includes(search.toLowerCase()) || n.subject?.toLowerCase().includes(search.toLowerCase()))
  );

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
        .back-btn{padding:7px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:0.82rem;font-weight:700;color:var(--sub);transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .back-btn:hover{color:var(--text);}
        .theme-btn{width:36px;height:36px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.9rem;}
        .page{max-width:1100px;margin:0 auto;padding:32px 5% 80px;}
        .page-header{margin-bottom:28px;}
        .page-label{font-size:0.72rem;font-weight:800;color:#818cf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;}
        .page-title{font-family:'Bricolage Grotesque',sans-serif;font-size:2rem;font-weight:800;margin-bottom:6px;}
        .page-sub{font-size:0.88rem;color:var(--sub);}
        .controls{display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap;}
        .search-wrap{flex:1;min-width:200px;position:relative;}
        .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:0.9rem;color:var(--sub);}
        .search-input{width:100%;padding:11px 14px 11px 38px;background:var(--surface);border:1.5px solid var(--border);border-radius:12px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;outline:none;transition:0.2s;}
        .search-input:focus{border-color:var(--brand);}
        .search-input::placeholder{color:var(--sub);}
        .filter-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;}
        .filter-scroll::-webkit-scrollbar{display:none;}
        .filter-btn{padding:8px 16px;border-radius:100px;font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:0.2s;border:1.5px solid var(--border);background:var(--surface);color:var(--sub);font-family:'Plus Jakarta Sans',sans-serif;}
        .filter-btn.active{background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border-color:transparent;}
        .filter-btn:hover:not(.active){border-color:var(--brand);color:var(--brand);}
        .notes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
        .note-card{background:var(--surface);border:1.5px solid var(--border);border-radius:20px;padding:22px;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
        .note-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#4f46e5,#0d9488);}
        .note-card:hover{transform:translateY(-4px);border-color:rgba(79,70,229,0.3);box-shadow:0 16px 40px ${dm?"rgba(0,0,0,0.3)":"rgba(79,70,229,0.1)"};}
        .nc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;gap:10px;}
        .nc-icon{width:44px;height:44px;border-radius:14px;background:rgba(79,70,229,0.12);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
        .nc-open{width:32px;height:32px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--sub);transition:0.2s;}
        .note-card:hover .nc-open{background:var(--brand);color:white;border-color:var(--brand);}
        .nc-title{font-family:'Bricolage Grotesque',sans-serif;font-size:0.95rem;font-weight:800;margin-bottom:8px;line-height:1.3;}
        .nc-subject{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(13,148,136,0.1);color:var(--accent);border-radius:100px;font-size:0.7rem;font-weight:700;margin-bottom:10px;}
        .nc-date{font-size:0.7rem;color:var(--sub);}
        .empty{background:var(--surface);border:1.5px dashed var(--border);border-radius:20px;padding:60px 20px;text-align:center;}
        .empty-icon{font-size:3rem;opacity:0.2;margin-bottom:14px;}
        .empty-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;opacity:0.4;margin-bottom:6px;}
        .empty-sub{font-size:0.82rem;color:var(--sub);}
        .skel{background:${dm?"rgba(255,255,255,0.05)":"rgba(79,70,229,0.05)"};border-radius:20px;animation:shimmer 1.5s infinite;}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:640px){.notes-grid{grid-template-columns:1fr;}}
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
        <div className="page-header">
          <div className="page-label">📄 Study Material</div>
          <div className="page-title">Notes</div>
          <div className="page-sub">{course} • {notes.length} notes available</div>
        </div>

        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-scroll">
            {["All", ...subjects.map(s => s.name)].map(s => (
              <button key={s} className={`filter-btn ${selectedSubject === s ? "active" : ""}`} onClick={() => setSelectedSubject(s)}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="notes-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skel" style={{ height: 160 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📄</div>
            <div className="empty-title">{search ? "No results found" : "No notes yet"}</div>
            <div className="empty-sub">{search ? "Try a different search term" : "Admin will upload notes for " + course + " soon"}</div>
          </div>
        ) : (
          <div className="notes-grid">
            {filtered.map((note, i) => (
              <div key={note.id} className="note-card" onClick={() => window.open(note.driveLink, "_blank")}>
                <div className="nc-top">
                  <div className="nc-icon">📄</div>
                  <div className="nc-open">↗</div>
                </div>
                <div className="nc-title">{note.title}</div>
                <div className="nc-subject">📚 {note.subject}</div>
                <div className="nc-date">
                  {note.uploadedAt?.seconds ? new Date(note.uploadedAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}