"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  { icon: "🤖", title: "AI Tutor", desc: "Get instant answers to any academic question. Like having a personal tutor available 24/7.", color: "#6366f1" },
  { icon: "📄", title: "Smart Notes", desc: "Access organized, subject-wise notes curated by educators for your exact curriculum.", color: "#0d9488" },
  { icon: "📝", title: "PYQ Papers", desc: "Practice with previous year question papers filtered by subject, year and course.", color: "#f59e0b" },
  { icon: "📊", title: "Progress Tracker", desc: "Track your learning journey with detailed analytics and performance insights.", color: "#ec4899" },
  { icon: "🎯", title: "Personalized", desc: "Content tailored to your class — 9th, 10th, 11th, 12th, BCA, BTech, BBA and more.", color: "#8b5cf6" },
  { icon: "⚡", title: "Instant Access", desc: "No waiting. Login with Google and get access to all study materials immediately.", color: "#10b981" },
];

const STEPS = [
  { num: "01", title: "Create Account", desc: "Sign in with your Google account in one click. No forms, no passwords." },
  { num: "02", title: "Select Your Course", desc: "Choose your class or course — 9th to 12th, BCA, BTech, BBA and more." },
  { num: "03", title: "Start Learning", desc: "Access notes, PYQs, AI Tutor and track your progress — all in one place." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", course: "12th Science", avatar: "P", text: "EduNex AI has completely changed how I study. The AI Tutor explains complex concepts in a way my textbook never could!", rating: 5 },
  { name: "Rahul Verma", course: "BCA 2nd Year", avatar: "R", text: "PYQ papers organized by subject saved me so much time during exams. Scored 87% this semester!", rating: 5 },
  { name: "Ananya Singh", course: "11th Commerce", avatar: "A", text: "The progress tracker keeps me motivated. I can see exactly where I need to improve. Highly recommend!", rating: 5 },
  { name: "Arjun Patel", course: "BTech CSE", avatar: "A", text: "AI Tutor works great in Hindi too! Cleared all my doubts at 2am before my DSA exam. Lifesaver!", rating: 5 },
];

const PLANS = [
  {
    name: "Free", price: "₹0", period: "forever", color: "#64748b",
    features: ["Access to basic notes", "5 AI Tutor messages/day", "PYQ papers (last 2 years)", "Progress tracker (basic)"],
    cta: "Get Started Free", popular: false,
  },
  {
    name: "Pro", price: "₹199", period: "per month", color: "#4f46e5",
    features: ["All notes & study material", "Unlimited AI Tutor", "All PYQ papers", "Advanced progress analytics", "Priority support", "Offline access"],
    cta: "Start Pro Plan", popular: true,
  },
  {
    name: "Institute", price: "₹999", period: "per month", color: "#0d9488",
    features: ["Everything in Pro", "Up to 100 students", "Admin panel access", "Custom content upload", "Bulk student management", "Dedicated support"],
    cta: "Contact Us", popular: false,
  },
];

const FAQS = [
  { q: "Is EduNex AI free to use?", a: "Yes! We have a free plan that gives you access to basic notes, PYQ papers and limited AI Tutor messages. Upgrade to Pro for unlimited access." },
  { q: "Which courses and classes are supported?", a: "We support 9th, 10th, 11th, 12th (all streams), BCA, BTech, BBA and more. Content is aligned with CBSE, ICSE and major state boards." },
  { q: "How does the AI Tutor work?", a: "Our AI Tutor is powered by Google Gemini. Just type your question and get instant, detailed explanations. It understands Hindi and Hinglish too!" },
  { q: "Can I access EduNex on mobile?", a: "Yes! EduNex AI is fully responsive and works perfectly on all devices — mobile, tablet and desktop." },
  { q: "How are notes and PYQs added?", a: "All content is verified and uploaded by our admin team. We ensure quality and relevance to current curricula." },
];

const TEAM = [
  { name: "Vishesh", role: "Founder & CEO", avatar: "V", desc: "Passionate about making quality education accessible to every student in India." },
  { name: "AI Team", role: "Technology", avatar: "🤖", desc: "Building cutting-edge AI tools to personalize learning for every student." },
  { name: "Edu Team", role: "Content & Curriculum", avatar: "📚", desc: "Expert educators curating high-quality notes and study materials." },
];

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dotsOpen, setDotsOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, userData } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("eduNexDark");
    if (saved !== null) setDarkMode(saved === "true");
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user && userData?.course) {
      // Already logged in + course selected → show dashboard button
    }
  }, [user, userData]);

  useEffect(() => {
    if (!dotsOpen) return;
    const close = () => setDotsOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [dotsOpen]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("eduNexDark", String(next));
  };

  const handleLogin = async (redirect = "/selection") => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      // Selection page will auto-redirect to dashboard if course already saved
      router.push("/selection");
    } catch (e) {
      console.error(e);
    }
    setAuthLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const dm = darkMode;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Bricolage+Grotesque:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --brand: #4f46e5;
          --accent: #0d9488;
          --gold: #f59e0b;
          --bg: ${dm ? '#080b12' : '#f8f9ff'};
          --bg2: ${dm ? '#0d1117' : '#ffffff'};
          --surface: ${dm ? '#111827' : '#ffffff'};
          --surface2: ${dm ? '#1a2235' : '#f1f5f9'};
          --text: ${dm ? '#f0f4ff' : '#0a0f1e'};
          --sub: ${dm ? '#6b7a9e' : '#64748b'};
          --border: ${dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
          --glow: ${dm ? 'rgba(79,70,229,0.15)' : 'rgba(79,70,229,0.08)'};
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; transition: background 0.4s, color 0.4s; }

        /* NOISE TEXTURE */
        body::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: ${dm ? '0.4' : '0.2'};
        }

        /* NAVBAR */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 68px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%;
          background: ${scrolled ? (dm ? 'rgba(8,11,18,0.85)' : 'rgba(248,249,255,0.85)') : 'transparent'};
          backdrop-filter: ${scrolled ? 'blur(20px)' : 'none'};
          border-bottom: ${scrolled ? '1px solid var(--border)' : '1px solid transparent'};
          transition: all 0.3s;
        }
        .nav-logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 1.3rem; background: linear-gradient(135deg, #818cf8, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { font-size: 0.875rem; font-weight: 600; color: var(--sub); cursor: pointer; transition: color 0.2s; text-decoration: none; }
        .nav-link:hover { color: var(--text); }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-theme { width: 38px; height: 38px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: 0.2s; }
        .nav-theme:hover { background: var(--border); }
        .nav-cta { padding: 9px 20px; background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(79,70,229,0.35); }
        .hamburger { display: none; width: 38px; height: 38px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border); cursor: pointer; align-items: center; justify-content: center; font-size: 1.1rem; }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 120px 5% 80px; text-align: center; position: relative;
        }
        .hero-glow {
          position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
          width: 800px; height: 500px; border-radius: 50%;
          background: radial-gradient(ellipse, ${dm ? 'rgba(79,70,229,0.12)' : 'rgba(79,70,229,0.06)'} 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 100px;
          background: ${dm ? 'rgba(79,70,229,0.15)' : 'rgba(79,70,229,0.08)'};
          border: 1px solid ${dm ? 'rgba(79,70,229,0.3)' : 'rgba(79,70,229,0.2)'};
          font-size: 0.8rem; font-weight: 700; color: #818cf8;
          margin-bottom: 28px; animation: fadeUp 0.6s ease both;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .hero h1 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero h1 .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #34d399 50%, #f59e0b 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem); color: var(--sub); max-width: 580px;
          line-height: 1.7; margin: 0 auto 40px;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 60px; animation: fadeUp 0.6s 0.3s ease both; }
        .btn-primary { padding: 14px 32px; background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.25s; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 10px; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(79,70,229,0.4); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary { padding: 14px 32px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 14px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.25s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-secondary:hover { background: var(--surface2); border-color: rgba(79,70,229,0.3); }

        .hero-stats { display: flex; gap: 48px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.4s ease both; }
        .stat-item { text-align: center; }
        .stat-num { font-family: 'Bricolage Grotesque', sans-serif; font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #818cf8, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 0.78rem; color: var(--sub); font-weight: 600; margin-top: 2px; }

        /* SECTIONS */
        section { position: relative; z-index: 1; }
        .section-pad { padding: 100px 5%; }
        .section-label { display: inline-block; padding: 4px 14px; border-radius: 100px; background: var(--glow); border: 1px solid ${dm ? 'rgba(79,70,229,0.25)' : 'rgba(79,70,229,0.15)'}; font-size: 0.72rem; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; }
        .section-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
        .section-sub { color: var(--sub); font-size: 1.05rem; line-height: 1.7; max-width: 560px; }
        .text-center { text-align: center; }
        .text-center .section-sub { margin: 0 auto; }

        /* FEATURES */
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
        .feature-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 24px; padding: 32px 28px;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .feature-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--fc, #6366f1), transparent); }
        .feature-card:hover { transform: translateY(-6px); border-color: var(--fc, #6366f1); box-shadow: 0 20px 50px ${dm ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}; }
        .feature-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 20px; }
        .feature-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
        .feature-desc { color: var(--sub); font-size: 0.88rem; line-height: 1.65; }

        /* HOW IT WORKS */
        .hiw-bg { background: ${dm ? 'linear-gradient(180deg, transparent, rgba(79,70,229,0.05), transparent)' : 'linear-gradient(180deg, transparent, rgba(79,70,229,0.03), transparent)'}; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 60px; position: relative; }
        .steps-grid::before { content: ''; position: absolute; top: 32px; left: 16.67%; right: 16.67%; height: 1px; background: linear-gradient(90deg, transparent, var(--border), var(--border), transparent); }
        .step-card { text-align: center; padding: 0 20px; }
        .step-num { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 8px 24px rgba(79,70,229,0.3); }
        .step-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px; }
        .step-desc { color: var(--sub); font-size: 0.88rem; line-height: 1.65; }

        /* TESTIMONIALS */
        .testimonials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 60px; }
        .testi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 28px; transition: 0.3s; }
        .testi-card:hover { border-color: rgba(79,70,229,0.3); transform: translateY(-3px); }
        .testi-stars { display: flex; gap: 3px; margin-bottom: 14px; }
        .star { color: #f59e0b; font-size: 0.9rem; }
        .testi-text { font-size: 0.92rem; line-height: 1.7; color: var(--text); margin-bottom: 20px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; flex-shrink: 0; }
        .testi-name { font-weight: 700; font-size: 0.9rem; }
        .testi-course { font-size: 0.75rem; color: var(--sub); }

        /* PRICING */
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 60px; align-items: start; }
        .price-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 32px 28px; position: relative; transition: 0.3s; }
        .price-card.popular { border-color: rgba(79,70,229,0.5); background: ${dm ? 'linear-gradient(145deg, rgba(79,70,229,0.12), rgba(13,148,136,0.06))' : 'linear-gradient(145deg, rgba(79,70,229,0.04), rgba(13,148,136,0.02))'}; transform: scale(1.03); }
        .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 4px 16px; background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; border-radius: 100px; font-size: 0.72rem; font-weight: 800; white-space: nowrap; }
        .price-name { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--sub); margin-bottom: 12px; }
        .price-amount { font-family: 'Bricolage Grotesque', sans-serif; font-size: 2.8rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .price-period { font-size: 0.8rem; color: var(--sub); margin-bottom: 28px; }
        .price-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .price-feature { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--sub); }
        .price-feature::before { content: '✓'; color: #10b981; font-weight: 800; flex-shrink: 0; }
        .price-btn { width: 100%; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; border: none; }
        .price-btn.main { background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; }
        .price-btn.main:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(79,70,229,0.3); }
        .price-btn.outline { background: transparent; color: var(--text); border: 1.5px solid var(--border); }
        .price-btn.outline:hover { border-color: rgba(79,70,229,0.4); color: #818cf8; }

        /* FAQ */
        .faq-list { max-width: 760px; margin: 60px auto 0; display: flex; flex-direction: column; gap: 12px; }
        .faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: border-color 0.2s; }
        .faq-item.open { border-color: rgba(79,70,229,0.3); }
        .faq-q { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-weight: 700; font-size: 0.95rem; gap: 12px; }
        .faq-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; flex-shrink: 0; transition: 0.2s; color: var(--sub); }
        .faq-item.open .faq-icon { background: rgba(79,70,229,0.15); color: #818cf8; transform: rotate(45deg); }
        .faq-a { padding: 0 24px 20px; color: var(--sub); font-size: 0.88rem; line-height: 1.7; }

        /* TEAM */
        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 60px; }
        .team-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 32px 24px; text-align: center; transition: 0.3s; }
        .team-card:hover { border-color: rgba(79,70,229,0.3); transform: translateY(-4px); }
        .team-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 800; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(79,70,229,0.25); }
        .team-name { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
        .team-role { font-size: 0.78rem; color: #818cf8; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
        .team-desc { font-size: 0.85rem; color: var(--sub); line-height: 1.6; }

        /* CTA SECTION */
        .cta-section { margin: 0 5% 100px; border-radius: 32px; background: linear-gradient(135deg, #4f46e5 0%, #0d9488 100%); padding: 80px 5%; text-align: center; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; top: -80px; right: -80px; width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,0.06); }
        .cta-section::after { content: ''; position: absolute; bottom: -100px; left: -60px; width: 280px; height: 280px; border-radius: 50%; background: rgba(255,255,255,0.04); }
        .cta-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; color: white; margin-bottom: 16px; position: relative; z-index: 1; }
        .cta-sub { color: rgba(255,255,255,0.75); font-size: 1.05rem; margin-bottom: 36px; position: relative; z-index: 1; }
        .cta-btn { padding: 15px 36px; background: white; color: #4f46e5; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.25s; font-family: 'Plus Jakarta Sans', sans-serif; position: relative; z-index: 1; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,0.2); }

        /* FOOTER */
        .footer { background: var(--surface); border-top: 1px solid var(--border); padding: 60px 5% 32px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 1.4rem; background: linear-gradient(135deg, #818cf8, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
        .footer-desc { font-size: 0.85rem; color: var(--sub); line-height: 1.7; max-width: 280px; }
        .footer-col-title { font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px; color: var(--text); }
        .footer-link { display: block; font-size: 0.85rem; color: var(--sub); text-decoration: none; margin-bottom: 10px; transition: color 0.2s; cursor: pointer; }
        .footer-link:hover { color: #818cf8; }
        .footer-bottom { border-top: 1px solid var(--border); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .footer-copy { font-size: 0.8rem; color: var(--sub); }
        .footer-made { font-size: 0.8rem; color: var(--sub); }
        .footer-made span { color: #818cf8; }

        /* MOBILE MENU */
        .mobile-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; background: ${dm ? 'rgba(8,11,18,0.97)' : 'rgba(248,249,255,0.97)'}; backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 20px 5%; z-index: 999; flex-direction: column; gap: 4px; }
        .mobile-menu.open { display: flex; }
        .mobile-link { padding: 12px 16px; border-radius: 12px; font-weight: 600; font-size: 0.95rem; color: var(--sub); cursor: pointer; transition: 0.2s; }
        .mobile-link:hover { background: var(--surface2); color: var(--text); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }

        @media(max-width:1024px) {
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin-left: auto; margin-right: auto; }
          .price-card.popular { transform: none; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width:768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .steps-grid { grid-template-columns: 1fr; }
          .steps-grid::before { display: none; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 28px; }
        }
        @media(max-width:640px) {
          .features-grid { grid-template-columns: 1fr; }
          .hero-btns { flex-direction: column; align-items: center; }
          .section-pad { padding: 70px 5%; }
          .cta-section { padding: 60px 5%; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>EduNex AI</div>
        <div className="nav-links">
          {["features","how-it-works","pricing","faq","team"].map(id => (
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}>
              {id === "how-it-works" ? "How it Works" : id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-theme" onClick={toggleDark}>{dm ? "☀️" : "🌙"}</button>
          <div style={{position:"relative"}}>
            <button className="nav-theme" onClick={(e) => { e.stopPropagation(); setDotsOpen(p => !p); }} title="More">⋯</button>
            {dotsOpen && (
              <div onClick={(e) => e.stopPropagation()} style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"8px",minWidth:200,boxShadow:"0 20px 50px rgba(0,0,0,0.2)",zIndex:2000}}>
                {[
                  {icon:"👤",label:"My Profile",sub:"Edit your info & settings",action:"/profile"},
                  {icon:"🎓",label:"Change Course",sub:"Update your class/course",action:"change-course"},
                  {icon:"🏫",label:"For Institutes",sub:"Bulk student plans",action:null},
                  {icon:"📣",label:"Refer & Earn",sub:"Get 1 month free",action:null},
                  {icon:"💬",label:"Community",sub:"Join student Discord",action:null},
                  {icon:"🛟",label:"Help & Support",sub:"support@edunex.ai",action:null},
                  {icon:"🐙",label:"GitHub",sub:"github.com/visheshrai296-tech",action:"https://github.com/visheshrai296-tech"},
                ].map((item,i) => (
                  <div key={i} onClick={() => { 
                    setDotsOpen(false);
                    if(item.label === "My Profile") {
  if(user) router.push("/profile");
  else handleLogin();
}
                    else if(item.action) window.open(item.action, "_blank");
                  }} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,cursor:"pointer",transition:"0.15s"}}
                    onMouseEnter={e => (e.currentTarget.style.background="var(--surface2)")}
                    onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                    <span style={{fontSize:"1.1rem",width:28,textAlign:"center"}}>{item.icon}</span>
                    <div>
                      <div style={{fontSize:"0.82rem",fontWeight:700,color:"var(--text)"}}>{item.label}</div>
                      <div style={{fontSize:"0.7rem",color:"var(--sub)"}}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="nav-cta" onClick={() => user && userData?.course ? router.push("/dashboard") : handleLogin()}>
            {authLoading ? "..." : user && userData?.course ? "Go to Dashboard →" : "Get Started Free"}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(p => !p)}>☰</button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {["features","how-it-works","pricing","faq","team"].map(id => (
          <div key={id} className="mobile-link" onClick={() => scrollTo(id)}>
            {id === "how-it-works" ? "How it Works" : id.charAt(0).toUpperCase() + id.slice(1)}
          </div>
        ))}
        <div style={{paddingTop:8}}>
          <button className="btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={() => handleLogin()}>
            Get Started Free →
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <span className="badge-dot" />
          Now powered by Groq ⚡ Llama 3.3
        </div>
        <h1>
          The Smarter Way<br/>
          <span className="gradient-text">Indian Students Study</span>
        </h1>
        <p className="hero-sub">
          AI-powered notes, PYQ papers, and personalized tutoring — all in one platform built for 9th–12th, BCA, BTech & BBA students.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => user && userData?.course ? router.push("/dashboard") : handleLogin()} disabled={authLoading}>
            {authLoading ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}} /> Signing in...</> : user && userData?.course ? <>🚀 Go to Dashboard</> : <>🚀 Start Learning Free</>}
          </button>
          <button className="btn-secondary" onClick={() => scrollTo("features")}>
            Explore Features →
          </button>
        </div>
        <div className="hero-stats">
          {[["10K+","Students"],["500+","Study Materials"],["50+","Courses"],["4.9★","Rating"]].map(([n,l]) => (
            <div className="stat-item" key={l}>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-pad" id="features">
        <div className="text-center">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything You Need to<br/>Ace Your Exams</h2>
          <p className="section-sub">One platform that replaces your coaching notes, PYQ books, and doubt sessions.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i} style={{"--fc": f.color} as React.CSSProperties}>
              <div className="feature-icon" style={{background: `${f.color}18`}}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-pad hiw-bg" id="how-it-works">
        <div className="text-center">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Up and Running<br/>in 3 Simple Steps</h2>
          <p className="section-sub">No complicated setup. Just login and start learning immediately.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" id="testimonials">
        <div className="text-center">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">Loved by Students<br/>Across India</h2>
          <p className="section-sub">Join thousands of students who are already studying smarter with EduNex AI.</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="testi-stars">{[...Array(t.rating)].map((_,j) => <span key={j} className="star">★</span>)}</div>
              <div className="testi-text">"{t.text}"</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.avatar}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-course">{t.course}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad" id="pricing" style={{background: dm ? 'linear-gradient(180deg, transparent, rgba(79,70,229,0.04), transparent)' : undefined}}>
        <div className="text-center">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple, Transparent<br/>Pricing</h2>
          <p className="section-sub">Start for free. Upgrade when you need more. No hidden charges.</p>
        </div>
        <div className="pricing-grid">
          {PLANS.map((p, i) => (
            <div className={`price-card ${p.popular ? 'popular' : ''}`} key={i}>
              {p.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <div className="price-name">{p.name}</div>
              <div className="price-amount" style={{color: p.popular ? '#818cf8' : 'var(--text)'}}>{p.price}</div>
              <div className="price-period">{p.period}</div>
              <ul className="price-features">
                {p.features.map((f, j) => <li key={j} className="price-feature">{f}</li>)}
              </ul>
              <button className={`price-btn ${p.popular ? 'main' : 'outline'}`} onClick={() => p.name === "Free" || p.name === "Pro" ? handleLogin() : scrollTo("team")}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" id="faq">
        <div className="text-center">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Got Questions?<br/>We've Got Answers</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item ${openFAQ === i ? 'open' : ''}`}>
              <div className="faq-q" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                {f.q}
                <div className="faq-icon">+</div>
              </div>
              {openFAQ === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="section-pad" id="team">
        <div className="text-center">
          <div className="section-label">Our Team</div>
          <h2 className="section-title">Built with ❤️ for<br/>Indian Students</h2>
          <p className="section-sub">A passionate team dedicated to making quality education accessible to every student.</p>
        </div>
        <div className="team-grid">
          {TEAM.map((t, i) => (
            <div className="team-card" key={i}>
              <div className="team-avatar">{t.avatar}</div>
              <div className="team-name">{t.name}</div>
              <div className="team-role">{t.role}</div>
              <div className="team-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-title">Ready to Study Smarter?</div>
        <div className="cta-sub">Join 10,000+ students already using EduNex AI to ace their exams.</div>
        <button className="cta-btn" onClick={() => user && userData?.course ? router.push("/dashboard") : handleLogin()}>
          {authLoading ? "Signing in..." : user && userData?.course ? "🚀 Go to Dashboard" : "🚀 Get Started for Free"}
        </button>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">EduNex AI</div>
            <div className="footer-desc">India's smartest study platform. AI-powered learning for every student, every course, every exam.</div>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            {[
              {label:"Features", action:() => scrollTo("features")},
              {label:"How it Works", action:() => scrollTo("how-it-works")},
              {label:"Pricing", action:() => scrollTo("pricing")},
              {label:"AI Tutor", action:() => handleLogin("/ai-tutor")},
              {label:"Notes", action:() => handleLogin("/notes")},
              {label:"PYQ Papers", action:() => handleLogin("/pyqs")},
            ].map(item => (
              <span key={item.label} className="footer-link" onClick={item.action}>{item.label}</span>
            ))}
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            {[
              {label:"About Us", path:"/about"},
              {label:"Team", action:() => scrollTo("team")},
              {label:"Blog", path:"/blog"},
              {label:"Careers", path:"/careers"},
              {label:"Contact", path:"/contact"},
              {label:"Privacy Policy", path:"/privacy"},
            ].map(item => (
              <span key={item.label} className="footer-link" onClick={() => item.path ? router.push(item.path) : item.action?.()}>{item.label}</span>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 EduNex AI. All rights reserved.</div>
          <div className="footer-made">Made with <span>♥</span> in India 🇮🇳</div>
        </div>
      </footer>
    </>
  );
}