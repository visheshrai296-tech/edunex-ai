"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "notes", icon: "◈", label: "Notes" },
  { id: "pyqs", icon: "📝", label: "PYQ Papers" },
  { id: "ai-tutor", icon: "✦", label: "AI Tutor" },
  { id: "progress", icon: "📊", label: "Progress" },
];

const QUICK_ACTIONS = [
  { icon: "📄", label: "Notes", sub: "Study material", id: "notes", color: "#6366f1" },
  { icon: "📝", label: "PYQ Papers", sub: "Practice papers", id: "pyqs", color: "#0d9488" },
  { icon: "✦", label: "AI Tutor", sub: "Ask doubts", id: "ai-tutor", color: "#f59e0b" },
  { icon: "📊", label: "Progress", sub: "Track growth", id: "progress", color: "#ec4899" },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [course, setCourse] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [recentPYQs, setRecentPYQs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dotsOpen, setDotsOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  const { user, userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDark = localStorage.getItem("eduNexDark");
      if (savedDark === "true") setDarkMode(true);
    }
    const savedCourse = userData?.course || (typeof window !== "undefined" ? localStorage.getItem("eduNexCourse") : "") || "";
    if (savedCourse) setCourse(savedCourse);
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");
  }, [userData]);

  useEffect(() => {
    if (!user || !course) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [subjSnap, notesSnap, pyqSnap, annSnap] = await Promise.all([
          getDocs(query(collection(db, "subjects"), where("course", "==", course))),
          getDocs(query(collection(db, "notes"), where("course", "==", course), orderBy("uploadedAt", "desc"), limit(4))),
          getDocs(query(collection(db, "pyqs"), where("course", "==", course), orderBy("uploadedAt", "desc"), limit(4))),
          getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(3))),
        ]);
        setSubjects(subjSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setRecentNotes(notesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setRecentPYQs(pyqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setAnnouncements(annSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      setDataLoading(false);
    };
    fetchData();
  }, [user, course]);

  useEffect(() => {
    if (!dotsOpen) return;
    const close = (e: MouseEvent) => setDotsOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [dotsOpen]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("eduNexDark", String(next));
  };

  const handleNav = (id: string) => {
    setActiveNav(id);
    if (id !== "dashboard") router.push(`/${id}`);
  };

  const dm = darkMode;
  const userName = userData?.name || user?.displayName || "Student";
  const firstName = userName.split(" ")[0];
  const userPhoto = userData?.photo || user?.photoURL;
  const recentAll = [
    ...recentNotes.map(n => ({ ...n, type: "Note", color: "#6366f1" })),
    ...recentPYQs.map(p => ({ ...p, type: "PYQ", color: "#0d9488" })),
  ].sort((a, b) => (b.uploadedAt?.seconds || 0) - (a.uploadedAt?.seconds || 0)).slice(0, 5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --brand:#4f46e5; --accent:#0d9488;
          --bg:${dm?"#080b12":"#f0f4ff"};
          --surface:${dm?"#0f1420":"#ffffff"};
          --surface2:${dm?"#161d2e":"#f8faff"};
          --surface3:${dm?"#1c2640":"#eef1ff"};
          --text:${dm?"#e8eeff":"#0a0f1e"};
          --sub:${dm?"#6272a4":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.06)":"rgba(79,70,229,0.08)"};
          --sidebar-w:${sidebarOpen?"248px":"72px"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);transition:background 0.3s;}
        .wrap{display:flex;min-height:100vh;}

        /* SIDEBAR */
        .sidebar{width:var(--sidebar-w);min-height:100vh;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:200;transition:width 0.3s cubic-bezier(0.16,1,0.3,1);overflow:hidden;}
        
        /* Logo */
        .sb-logo{height:64px;display:flex;align-items:center;padding:0 16px;justify-content:${sidebarOpen?"space-between":"center"};border-bottom:1px solid var(--border);flex-shrink:0;gap:8px;}
        .sb-logo-text{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:1rem;background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap;opacity:${sidebarOpen?"1":"0"};transition:opacity 0.15s;pointer-events:none;}
        .sb-toggle{width:28px;height:28px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--sub);transition:0.2s;flex-shrink:0;}
        .sb-toggle:hover{background:var(--border);color:var(--text);}

        /* User */
        .sb-user{padding:${sidebarOpen?"14px 16px":"12px 0"};display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);justify-content:${sidebarOpen?"flex-start":"center"};flex-shrink:0;cursor:pointer;transition:0.2s;}
        .sb-user:hover{background:var(--surface2);}
        .sb-avatar{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#4f46e5,#0d9488);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.9rem;overflow:hidden;border:2px solid var(--border);}
        .sb-avatar img{width:100%;height:100%;object-fit:cover;}
        .sb-uname{font-weight:700;font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}
        .sb-ucourse{font-size:0.7rem;color:var(--accent);font-weight:700;}

        /* Nav */
        .sb-nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px;}
        .sb-item{display:flex;align-items:center;gap:10px;padding:${sidebarOpen?"10px 12px":"10px 0"};justify-content:${sidebarOpen?"flex-start":"center"};border-radius:12px;cursor:pointer;font-size:0.875rem;font-weight:600;color:var(--sub);transition:all 0.2s;white-space:nowrap;position:relative;}
        .sb-item:hover{background:${dm?"rgba(129,140,248,0.08)":"rgba(79,70,229,0.06)"};color:var(--brand);}
        .sb-item.active{background:${dm?"rgba(129,140,248,0.12)":"rgba(79,70,229,0.08)"};color:var(--brand);}
        .sb-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;border-radius:0 3px 3px 0;background:linear-gradient(180deg,#818cf8,#34d399);}
        .sb-icon{font-size:1.1rem;flex-shrink:0;}
        .sb-label{opacity:${sidebarOpen?"1":"0"};transition:opacity 0.15s;}

        /* Bottom */
        .sb-bottom{padding:10px 8px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:2px;}
        .sb-action{display:flex;align-items:center;gap:10px;padding:${sidebarOpen?"9px 12px":"9px 0"};justify-content:${sidebarOpen?"flex-start":"center"};border-radius:12px;cursor:pointer;font-size:0.82rem;font-weight:600;transition:0.2s;white-space:nowrap;}
        .sb-dm{color:var(--sub);}
        .sb-dm:hover{background:var(--surface2);color:var(--text);}
        .sb-profile{color:var(--sub);}
        .sb-profile:hover{background:${dm?"rgba(129,140,248,0.08)":"rgba(79,70,229,0.06)"};color:var(--brand);}
        .sb-course{color:var(--accent);}
        .sb-course:hover{background:${dm?"rgba(13,148,136,0.08)":"rgba(13,148,136,0.06)"};}
        .sb-logout{color:#ef4444;}
        .sb-logout:hover{background:${dm?"rgba(239,68,68,0.08)":"#fff1f1"};}

        /* MAIN */
        .main{margin-left:var(--sidebar-w);flex:1;transition:margin-left 0.3s cubic-bezier(0.16,1,0.3,1);}

        /* TOPBAR */
        .topbar{height:64px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:100;}
        .tb-left{display:flex;flex-direction:column;}
        .tb-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;}
        .tb-sub{font-size:0.72rem;color:var(--sub);}
        .tb-right{display:flex;align-items:center;gap:10px;}
        .course-pill{background:${dm?"rgba(129,140,248,0.12)":"rgba(79,70,229,0.08)"};border:1px solid ${dm?"rgba(129,140,248,0.2)":"rgba(79,70,229,0.12)"};color:var(--brand);font-size:0.75rem;font-weight:800;padding:5px 14px;border-radius:100px;letter-spacing:0.02em;}
        .notif-btn{width:38px;height:38px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;position:relative;transition:0.2s;}
        .notif-btn:hover{background:var(--border);}
        .notif-dot{position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:2px solid var(--surface);}
        .dots-wrap{position:relative;}
        .dots-btn{width:38px;height:38px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.2rem;color:var(--sub);transition:0.2s;letter-spacing:2px;}
        .dots-btn:hover{background:var(--border);color:var(--text);}
        .dots-menu{position:absolute;top:calc(100% + 8px);right:0;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:8px;min-width:210px;box-shadow:0 20px 60px ${dm?"rgba(0,0,0,0.4)":"rgba(79,70,229,0.12)"};z-index:1000;animation:fadeUp 0.15s ease;}
        .dots-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:0.15s;}
        .dots-item:hover{background:var(--surface2);}
        .dots-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}
        .dots-label{font-size:0.82rem;font-weight:700;color:var(--text);}
        .dots-sub{font-size:0.7rem;color:var(--sub);}
        .tb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#0d9488);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.9rem;overflow:hidden;cursor:pointer;border:2px solid var(--border);transition:0.2s;}
        .tb-avatar:hover{border-color:var(--brand);}
        .tb-avatar img{width:100%;height:100%;object-fit:cover;}

        /* PAGE */
        .page{padding:24px;}

        /* WELCOME */
        .welcome{background:linear-gradient(135deg,#4f46e5 0%,#0d9488 100%);border-radius:24px;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;position:relative;overflow:hidden;}
        .welcome::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.06);}
        .welcome::after{content:'';position:absolute;bottom:-80px;left:30%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);}
        .welcome-text h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.5rem;color:white;margin-bottom:4px;}
        .welcome-text p{color:rgba(255,255,255,0.72);font-size:0.88rem;}
        .welcome-time{font-size:0.72rem;color:rgba(255,255,255,0.5);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;}
        .wb-btn{background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.25);color:white;padding:12px 22px;border-radius:14px;cursor:pointer;font-weight:700;font-size:0.88rem;transition:0.2s;display:flex;align-items:center;gap:8px;white-space:nowrap;position:relative;z-index:1;font-family:'Plus Jakarta Sans',sans-serif;}
        .wb-btn:hover{background:rgba(255,255,255,0.22);transform:translateY(-2px);}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 20px;position:relative;overflow:hidden;transition:0.2s;}
        .stat-card:hover{border-color:var(--sc,#6366f1);transform:translateY(-2px);}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--sc,#6366f1);}
        .stat-val{font-family:'Bricolage Grotesque',sans-serif;font-size:1.8rem;font-weight:800;color:var(--sc,#6366f1);margin-bottom:2px;}
        .stat-lbl{font-size:0.75rem;font-weight:700;color:var(--sub);}
        .stat-icon{position:absolute;right:16px;top:16px;font-size:1.4rem;opacity:0.2;}

        /* GRID */
        .main-grid{display:grid;grid-template-columns:1fr 290px;gap:20px;}

        /* SECTION */
        .sec-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
        .sec-title{font-family:'Bricolage Grotesque',sans-serif;font-size:0.95rem;font-weight:800;}
        .sec-all{font-size:0.75rem;font-weight:700;color:var(--brand);cursor:pointer;transition:0.2s;}
        .sec-all:hover{opacity:0.7;}

        /* QUICK ACTIONS */
        .quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px;}
        .quick-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:16px 14px;cursor:pointer;transition:0.2s;text-align:center;}
        .quick-card:hover{border-color:var(--qc,#6366f1);transform:translateY(-3px);box-shadow:0 8px 24px ${dm?"rgba(0,0,0,0.2)":"rgba(0,0,0,0.06)"};}
        .quick-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin:0 auto 10px;}
        .quick-label{font-size:0.8rem;font-weight:800;color:var(--text);margin-bottom:2px;}
        .quick-sub{font-size:0.7rem;color:var(--sub);}

        /* SUBJECTS */
        .subj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-bottom:24px;}
        .subj-card{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:16px 12px;cursor:pointer;transition:0.2s;position:relative;overflow:hidden;}
        .subj-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--sc,#6366f1);}
        .subj-card:hover{border-color:var(--sc,#6366f1);transform:translateY(-3px);box-shadow:0 8px 20px ${dm?"rgba(0,0,0,0.2)":"rgba(0,0,0,0.06)"};}
        .subj-icon{font-size:1.4rem;margin-bottom:8px;}
        .subj-name{font-size:0.78rem;font-weight:800;line-height:1.3;color:var(--text);}

        /* RECENT */
        .recent-list{display:flex;flex-direction:column;gap:8px;}
        .recent-item{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:0.2s;}
        .recent-item:hover{border-color:var(--brand);transform:translateX(3px);}
        .ri-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:0.95rem;flex-shrink:0;}
        .ri-title{font-size:0.82rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;}
        .ri-meta{display:flex;gap:8px;align-items:center;}
        .ri-tag{font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:100px;}
        .ri-sub{font-size:0.7rem;color:var(--sub);}
        .ri-arrow{margin-left:auto;font-size:0.7rem;color:var(--sub);flex-shrink:0;}

        /* EMPTY */
        .empty{background:var(--surface);border:1.5px dashed var(--border);border-radius:16px;padding:36px 20px;text-align:center;margin-bottom:20px;}
        .empty-icon{font-size:2.2rem;opacity:0.25;margin-bottom:10px;}
        .empty-title{font-size:0.85rem;font-weight:700;color:var(--text);opacity:0.5;margin-bottom:4px;}
        .empty-sub{font-size:0.75rem;color:var(--sub);}

        /* RIGHT COL */
        .right-col{display:flex;flex-direction:column;gap:16px;}

        /* AI CARD */
        .ai-card{background:${dm?"linear-gradient(135deg,rgba(79,70,229,0.2),rgba(13,148,136,0.12))":"linear-gradient(135deg,rgba(79,70,229,0.06),rgba(13,148,136,0.04))"};border:1px solid ${dm?"rgba(129,140,248,0.2)":"rgba(79,70,229,0.12)"};border-radius:20px;padding:20px;cursor:pointer;transition:0.2s;}
        .ai-card:hover{transform:translateY(-2px);box-shadow:0 12px 30px ${dm?"rgba(79,70,229,0.15)":"rgba(79,70,229,0.08)"};}
        .ai-card-title{font-family:'Bricolage Grotesque',sans-serif;font-size:0.95rem;font-weight:800;margin-bottom:6px;display:flex;align-items:center;gap:6px;}
        .ai-card-sub{font-size:0.78rem;color:var(--sub);margin-bottom:14px;line-height:1.5;}
        .ai-card-btn{background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border:none;border-radius:12px;padding:10px 18px;font-weight:800;font-size:0.82rem;cursor:pointer;width:100%;transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .ai-card-btn:hover{opacity:0.9;}

        /* ANNOUNCE CARD */
        .ann-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:20px;}
        .ann-item{padding:10px 0;border-bottom:1px solid var(--border);}
        .ann-item:first-child{padding-top:0;}
        .ann-item:last-child{border-bottom:none;padding-bottom:0;}
        .ann-badge{display:inline-block;padding:2px 8px;border-radius:100px;font-size:0.65rem;font-weight:800;margin-bottom:5px;}
        .ann-text{font-size:0.8rem;line-height:1.5;margin-bottom:3px;font-weight:500;}
        .ann-time{font-size:0.68rem;color:var(--sub);}

        /* SKELETON */
        .skel{background:${dm?"rgba(255,255,255,0.05)":"rgba(79,70,229,0.06)"};border-radius:12px;animation:shimmer 1.5s infinite;}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        @media(max-width:1200px){.stats-row{grid-template-columns:repeat(2,1fr);}. quick-grid{grid-template-columns:repeat(2,1fr);}.main-grid{grid-template-columns:1fr;}}
        @media(max-width:768px){.sidebar{display:none;}.main{margin-left:0;}.page{padding:16px;}.welcome{flex-direction:column;gap:14px;align-items:flex-start;}.stats-row{grid-template-columns:repeat(2,1fr);}}
      `}</style>

      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-logo">
            {sidebarOpen && <span className="sb-logo-text">EduNex AI</span>}
            <button className="sb-toggle" onClick={() => setSidebarOpen(p => !p)}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          <div className="sb-user" onClick={() => router.push("/profile")}>
            <div className="sb-avatar">
              {userPhoto ? <img src={userPhoto} alt="" /> : (firstName?.[0] ?? "S").toUpperCase()}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <div className="sb-uname">{userName}</div>
                <div className="sb-ucourse">{course || "No course"}</div>
              </div>
            )}
          </div>

          <nav className="sb-nav">
            {NAV_ITEMS.map(item => (
              <div key={item.id} className={`sb-item ${activeNav === item.id ? "active" : ""}`}
                onClick={() => handleNav(item.id)} title={!sidebarOpen ? item.label : ""}>
                <span className="sb-icon">{item.icon}</span>
                <span className="sb-label">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="sb-bottom">
            <div className="sb-action sb-profile" onClick={() => router.push("/profile")}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>👤</span>
              {sidebarOpen && <span>My Profile</span>}
            </div>
            <div className="sb-action sb-course" onClick={() => router.push("/selection-change")}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>🎓</span>
              {sidebarOpen && <span>Change Course</span>}
            </div>
            <div className="sb-action sb-dm" onClick={toggleDark}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{dm ? "☀️" : "🌙"}</span>
              {sidebarOpen && <span>{dm ? "Light Mode" : "Dark Mode"}</span>}
            </div>
            <div className="sb-action sb-logout" onClick={async () => { await logOut(); window.location.href = "/"; }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>🚪</span>
              {sidebarOpen && <span>Logout</span>}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <header className="topbar">
            <div className="tb-left">
              <div className="tb-title">{NAV_ITEMS.find(n => n.id === activeNav)?.label ?? "Dashboard"}</div>
              <div className="tb-sub">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
            <div className="tb-right">
              <button onClick={() => router.push("/")} style={{padding:"7px 16px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,cursor:"pointer",fontSize:"0.82rem",fontWeight:700,color:"var(--sub)",transition:"0.2s",fontFamily:"'Plus Jakarta Sans',sans-serif"}}
                onMouseEnter={e=>(e.currentTarget.style.color="var(--text)")}
                onMouseLeave={e=>(e.currentTarget.style.color="var(--sub)")}>
                ← Home
              </button>
              {course && <div className="course-pill">📚 {course}</div>}
              <div className="notif-btn">
                🔔
                {announcements.length > 0 && <span className="notif-dot" />}
              </div>

              {/* THREE DOTS */}
              <div className="dots-wrap">
                <div className="dots-btn" onClick={(e) => { e.stopPropagation(); setDotsOpen(p => !p); }}>⋯</div>
                {dotsOpen && (
                  <div className="dots-menu" onClick={(e) => e.stopPropagation()}>
                    {[
                      { icon: "👤", bg: "rgba(79,70,229,0.12)", label: "My Profile", sub: "Edit info & settings", action: () => router.push("/profile") },
                      { icon: "🎓", bg: "rgba(13,148,136,0.12)", label: "Change Course", sub: "Update class/course", action: () => router.push("/selection-change") },
                      { icon: "🐙", bg: "rgba(0,0,0,0.1)", label: "GitHub", sub: "github.com/visheshrai296-tech", action: () => window.open("https://github.com/visheshrai296-tech", "_blank") },
                      { icon: "🛟", bg: "rgba(245,158,11,0.12)", label: "Help & Support", sub: "support@edunex.ai", action: () => router.push("/contact") },
                      { icon: "🚪", bg: "rgba(239,68,68,0.1)", label: "Logout", sub: "Sign out of EduNex", action: async () => { await logOut(); window.location.href = "/"; } },
                    ].map((item, i) => (
                      <div key={i} className="dots-item" onClick={item.action}>
                        <div className="dots-icon" style={{ background: item.bg }}>{item.icon}</div>
                        <div>
                          <div className="dots-label">{item.label}</div>
                          <div className="dots-sub">{item.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="tb-avatar" onClick={() => router.push("/profile")}>
                {userPhoto ? <img src={userPhoto} alt="" /> : (firstName?.[0] ?? "S").toUpperCase()}
              </div>
            </div>
          </header>

          <div className="page">
            {/* WELCOME */}
            <div className="welcome" style={{ marginBottom: 24 }}>
              <div className="welcome-text">
                <div className="welcome-time">{greeting} ☀️</div>
                <h2>Hey {firstName}! 👋</h2>
                <p>{course ? `You're studying ${course} — ready to learn today?` : "Select your course to get started."}</p>
              </div>
              <button className="wb-btn" onClick={() => handleNav("ai-tutor")}>✦ Ask AI Tutor</button>
            </div>

            {/* STATS */}
            <div className="stats-row" style={{ marginBottom: 24 }}>
              {[
                { val: recentNotes.length, label: "Notes Available", icon: "📄", color: "#6366f1" },
                { val: recentPYQs.length, label: "PYQ Papers", icon: "📝", color: "#0d9488" },
                { val: subjects.length, label: "Subjects", icon: "📚", color: "#f59e0b" },
                { val: announcements.length, label: "Announcements", icon: "📢", color: "#ec4899" },
              ].map((s, i) => (
                <div className="stat-card" key={i} style={{ "--sc": s.color } as React.CSSProperties}>
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-val">{dataLoading ? "—" : s.val}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="sec-head"><div className="sec-title">Quick Access</div></div>
            <div className="quick-grid" style={{ marginBottom: 24 }}>
              {QUICK_ACTIONS.map((q, i) => (
                <div key={i} className="quick-card" style={{ "--qc": q.color } as React.CSSProperties} onClick={() => handleNav(q.id)}>
                  <div className="quick-icon" style={{ background: `${q.color}18` }}>{q.icon}</div>
                  <div className="quick-label">{q.label}</div>
                  <div className="quick-sub">{q.sub}</div>
                </div>
              ))}
            </div>

            <div className="main-grid">
              <div>
                {/* SUBJECTS */}
                <div className="sec-head">
                  <div className="sec-title">Your Subjects</div>
                  <span className="sec-all" onClick={() => handleNav("notes")}>See all →</span>
                </div>
                {dataLoading ? (
                  <div className="subj-grid" style={{ marginBottom: 24 }}>
                    {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height: 80, borderRadius: 16 }} />)}
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="empty" style={{ marginBottom: 20 }}>
                    <div className="empty-icon">📚</div>
                    <div className="empty-title">No subjects yet</div>
                    <div className="empty-sub">Admin will add subjects for {course} soon</div>
                  </div>
                ) : (
                  <div className="subj-grid" style={{ marginBottom: 24 }}>
                    {subjects.map((s, i) => (
                      <div key={i} className="subj-card" style={{ "--sc": s.color } as React.CSSProperties} onClick={() => handleNav("notes")}>
                        <div className="subj-icon">{s.icon}</div>
                        <div className="subj-name">{s.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* RECENT */}
                <div className="sec-head">
                  <div className="sec-title">Recent Activity</div>
                  <span className="sec-all" onClick={() => handleNav("notes")}>View all →</span>
                </div>
                {dataLoading ? (
                  <div className="recent-list">
                    {[1,2,3].map(i => <div key={i} className="skel" style={{ height: 62, borderRadius: 14 }} />)}
                  </div>
                ) : recentAll.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📂</div>
                    <div className="empty-title">No content yet</div>
                    <div className="empty-sub">Notes & PYQs will appear once admin uploads them</div>
                  </div>
                ) : (
                  <div className="recent-list">
                    {recentAll.map((item, i) => (
                      <div key={i} className="recent-item" onClick={() => window.open(item.driveLink, "_blank")}>
                        <div className="ri-icon" style={{ background: `${item.color}18` }}>
                          {item.type === "Note" ? "📄" : "📝"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ri-title">{item.title}</div>
                          <div className="ri-meta">
                            <span className="ri-tag" style={{ background: `${item.color}18`, color: item.color }}>{item.type}</span>
                            <span className="ri-sub">{item.subject}</span>
                          </div>
                        </div>
                        <div className="ri-arrow">→</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COL */}
              <div className="right-col">
                <div className="ai-card" onClick={() => handleNav("ai-tutor")}>
                  <div className="ai-card-title">✦ AI Tutor</div>
                  <div className="ai-card-sub">Ask any doubt, get instant step-by-step explanations in Hindi or English.</div>
                  <button className="ai-card-btn">Start a Session →</button>
                </div>

                <div className="ann-card">
                  <div className="sec-head" style={{ marginBottom: 10 }}>
                    <div className="sec-title">📢 Announcements</div>
                  </div>
                  {dataLoading ? (
                    [1,2].map(i => <div key={i} className="skel" style={{ height: 56, borderRadius: 10, marginBottom: 8 }} />)
                  ) : announcements.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px 0", color: "var(--sub)", fontSize: "0.82rem" }}>
                      <div style={{ fontSize: "1.5rem", marginBottom: 8, opacity: 0.25 }}>📭</div>
                      No announcements yet
                    </div>
                  ) : (
                    announcements.map((ann: any) => (
                      <div key={ann.id} className="ann-item">
                        <span className="ann-badge" style={{ background: `${ann.tagColor}20`, color: ann.tagColor }}>{ann.tag}</span>
                        <div className="ann-text">{ann.text}</div>
                        <div className="ann-time">{ann.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}