"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  updateDoc, serverTimestamp, query, orderBy
} from "firebase/firestore";

// ── Types ────────────────────────────────────────────────────────
interface Subject { id: string; name: string; icon: string; color: string; course: string; }
interface Note    { id: string; title: string; subject: string; course: string; driveLink: string; uploadedAt?: any; }
interface PYQ     { id: string; title: string; subject: string; course: string; year: string; driveLink: string; uploadedAt?: any; }
interface Ann     { id: string; text: string; tag: string; tagColor: string; time: string; createdAt?: any; }

const COURSES = ["9th","10th","11th","12th","BCA","BTech","BBA","Other"];
const COLORS  = ["#6366f1","#0d9488","#f59e0b","#ec4899","#8b5cf6","#ef4444","#10b981","#3b82f6"];
const ICONS   = ["📐","🔬","📖","🌍","💻","⚗️","⚡","🧬","🗄️","🌐","🧮","🤖","📊","📈","🤝","⚖️","📣","⚙️","💡","🏗️","🔧","📚","📝","🔍"];
const TAG_COLORS = ["#10b981","#f59e0b","#6366f1","#ef4444","#3b82f6","#ec4899"];

const NAV = [
  { id: "subjects",      icon: "📚", label: "Subjects" },
  { id: "notes",         icon: "📄", label: "Notes" },
  { id: "pyqs",          icon: "📝", label: "PYQ Papers" },
  { id: "announcements", icon: "📢", label: "Announcements" },
];

