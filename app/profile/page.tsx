"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    email: "",
    bio: "",
    course: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("eduNexDark");
    if (saved === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    // Not logged in → go to landing
    if (!user) { window.location.href = "/"; return; }
    // Logged in → fill form with whatever data we have
    setForm({
      name: userData?.name || user?.displayName || "",
      phone: userData?.phone || "",
      age: userData?.age || "",
      email: userData?.email || user?.email || "",
      bio: userData?.bio || "",
      course: userData?.course || localStorage.getItem("eduNexCourse") || "",
    });
  }, [user, userData, loading]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: form.name,
        phone: form.phone,
        age: form.age,
        bio: form.bio,
        course: form.course,
        updatedAt: new Date(),
      });
      showToast("✅ Profile updated successfully!");
      setEditing(false);
    } catch (e) {
      showToast("❌ Failed to save. Try again!");
    }
    setSaving(false);
  };

  const dm = darkMode;
  const userName = form.name || user?.displayName || "Student";
  const userPhoto = userData?.photo || user?.photoURL;
  const userInitial = (userName?.[0] ?? "S").toUpperCase();

  const COURSES = ["9th","10th","11th","12th","BCA","BTech","BBA","Other"];

  if (loading || !user) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background: dm ? "#080b12" : "#f8f9ff" }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid #4f46e5", borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --brand:#4f46e5; --accent:#0d9488;
          --bg:${dm?"#080b12":"#f0f2f8"};
          --surface:${dm?"#111827":"#ffffff"};
          --surface2:${dm?"#1a2235":"#f8fafc"};
          --text:${dm?"#f0f4ff":"#0a0f1e"};
          --sub:${dm?"#6b7a9e":"#64748b"};
          --border:${dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)"};
        }
        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background 0.3s;}

        /* TOPBAR */
        .topbar{height:64px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 5%;position:sticky;top:0;z-index:100;}
        .tb-left{display:flex;align-items:center;gap:14px;}
        .back-btn{width:38px;height:38px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--text);transition:0.2s;}
        .back-btn:hover{background:var(--border);}
        .tb-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;}
        .tb-right{display:flex;align-items:center;gap:10px;}
        .icon-btn{width:38px;height:38px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--sub);transition:0.2s;}
        .icon-btn:hover{background:var(--border);color:var(--text);}

        /* PAGE */
        .page{max-width:760px;margin:0 auto;padding:40px 20px 80px;}

        /* PROFILE HEADER */
        .profile-header{background:var(--surface);border:1px solid var(--border);border-radius:28px;padding:40px;margin-bottom:24px;position:relative;overflow:hidden;}
        .profile-header::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(79,70,229,0.12),transparent 70%);}
        .ph-top{display:flex;align-items:flex-start;gap:24px;}
        .avatar-wrap{position:relative;flex-shrink:0;}
        .avatar{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#0d9488);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:white;overflow:hidden;border:3px solid var(--border);}
        .avatar img{width:100%;height:100%;object-fit:cover;}
        .avatar-badge{position:absolute;bottom:2px;right:2px;width:22px;height:22px;border-radius:50%;background:#10b981;border:2px solid var(--surface);display:flex;align-items:center;justify-content:center;font-size:0.6rem;}
        .ph-info{flex:1;min-width:0;}
        .ph-name{font-family:'Bricolage Grotesque',sans-serif;font-size:1.6rem;font-weight:800;margin-bottom:4px;}
        .ph-email{font-size:0.85rem;color:var(--sub);margin-bottom:10px;}
        .ph-tags{display:flex;gap:8px;flex-wrap:wrap;}
        .ph-tag{padding:4px 12px;border-radius:100px;font-size:0.72rem;font-weight:700;}
        .ph-actions{display:flex;gap:10px;margin-top:20px;}
        .btn-edit{padding:10px 24px;background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border:none;border-radius:12px;font-weight:700;font-size:0.875rem;cursor:pointer;transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .btn-edit:hover{opacity:0.9;transform:translateY(-1px);}
        .btn-outline{padding:10px 20px;background:transparent;color:var(--text);border:1.5px solid var(--border);border-radius:12px;font-weight:700;font-size:0.875rem;cursor:pointer;transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .btn-outline:hover{border-color:rgba(79,70,229,0.4);color:#818cf8;}
        .btn-danger{padding:10px 20px;background:transparent;color:#ef4444;border:1.5px solid rgba(239,68,68,0.2);border-radius:12px;font-weight:700;font-size:0.875rem;cursor:pointer;transition:0.2s;font-family:'Plus Jakarta Sans',sans-serif;}
        .btn-danger:hover{background:rgba(239,68,68,0.08);}

        /* CARDS */
        .card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:28px;margin-bottom:20px;}
        .card-title{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:800;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
        .card-title span{font-size:1.1rem;}

        /* FORM */
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .form-group{display:flex;flex-direction:column;gap:6px;}
        .form-group.full{grid-column:1/-1;}
        .form-label{font-size:0.72rem;font-weight:800;color:var(--sub);text-transform:uppercase;letter-spacing:0.06em;}
        .form-value{font-size:0.92rem;font-weight:600;color:var(--text);padding:12px 0;border-bottom:1px solid var(--border);}
        .form-input{padding:11px 14px;border-radius:12px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;font-weight:500;outline:none;transition:border-color 0.2s;width:100%;}
        .form-input:focus{border-color:var(--brand);}
        .form-input::placeholder{color:var(--sub);}
        select.form-input option{background:${dm?"#111827":"white"};}
        textarea.form-input{resize:vertical;min-height:80px;}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
        .stat-box{background:var(--surface2);border:1px solid var(--border);border-radius:16px;padding:16px;text-align:center;}
        .stat-val{font-family:'Bricolage Grotesque',sans-serif;font-size:1.6rem;font-weight:800;background:linear-gradient(135deg,#818cf8,#34d399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .stat-lbl{font-size:0.72rem;color:var(--sub);font-weight:600;margin-top:2px;}

        /* SAVE BAR */
        .save-bar{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:14px 24px;display:flex;align-items:center;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,0.2);z-index:200;animation:slideUp 0.3s ease;}
        @keyframes slideUp{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
        .save-text{font-size:0.85rem;font-weight:600;color:var(--sub);}
        .btn-save{padding:10px 24px;background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border:none;border-radius:12px;font-weight:700;font-size:0.875rem;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:0.2s;}
        .btn-save:hover{opacity:0.9;}
        .btn-save:disabled{opacity:0.6;cursor:not-allowed;}
        .btn-cancel-sm{padding:10px 16px;background:transparent;border:1.5px solid var(--border);color:var(--sub);border-radius:12px;font-weight:700;font-size:0.875rem;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;}

        /* TOAST */
        .toast{position:fixed;top:80px;right:24px;background:${dm?"#1a2235":"#0a0f1e"};color:white;padding:12px 20px;border-radius:14px;font-size:0.85rem;font-weight:600;z-index:2000;animation:fadeIn 0.3s ease;box-shadow:0 8px 24px rgba(0,0,0,0.3);}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}

        @media(max-width:640px){.form-grid{grid-template-columns:1fr;}.ph-top{flex-direction:column;align-items:center;text-align:center;}.ph-tags{justify-content:center;}.ph-actions{justify-content:center;flex-wrap:wrap;}.stats-row{grid-template-columns:1fr 1fr;}}
      `}</style>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="tb-left">
          <button className="back-btn" onClick={() => router.push("/")}>← Home</button>
          <div className="tb-title">My Profile</div>
        </div>
        <div className="tb-right">
          <button className="icon-btn" onClick={() => { const n = !darkMode; setDarkMode(n); localStorage.setItem("eduNexDark", String(n)); }}>
            {dm ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="page">
        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="ph-top">
            <div className="avatar-wrap">
              <div className="avatar">
                {userPhoto ? <img src={userPhoto} alt="avatar" /> : userInitial}
              </div>
              <div className="avatar-badge">✓</div>
            </div>
            <div className="ph-info">
              <div className="ph-name">{userName}</div>
              <div className="ph-email">{form.email}</div>
              <div className="ph-tags">
                {form.course && (
                  <span className="ph-tag" style={{ background: "rgba(79,70,229,0.12)", color: "#818cf8" }}>
                    📚 {form.course}
                  </span>
                )}
                {userData?.role === "admin" && (
                  <span className="ph-tag" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                    👑 Admin
                  </span>
                )}
                <span className="ph-tag" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                  ✓ Verified
                </span>
              </div>
            </div>
          </div>
          <div className="ph-actions">
            {!editing ? (
              <>
                <button className="btn-edit" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                <button className="btn-danger" onClick={async () => { await logOut(); window.location.href = "/"; }}>🚪 Logout</button>
              </>
            ) : (
              <>
                <button className="btn-edit" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
                <button className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="stats-row">
          {[["0", "Notes Saved"], ["0", "PYQs Done"], ["0", "Day Streak"]].map(([v, l]) => (
            <div className="stat-box" key={l}>
              <div className="stat-val">{v}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>

        {/* PERSONAL INFO */}
        <div className="card">
          <div className="card-title"><span>👤</span> Personal Information</div>
          <div className="form-grid">
            {/* NAME */}
            <div className="form-group">
              <div className="form-label">Full Name</div>
              {editing
                ? <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
                : <div className="form-value">{form.name || "—"}</div>}
            </div>

            {/* AGE */}
            <div className="form-group">
              <div className="form-label">Age</div>
              {editing
                ? <input className="form-input" type="number" min="10" max="60" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} placeholder="Your age" />
                : <div className="form-value">{form.age || "—"}</div>}
            </div>

            {/* PHONE */}
            <div className="form-group">
              <div className="form-label">Phone Number</div>
              {editing
                ? <input className="form-input" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                : <div className="form-value">{form.phone || "—"}</div>}
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <div className="form-label">Email (from Google)</div>
              <div className="form-value" style={{ color: "var(--sub)" }}>{form.email}</div>
            </div>

            {/* COURSE */}
            <div className="form-group">
              <div className="form-label">Course / Class</div>
              {editing
                ? <select className="form-input" value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}>
                    <option value="">Select course</option>
                    {COURSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                : <div className="form-value">{form.course || "—"}</div>}
            </div>

            {/* BIO */}
            <div className="form-group full">
              <div className="form-label">Bio</div>
              {editing
                ? <textarea className="form-input" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell something about yourself..." />
                : <div className="form-value" style={{ whiteSpace: "pre-wrap" }}>{form.bio || "—"}</div>}
            </div>
          </div>
        </div>

        {/* ACCOUNT INFO */}
        <div className="card">
          <div className="card-title"><span>🔐</span> Account Information</div>
          <div className="form-grid">
            <div className="form-group">
              <div className="form-label">Login Method</div>
              <div className="form-value">🔵 Google Account</div>
            </div>
            <div className="form-group">
              <div className="form-label">Account Role</div>
              <div className="form-value">{userData?.role === "admin" ? "👑 Admin" : "🎓 Student"}</div>
            </div>
            <div className="form-group">
              <div className="form-label">Member Since</div>
              <div className="form-value">
                {userData?.createdAt?.seconds
                  ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">User ID</div>
              <div className="form-value" style={{ fontSize: "0.75rem", color: "var(--sub)", fontFamily: "monospace" }}>
                {user?.uid?.substring(0, 16)}...
              </div>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <div className="card-title" style={{ color: "#ef4444" }}><span>⚠️</span> Account Actions</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-danger" onClick={async () => { await logOut(); window.location.href = "/"; }}>
              🚪 Logout
            </button>
            <button className="btn-outline" onClick={() => router.push("/dashboard")}>
              🖥️ Go to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* SAVE BAR when editing */}
      {editing && (
        <div className="save-bar">
          <span className="save-text">Unsaved changes</span>
          <button className="btn-cancel-sm" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}