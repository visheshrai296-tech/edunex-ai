"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
    const s = localStorage.getItem("eduNexDark");
    if (s !== null) setDarkMode(s === "true");
  }, []);
  const dm = darkMode;

  const sections = [
    { title: "Information We Collect", content: "When you sign in with Google, we collect your name, email address, and profile photo. We also store your course selection, progress data, and any profile information you choose to add (phone number, age, bio). We do not collect any payment information." },
    { title: "How We Use Your Information", content: "We use your information to personalize your learning experience, show relevant study materials for your course, track your progress, and improve our platform. We never sell your personal data to third parties." },
    { title: "Data Storage & Security", content: "Your data is stored securely on Google Firebase servers located in Mumbai, India (asia-south1). We use industry-standard security practices including encryption in transit and at rest. Only you and authorized admins can access your personal data." },
    { title: "Google Sign-In", content: "We use Google OAuth for authentication. We only request access to your basic profile information (name, email, photo). We do not have access to your Google passwords, Gmail, Drive, or any other Google services." },
    { title: "Cookies & Local Storage", content: "We use browser localStorage to remember your preferences (dark mode, course selection). We do not use tracking cookies or third-party advertising cookies." },
    { title: "Your Rights", content: "You can update your profile information at any time from the Profile page. You can delete your account by contacting us at support@edunex.ai. Upon deletion, all your personal data will be permanently removed within 30 days." },
    { title: "Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at support@edunex.ai or visit our Contact page." },
  ];

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
        .page{max-width:760px;margin:0 auto;padding:60px 5% 80px;}
        .label{display:inline-block;padding:4px 14px;border-radius:100px;background:rgba(79,70,229,0.12);border:1px solid rgba(79,70,229,0.25);font-size:0.72rem;font-weight:800;color:#818cf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;}
        h1{font-family:'Bricolage Grotesque',sans-serif;font-size:2.5rem;font-weight:800;margin-bottom:12px;}
        .updated{font-size:0.82rem;color:var(--sub);margin-bottom:48px;}
        .section{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;margin-bottom:16px;}
        .section h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:800;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
        .section p{color:var(--sub);font-size:0.88rem;line-height:1.75;}
      `}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => router.push("/")}>EduNex AI</div>
        <button className="back-btn" onClick={() => router.push("/")}>← Back</button>
      </nav>
      <div className="page">
        <div className="label">Legal</div>
        <h1>Privacy Policy 🔒</h1>
        <div className="updated">Last updated: March 4, 2026</div>
        {sections.map((s,i) => (
          <div className="section" key={i}>
            <h2>📌 {s.title}</h2>
            <p>{s.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}