// ── Convert Drive share link to direct/preview link ──────────────
function drivePreviewLink(link: string) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return link;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("subjects");
  const [darkMode, setDarkMode]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState("");

  // Data
  const [subjects, setSubjects]           = useState<Subject[]>([]);
  const [notes, setNotes]                 = useState<Note[]>([]);
  const [pyqs, setPyqs]                   = useState<PYQ[]>([]);
  const [announcements, setAnnouncements] = useState<Ann[]>([]);

  // Forms
  const [subForm, setSubForm] = useState({ name: "", icon: "📚", color: "#6366f1", course: "BCA" });
  const [noteForm, setNoteForm] = useState({ title: "", subject: "", course: "BCA", driveLink: "" });
  const [pyqForm, setPyqForm]   = useState({ title: "", subject: "", course: "BCA", year: "2024", driveLink: "" });
  const [annForm, setAnnForm]   = useState({ text: "", tag: "New", tagColor: "#10b981" });

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<{ col: string; id: string } | null>(null);
  const [editSubject, setEditSubject]   = useState<Subject | null>(null);

  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const savedDark = localStorage.getItem("eduNexDark");
    if (savedDark === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { window.location.href = "/"; return; }
      if (userData?.role !== "admin") { window.location.href = "/dashboard"; return; }
      fetchAll();
    }
  }, [authLoading, user, userData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sSnap, nSnap, pSnap, aSnap] = await Promise.all([
        getDocs(query(collection(db, "subjects"),      orderBy("course"))),
        getDocs(query(collection(db, "notes"),         orderBy("uploadedAt", "desc"))),
        getDocs(query(collection(db, "pyqs"),          orderBy("uploadedAt", "desc"))),
        getDocs(query(collection(db, "announcements"), orderBy("createdAt",  "desc"))),
      ]);
      setSubjects(sSnap.docs.map(d => ({ id: d.id, ...d.data() } as Subject)));
      setNotes(nSnap.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
      setPyqs(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as PYQ)));
      setAnnouncements(aSnap.docs.map(d => ({ id: d.id, ...d.data() } as Ann)));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // ── CRUD helpers ────────────────────────────────────────────────
  const addSubject = async () => {
    if (!subForm.name.trim()) return showToast("Subject name required!");
    await addDoc(collection(db, "subjects"), subForm);
    setSubForm({ name: "", icon: "📚", color: "#6366f1", course: "BCA" });
    showToast("✅ Subject added!"); fetchAll();
  };

  const saveEditSubject = async () => {
    if (!editSubject) return;
    await updateDoc(doc(db, "subjects", editSubject.id), {
      name: editSubject.name, icon: editSubject.icon,
      color: editSubject.color, course: editSubject.course,
    });
    setEditSubject(null); showToast("✅ Subject updated!"); fetchAll();
  };

  const addNote = async () => {
    if (!noteForm.title.trim() || !noteForm.driveLink.trim()) return showToast("Title & link required!");
    await addDoc(collection(db, "notes"), { ...noteForm, uploadedAt: serverTimestamp() });
    setNoteForm({ title: "", subject: "", course: "BCA", driveLink: "" });
    showToast("✅ Note added!"); fetchAll();
  };

  const addPYQ = async () => {
    if (!pyqForm.title.trim() || !pyqForm.driveLink.trim()) return showToast("Title & link required!");
    await addDoc(collection(db, "pyqs"), { ...pyqForm, uploadedAt: serverTimestamp() });
    setPyqForm({ title: "", subject: "", course: "BCA", year: "2024", driveLink: "" });
    showToast("✅ PYQ added!"); fetchAll();
  };

  const addAnnouncement = async () => {
    if (!annForm.text.trim()) return showToast("Announcement text required!");
    const now = new Date();
    const timeStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    await addDoc(collection(db, "announcements"), { ...annForm, time: timeStr, createdAt: serverTimestamp() });
    setAnnForm({ text: "", tag: "New", tagColor: "#10b981" });
    showToast("✅ Announcement posted!"); fetchAll();
  };

  const deleteItem = async () => {
    if (!deleteTarget) return;
    await deleteDoc(doc(db, deleteTarget.col, deleteTarget.id));
    setDeleteTarget(null); showToast("🗑️ Deleted!"); fetchAll();
  };

  const dm = darkMode;

  if (authLoading || loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: dm ? "#0d0f14" : "#f0f2f8" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #4f46e5", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#64748b", fontFamily: "sans-serif", fontSize: "0.88rem" }}>Loading Admin Panel...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --brand:#4f46e5; --accent:#0d9488;
          --bg:${dm?"#0d0f14":"#f0f2f8"};
          --surface:${dm?"#161b25":"#ffffff"};
          --surface2:${dm?"#1e2535":"#f8fafc"};
          --text:${dm?"#e8edf5":"#0f172a"};
          --sub:${dm?"#7c8fa8":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);transition:background 0.3s;}
        .wrap{display:flex;min-height:100vh;}

        /* SIDEBAR */
        .sidebar{width:220px;min-height:100vh;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100;}
        .sb-logo{height:64px;display:flex;align-items:center;padding:0 20px;border-bottom:1px solid var(--border);}
        .sb-logo-text{font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;background:linear-gradient(135deg,var(--brand),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .sb-badge{font-size:0.6rem;font-weight:800;background:linear-gradient(135deg,#ef4444,#f97316);color:white;padding:2px 7px;border-radius:100px;margin-left:8px;-webkit-text-fill-color:white;}
        .sb-nav{flex:1;padding:12px 8px;display:flex;flex-direction:column;gap:2px;}
        .sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;font-size:0.875rem;font-weight:600;color:var(--sub);transition:all 0.2s;position:relative;}
        .sb-item:hover{background:${dm?"rgba(79,70,229,0.1)":"rgba(79,70,229,0.06)"};color:var(--brand);}
        .sb-item.active{background:linear-gradient(135deg,rgba(79,70,229,0.15),rgba(13,148,136,0.08));color:var(--brand);}
        .sb-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:3px;border-radius:0 3px 3px 0;background:var(--brand);}
        .sb-bottom{padding:12px 8px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:2px;}
        .sb-action{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;cursor:pointer;font-size:0.82rem;font-weight:600;transition:all 0.2s;}
        .sb-dm{color:var(--sub);}
        .sb-dm:hover{background:var(--surface2);color:var(--text);}
        .sb-logout{color:#ef4444;}
        .sb-logout:hover{background:${dm?"rgba(239,68,68,0.1)":"#fff1f1"};}
        .sb-dash{color:var(--accent);}
        .sb-dash:hover{background:${dm?"rgba(13,148,136,0.1)":"rgba(13,148,136,0.06)"};}

        /* MAIN */
        .main{margin-left:220px;flex:1;}
        .topbar{height:64px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:50;}
        .topbar-title{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;}
        .topbar-sub{font-size:0.78rem;color:var(--sub);margin-top:2px;}
        .page{padding:28px;}

        /* CARDS */
        .card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:24px;margin-bottom:24px;}
        .card-title{font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:800;margin-bottom:18px;display:flex;align-items:center;gap:8px;}

        /* FORM */
        .form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:14px;}
        .form-group{display:flex;flex-direction:column;gap:5px;}
        .form-label{font-size:0.72rem;font-weight:700;color:var(--sub);text-transform:uppercase;letter-spacing:0.05em;}
        .form-input{padding:10px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.85rem;font-weight:500;outline:none;transition:border-color 0.2s;}
        .form-input:focus{border-color:var(--brand);}
        .form-input::placeholder{color:var(--sub);}
        select.form-input option{background:${dm?"#161b25":"white"};}
        textarea.form-input{resize:vertical;min-height:80px;}

        /* ICON PICKER */
        .icon-grid{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;}
        .icon-btn{width:34px;height:34px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface2);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
        .icon-btn:hover{border-color:var(--brand);}
        .icon-btn.selected{border-color:var(--brand);background:rgba(79,70,229,0.12);}
        .color-grid{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;}
        .color-dot{width:26px;height:26px;border-radius:50%;cursor:pointer;border:2.5px solid transparent;transition:transform 0.15s;}
        .color-dot:hover{transform:scale(1.15);}
        .color-dot.selected{border-color:white;box-shadow:0 0 0 2px var(--brand);}

        /* SUBMIT BTN */
        .btn-add{padding:10px 22px;background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border:none;border-radius:12px;font-weight:700;font-size:0.88rem;cursor:pointer;transition:0.2s;display:flex;align-items:center;gap:8px;}
        .btn-add:hover{opacity:0.9;transform:translateY(-1px);}

        /* TABLE */
        .table-wrap{overflow-x:auto;}
        table{width:100%;border-collapse:collapse;font-size:0.82rem;}
        th{text-align:left;padding:10px 12px;font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:var(--sub);border-bottom:1px solid var(--border);}
        td{padding:12px;border-bottom:1px solid var(--border);color:var(--text);vertical-align:middle;}
        tr:last-child td{border-bottom:none;}
        tr:hover td{background:${dm?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.01)"};}
        .btn-del{padding:5px 12px;background:${dm?"rgba(239,68,68,0.12)":"#fff1f1"};color:#ef4444;border:none;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700;transition:0.2s;}
        .btn-del:hover{background:${dm?"rgba(239,68,68,0.2)":"#fee2e2"};}
        .btn-edit{padding:5px 12px;background:${dm?"rgba(79,70,229,0.12)":"rgba(79,70,229,0.08)"};color:var(--brand);border:none;border-radius:8px;cursor:pointer;font-size:0.75rem;font-weight:700;transition:0.2s;margin-right:6px;}
        .btn-edit:hover{background:${dm?"rgba(79,70,229,0.2)":"rgba(79,70,229,0.15)"};}
        .empty-row td{text-align:center;padding:32px;color:var(--sub);font-size:0.85rem;}

        /* TAG */
        .tag{display:inline-block;padding:2px 8px;border-radius:100px;font-size:0.68rem;font-weight:800;}

        /* MODAL */
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;}
        .modal{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;width:90%;max-width:460px;box-shadow:0 40px 80px rgba(0,0,0,0.3);}
        .modal h3{font-family:'Syne',sans-serif;font-size:1.1rem;margin-bottom:6px;}
        .modal p{color:var(--sub);font-size:0.85rem;margin-bottom:20px;}
        .modal-btns{display:flex;gap:10px;justify-content:flex-end;}
        .btn-cancel{padding:9px 20px;background:var(--surface2);color:var(--text);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-weight:600;font-size:0.85rem;}
        .btn-confirm-del{padding:9px 20px;background:#ef4444;color:white;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.85rem;}

        /* TOAST */
        .toast{position:fixed;bottom:28px;right:28px;background:${dm?"#1e2535":"#0f172a"};color:white;padding:12px 20px;border-radius:14px;font-size:0.85rem;font-weight:600;z-index:2000;animation:slideUp 0.3s ease;box-shadow:0 8px 24px rgba(0,0,0,0.3);}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* LINK PREVIEW */
        .link-preview{display:flex;align-items:center;gap:8px;padding:6px 10px;background:${dm?"rgba(13,148,136,0.1)":"rgba(13,148,136,0.06)"};border-radius:8px;font-size:0.75rem;color:var(--accent);margin-top:4px;word-break:break-all;}

        @media(max-width:768px){.main{margin-left:0;}.sidebar{display:none;}.page{padding:16px;}}
      `}</style>

      <div className="wrap">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-logo">
            <span className="sb-logo-text">EduNex AI</span>
            <span className="sb-badge">ADMIN</span>
          </div>
          <nav className="sb-nav">
            {NAV.map(n => (
              <div key={n.id} className={`sb-item ${activeTab === n.id ? "active" : ""}`} onClick={() => setActiveTab(n.id)}>
                <span>{n.icon}</span> {n.label}
              </div>
            ))}
          </nav>
          <div className="sb-bottom">
            <div className="sb-action sb-dash" onClick={() => router.push("/dashboard")}>
              <span>🖥️</span> View Dashboard
            </div>
            <div className="sb-action sb-dm" onClick={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem("eduNexDark", String(n)); }}>
              <span>{dm ? "☀️" : "🌙"}</span> {dm ? "Light Mode" : "Dark Mode"}
            </div>
            <div className="sb-action sb-logout" onClick={async () => { await logOut(); window.location.href = "/"; }}>
              <span>🚪</span> Logout
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="topbar">
            <div>
              <div className="topbar-title">{NAV.find(n => n.id === activeTab)?.label}</div>
              <div className="topbar-sub">Manage {activeTab} for students</div>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--sub)", fontWeight: 600 }}>
              👤 {userData?.name || user?.displayName}
            </div>
          </header>

          <div className="page">

            {/* ━━━━━━━━━━━━ SUBJECTS ━━━━━━━━━━━━ */}
            {activeTab === "subjects" && (
              <>
                <div className="card">
                  <div className="card-title">➕ Add New Subject</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Subject Name</label>
                      <input className="form-input" placeholder="e.g. Mathematics" value={subForm.name} onChange={e => setSubForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course</label>
                      <select className="form-input" value={subForm.course} onChange={e => setSubForm(p => ({ ...p, course: e.target.value }))}>
                        {COURSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Icon</label>
                      <div className="icon-grid">
                        {ICONS.map(ic => (
                          <button key={ic} className={`icon-btn ${subForm.icon === ic ? "selected" : ""}`} onClick={() => setSubForm(p => ({ ...p, icon: ic }))}>{ic}</button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Color</label>
                      <div className="color-grid">
                        {COLORS.map(c => (
                          <div key={c} className={`color-dot ${subForm.color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setSubForm(p => ({ ...p, color: c }))} />
                        ))}
                      </div>
                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "var(--sub)" }}>
                        Preview: <span style={{ background: `${subForm.color}20`, color: subForm.color, padding: "3px 10px", borderRadius: 100, fontWeight: 700 }}>{subForm.icon} {subForm.name || "Subject"}</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-add" onClick={addSubject}>➕ Add Subject</button>
                </div>

                <div className="card">
                  <div className="card-title">📚 All Subjects ({subjects.length})</div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Icon</th><th>Name</th><th>Course</th><th>Color</th><th>Actions</th></tr></thead>
                      <tbody>
                        {subjects.length === 0
                          ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--sub)" }}>No subjects yet. Add one above!</td></tr>
                          : subjects.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontSize: "1.3rem" }}>{s.icon}</td>
                              <td style={{ fontWeight: 700 }}>{s.name}</td>
                              <td><span className="tag" style={{ background: "rgba(79,70,229,0.1)", color: "var(--brand)" }}>{s.course}</span></td>
                              <td><div style={{ width: 20, height: 20, borderRadius: "50%", background: s.color, display: "inline-block" }} /></td>
                              <td>
                                <button className="btn-edit" onClick={() => setEditSubject(s)}>✏️ Edit</button>
                                <button className="btn-del" onClick={() => setDeleteTarget({ col: "subjects", id: s.id })}>🗑️ Delete</button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ━━━━━━━━━━━━ NOTES ━━━━━━━━━━━━ */}
            {activeTab === "notes" && (
              <>
                <div className="card">
                  <div className="card-title">➕ Add New Note</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input className="form-input" placeholder="e.g. Chapter 5 — Thermodynamics" value={noteForm.title} onChange={e => setNoteForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input className="form-input" placeholder="e.g. Physics" value={noteForm.subject} onChange={e => setNoteForm(p => ({ ...p, subject: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course</label>
                      <select className="form-input" value={noteForm.course} onChange={e => setNoteForm(p => ({ ...p, course: e.target.value }))}>
                        {COURSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label">Google Drive Link</label>
                    <input className="form-input" placeholder="https://drive.google.com/file/d/..." value={noteForm.driveLink} onChange={e => setNoteForm(p => ({ ...p, driveLink: e.target.value }))} />
                    {noteForm.driveLink && (
                      <div className="link-preview">🔗 {noteForm.driveLink}</div>
                    )}
                    <span style={{ fontSize: "0.72rem", color: "var(--sub)", marginTop: 4, display: "block" }}>
                      💡 Google Drive → Share → "Anyone with link" → Copy link
                    </span>
                  </div>
                  <button className="btn-add" onClick={addNote}>➕ Add Note</button>
                </div>

                <div className="card">
                  <div className="card-title">📄 All Notes ({notes.length})</div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Title</th><th>Subject</th><th>Course</th><th>Link</th><th>Actions</th></tr></thead>
                      <tbody>
                        {notes.length === 0
                          ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--sub)" }}>No notes yet.</td></tr>
                          : notes.map(n => (
                            <tr key={n.id}>
                              <td style={{ fontWeight: 700, maxWidth: 200 }}>{n.title}</td>
                              <td>{n.subject}</td>
                              <td><span className="tag" style={{ background: "rgba(79,70,229,0.1)", color: "var(--brand)" }}>{n.course}</span></td>
                              <td><a href={drivePreviewLink(n.driveLink)} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "0.78rem", fontWeight: 600 }}>🔗 View</a></td>
                              <td><button className="btn-del" onClick={() => setDeleteTarget({ col: "notes", id: n.id })}>🗑️ Delete</button></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ━━━━━━━━━━━━ PYQs ━━━━━━━━━━━━ */}
            {activeTab === "pyqs" && (
              <>
                <div className="card">
                  <div className="card-title">➕ Add PYQ Paper</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input className="form-input" placeholder="e.g. Mathematics Final Exam" value={pyqForm.title} onChange={e => setPyqForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input className="form-input" placeholder="e.g. Mathematics" value={pyqForm.subject} onChange={e => setPyqForm(p => ({ ...p, subject: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course</label>
                      <select className="form-input" value={pyqForm.course} onChange={e => setPyqForm(p => ({ ...p, course: e.target.value }))}>
                        {COURSES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <select className="form-input" value={pyqForm.year} onChange={e => setPyqForm(p => ({ ...p, year: e.target.value }))}>
                        {["2025","2024","2023","2022","2021","2020","2019"].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label">Google Drive Link</label>
                    <input className="form-input" placeholder="https://drive.google.com/file/d/..." value={pyqForm.driveLink} onChange={e => setPyqForm(p => ({ ...p, driveLink: e.target.value }))} />
                    {pyqForm.driveLink && <div className="link-preview">🔗 {pyqForm.driveLink}</div>}
                    <span style={{ fontSize: "0.72rem", color: "var(--sub)", marginTop: 4, display: "block" }}>
                      💡 Google Drive → Share → "Anyone with link" → Copy link
                    </span>
                  </div>
                  <button className="btn-add" onClick={addPYQ}>➕ Add PYQ</button>
                </div>

                <div className="card">
                  <div className="card-title">📝 All PYQs ({pyqs.length})</div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Title</th><th>Subject</th><th>Course</th><th>Year</th><th>Link</th><th>Actions</th></tr></thead>
                      <tbody>
                        {pyqs.length === 0
                          ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--sub)" }}>No PYQs yet.</td></tr>
                          : pyqs.map(p => (
                            <tr key={p.id}>
                              <td style={{ fontWeight: 700, maxWidth: 180 }}>{p.title}</td>
                              <td>{p.subject}</td>
                              <td><span className="tag" style={{ background: "rgba(79,70,229,0.1)", color: "var(--brand)" }}>{p.course}</span></td>
                              <td><span className="tag" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{p.year}</span></td>
                              <td><a href={drivePreviewLink(p.driveLink)} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "0.78rem", fontWeight: 600 }}>🔗 View</a></td>
                              <td><button className="btn-del" onClick={() => setDeleteTarget({ col: "pyqs", id: p.id })}>🗑️ Delete</button></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ━━━━━━━━━━━━ ANNOUNCEMENTS ━━━━━━━━━━━━ */}
            {activeTab === "announcements" && (
              <>
                <div className="card">
                  <div className="card-title">➕ Post Announcement</div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Tag</label>
                      <input className="form-input" placeholder="e.g. New, Exam, Update" value={annForm.tag} onChange={e => setAnnForm(p => ({ ...p, tag: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tag Color</label>
                      <div className="color-grid" style={{ marginTop: 6 }}>
                        {TAG_COLORS.map(c => (
                          <div key={c} className={`color-dot ${annForm.tagColor === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setAnnForm(p => ({ ...p, tagColor: c }))} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label">Announcement Text</label>
                    <textarea className="form-input" placeholder="Write your announcement here..." value={annForm.text} onChange={e => setAnnForm(p => ({ ...p, text: e.target.value }))} />
                  </div>
                  {annForm.text && (
                    <div style={{ marginBottom: 14, padding: "12px 14px", background: "var(--surface2)", borderRadius: 12, fontSize: "0.82rem" }}>
                      <span style={{ background: `${annForm.tagColor}20`, color: annForm.tagColor, padding: "2px 8px", borderRadius: 100, fontWeight: 800, fontSize: "0.68rem", marginBottom: 6, display: "inline-block" }}>{annForm.tag}</span>
                      <div style={{ color: "var(--text)", fontWeight: 500 }}>{annForm.text}</div>
                    </div>
                  )}
                  <button className="btn-add" onClick={addAnnouncement}>📢 Post Announcement</button>
                </div>

                <div className="card">
                  <div className="card-title">📢 All Announcements ({announcements.length})</div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Tag</th><th>Text</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {announcements.length === 0
                          ? <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--sub)" }}>No announcements yet.</td></tr>
                          : announcements.map(a => (
                            <tr key={a.id}>
                              <td><span className="tag" style={{ background: `${a.tagColor}20`, color: a.tagColor }}>{a.tag}</span></td>
                              <td style={{ maxWidth: 300, color: "var(--text)" }}>{a.text}</td>
                              <td style={{ color: "var(--sub)", fontSize: "0.78rem" }}>{a.time}</td>
                              <td><button className="btn-del" onClick={() => setDeleteTarget({ col: "announcements", id: a.id })}>🗑️ Delete</button></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🗑️ Confirm Delete</h3>
            <p>Yeh action undo nahi ho sakta. Kya aap sure hain?</p>
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-confirm-del" onClick={deleteItem}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SUBJECT MODAL */}
      {editSubject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✏️ Edit Subject</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={editSubject.name} onChange={e => setEditSubject(p => p ? { ...p, name: e.target.value } : p)} />
              </div>
              <div className="form-group">
                <label className="form-label">Course</label>
                <select className="form-input" value={editSubject.course} onChange={e => setEditSubject(p => p ? { ...p, course: e.target.value } : p)}>
                  {COURSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div className="icon-grid">
                  {ICONS.map(ic => (
                    <button key={ic} className={`icon-btn ${editSubject.icon === ic ? "selected" : ""}`} onClick={() => setEditSubject(p => p ? { ...p, icon: ic } : p)}>{ic}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div className="color-grid">
                  {COLORS.map(c => (
                    <div key={c} className={`color-dot ${editSubject.color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setEditSubject(p => p ? { ...p, color: c } : p)} />
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-btns">
              <button className="btn-cancel" onClick={() => setEditSubject(null)}>Cancel</button>
              <button className="btn-add" onClick={saveEditSubject}>💾 Save</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}