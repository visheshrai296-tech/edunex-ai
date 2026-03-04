"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState({name:"",email:"",subject:"",message:""});
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const s = localStorage.getItem("eduNexDark");
    if (s !== null) setDarkMode(s === "true");
  }, []);
  const dm = darkMode;

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    window.open(`mailto:support@edunex.ai?subject=${encodeURIComponent(form.subject || "Contact from "+form.name)}&body=${encodeURIComponent("Name: "+form.name+"\nEmail: "+form.email+"\n\n"+form.message)}`);
    setSent(true);
  };

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
        .page{max-width:900px;margin:0 auto;padding:60px 5% 80px;}
        .label{display:inline-block;padding:4px 14px;border-radius:100px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.25);font-size:0.72rem;font-weight:800;color:#818cf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;}
        h1{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(2rem,5vw,3rem);font-weight:800;margin-bottom:12px;}
        .sub{color:var(--sub);font-size:1rem;line-height:1.7;margin-bottom:48px;}
        .grid{display:grid;grid-template-columns:1fr 1.5fr;gap:32px;}
        .info-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:32px;}
        .info-card h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:20px;}
        .info-item{display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;}
        .info-icon{width:40px;height:40px;border-radius:12px;background:rgba(79,70,229,0.12);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
        .info-label{font-size:0.72rem;color:var(--sub);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;}
        .info-val{font-size:0.88rem;font-weight:600;color:var(--text);}
        .form-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:32px;}
        .form-card h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;margin-bottom:20px;}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
        .form-group{display:flex;flex-direction:column;gap:6px;}
        .form-label{font-size:0.72rem;font-weight:800;color:var(--sub);text-transform:uppercase;letter-spacing:0.06em;}
        .form-input{padding:11px 14px;border-radius:12px;border:1.5px solid var(--border);background:var(--surface2);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;outline:none;transition:0.2s;width:100%;}
        .form-input:focus{border-color:#4f46e5;}
        textarea.form-input{resize:vertical;min-height:110px;margin-bottom:14px;}
        .submit-btn{width:100%;padding:13px;background:linear-gradient(135deg,#4f46e5,#0d9488);color:white;border:none;border-radius:12px;font-weight:800;font-size:0.95rem;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:0.2s;}
        .submit-btn:hover{opacity:0.9;transform:translateY(-1px);}
        .success{text-align:center;padding:40px 20px;color:#10b981;font-weight:700;font-size:1rem;}
        @media(max-width:768px){.grid{grid-template-columns:1fr;}.form-row{grid-template-columns:1fr;}}
      `}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/")}>EduNex AI</div>
        <button className="back-btn" onClick={() => router.push("/")}>← Back</button>
      </nav>
      <div className="page">
        <div className="label">Contact Us</div>
        <h1>Get in Touch 👋</h1>
        <p className="sub">Have a question, suggestion or want to partner with us? We'd love to hear from you.</p>
        <div className="grid">
          <div className="info-card">
            <h2>Contact Information</h2>
            {[
              {icon:"📧",label:"Email",val:"support@edunex.ai"},
              {icon:"🐙",label:"GitHub",val:"github.com/visheshrai296-tech"},
              {icon:"📍",label:"Location",val:"India 🇮🇳"},
              {icon:"⏰",label:"Response Time",val:"Within 24 hours"},
            ].map((item,i) => (
              <div className="info-item" key={i}>
                <div className="info-icon">{item.icon}</div>
                <div><div className="info-label">{item.label}</div><div className="info-val">{item.val}</div></div>
              </div>
            ))}
          </div>
          <div className="form-card">
            <h2>Send a Message</h2>
            {sent ? (
              <div className="success">✅ Message sent! We'll get back to you within 24 hours.</div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="Rahul Sharma" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="rahul@gmail.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
                </div>
                <div className="form-group" style={{marginBottom:14}}><label className="form-label">Subject</label><input className="form-input" placeholder="How can we help?" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}/></div>
                <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" placeholder="Tell us more..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}/></div>
                <button className="submit-btn" onClick={handleSubmit}>Send Message →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}