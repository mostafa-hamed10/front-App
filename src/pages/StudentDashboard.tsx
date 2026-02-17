import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bot } from "lucide-react";

Chart.register(...registerables);

interface DashboardData {
  studentName: string;
  programTitle: string;
  totalHours: number;
  rank: number;
  points: number;
  targetHours: number;
  monthlyHours: number[];
  monthNames: string[];
}
interface Student {
  id: number;
  name: string;
  totalHours: number;
  programs?: {
    title: string;
  };
}

const StudentDashboard: React.FC = () => { 
 const STUDENTS_API = "http://localhost:8080/api/student";

const [dashboardData, setDashboardData] = useState<DashboardData>({
  studentName: "",
  programTitle: "",
  totalHours: 0,
  rank: 0,
  points: 0,
  targetHours: 60,
  monthlyHours: [8, 12, 10, 6, 14, 10, 8, 12, 9, 11, 10, 8],
  monthNames: [
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
  ]
});

useEffect(() => {
  const username = sessionStorage.getItem("userName");
  if (!username) return;

  const fetchDashboardData = async () => {
    try {
      // جلب بيانات الطالب
      const studentRes = await fetch(`${STUDENTS_API}/mydata?username=${username}`);
      if (!studentRes.ok) throw new Error("Failed to fetch student data");
      const studentsArray = await studentRes.json();
      const student = studentsArray[0]; 

      // جلب ترتيب الطالب من leaderboard
      let studentRank = 0;
      const leaderboardRes = await fetch("http://localhost:8080/api/studentAdmin");
      if (leaderboardRes.ok) {
        const leaderboardData: Student[] = await leaderboardRes.json();
        const sorted = leaderboardData.sort((a, b) => b.totalHours - a.totalHours);
        const found = sorted.find(s => s.id === student.id);
        if (found) studentRank = sorted.indexOf(found) + 1;
      }

      // تحديث البيانات في Dashboard
      setDashboardData(prev => ({
        ...prev,
        studentName: student.name || "",
        programTitle: student.programs?.title || "",
        totalHours: student.totalHours || 0,
        rank: studentRank,             // هنا حطينا الترتيب
        monthlyHours: prev.monthlyHours
      }));

    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  fetchDashboardData();
}, []);


 useEffect(() => {
  const ctx = document.getElementById("monthlyChart") as HTMLCanvasElement;
  if (!ctx) return;
  const context = ctx.getContext("2d");
  if (!context) return;

  const barGradient = context.createLinearGradient(0, 0, 0, 280);
  barGradient.addColorStop(0, "rgba(128,0,32,0.95)");
  barGradient.addColorStop(1, "rgba(128,0,32,0.55)");

  const chart = new Chart(context, {
    type: "bar",
    data: {
      labels: dashboardData.monthNames,
      datasets: [
        {
          label: "ساعات التطوع الشهرية",
          data: dashboardData.monthlyHours,
          backgroundColor: barGradient,
          borderColor: "rgba(128,0,32,1)",
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1400 },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { font: { family: "Tajawal", size: 13, weight: "normal" }, padding: 10 }
        },
        tooltip: {
          backgroundColor: "rgba(26,26,26,0.92)",
          padding: 12,
          titleFont: { family: "Tajawal", size: 13, weight: "bold" },
          bodyFont: { family: "Tajawal", size: 13, weight: "normal" },
          cornerRadius: 8,
          callbacks: { label: (ctx) => "الساعات: " + ctx.raw }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: "Tajawal", size: 12 }, padding: 6, maxRotation: 45 } },
        y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.06)" }, ticks: { font: { family: "Tajawal", size: 12 }, stepSize: 2, padding: 6 } }
      }
    }
  });

  // هذا مهم جدا لمنع الـ Chart يعمل loop
  return () => chart.destroy();

}, [dashboardData.monthlyHours]); // لاحظ dependency هنا فقط على monthlyHours
  const progressPct = Math.min(100, (dashboardData.totalHours / dashboardData.targetHours) * 100);

  return (
    
<div style={{
  direction: "rtl",
  fontFamily: "'Tajawal', sans-serif",
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  width: "100%",     // ← يغطي كامل عرض الصفحة
  padding: "2rem"
}}>
      
      <style>{`
        :root {
          --bg: #ffffff; /* الخلفية للكاردات */
          --primary: #800020;
          --primary-light: #a00a2e;
          --primary-glow: rgba(128,0,32,0.25);
          --secondary-dark: #ebebeb;
          --text: #1a1a1a;
          --text-muted: #6b6b6b;
          --radius: 16px;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
          --shadow-lg: 0 20px 48px rgba(0,0,0,0.08),0 8px 16px rgba(0,0,0,0.04);
          --border: 1px solid rgba(0,0,0,0.06);
        }

        @keyframes pulse-soft {0%,100%{box-shadow:0 0 0 0 var(--primary-glow);}50%{box-shadow:0 0 0 12px transparent;}}

        .header { display:flex; align-items:center; gap:1.25rem; margin-bottom:2rem; flex-wrap:wrap; }
        
        .avatar { width:72px; height:72px; border-radius:50%; background: linear-gradient(145deg,var(--primary),var(--primary-light)); color:white; display:flex; align-items:center; justify-content:center; font-size:1.9rem; font-weight:800; box-shadow:0 8px 24px var(--primary-glow),0 4px 12px rgba(0,0,0,0.15); border:3px solid rgba(255,255,255,0.3); position:relative; animation: pulse-soft 2.5s ease-in-out 1s infinite; }
        .header-text h1 { font-size:1.6rem; font-weight:800; margin-bottom:0.25rem; letter-spacing:-0.02em; }
        .header-text .program { font-size:0.95rem; color:var(--text-muted); font-weight:500; }

        .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-bottom:2rem; }
        .stat-card { background:var(--bg); border-radius:var(--radius); padding:1.6rem; box-shadow:var(--shadow-sm); border:var(--border); transition: transform 0.4s ease, box-shadow 0.4s ease; overflow:hidden; }
        .stat-card .label { font-size:0.9rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.04em; }
        .stat-card .value { font-size:2rem; font-weight:800; color:var(--primary); letter-spacing:-0.03em; transition: transform 0.3s ease; }
        .stat-card .value.rank { color: var(--text); }
        .stat-card .value.points { color: #1a7a2e; }
        .stat-card:hover { transform: translateY(-8px) rotateX(2deg); box-shadow: var(--shadow-lg),0 0 0 1px rgba(0,0,0,0.03); }
        .stat-card:hover .value { transform: scale(1.05); }

        .progress-section { background:var(--bg); border-radius:var(--radius); padding:1.75rem; box-shadow:var(--shadow-sm); border:var(--border); margin-bottom:2rem; }
        .progress-section .label { font-weight:700; font-size:1rem; color:var(--text); margin-bottom:1rem; }
        .progress-track { height:18px; background: var(--secondary-dark); border-radius:999px; overflow:hidden; box-shadow:inset 0 2px 4px rgba(0,0,0,0.06); }
        .progress-fill { height:100%; background: linear-gradient(90deg,var(--primary),var(--primary-light),var(--primary)); border-radius:999px; min-width:4%; position:relative; box-shadow:0 0 20px var(--primary-glow); transition: width 1s ease; }
        .progress-fill::after { content:''; position:absolute; top:0; left:0; right:0; height:50%; background: linear-gradient(180deg, rgba(255,255,255,0.35),transparent); border-radius:999px 999px 0 0; pointer-events:none; }

        .badges-section { margin-bottom:2rem; }
        .section-title { font-size:1.2rem; font-weight:800; margin-bottom:0.75rem; color:var(--text); letter-spacing:0.03em; }
        .badges-scroll { display:flex; gap:0.75rem; overflow-x:auto; padding:0.5rem 0; }
        .badge { flex-shrink:0; padding:0.55rem 1.1rem; border-radius:999px; font-size:0.85rem; font-weight:700; white-space:nowrap; transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .badge.burgundy { background: linear-gradient(135deg,#800020,#a00a2e); color:white; }
        .badge.gold { background: linear-gradient(135deg,#d4a017,#f0c14b); color:#1a1a1a; }
        .badge.teal { background: linear-gradient(135deg,#0d9488,#14b8a6); color:white; }
        .badge.purple { background: linear-gradient(135deg,#7c3aed,#a78bfa); color:white; }
        .badge.blue { background: linear-gradient(135deg,#2563eb,#3b82f6); color:white; }

        .chart-section { background:var(--bg); border-radius:var(--radius); padding:1.75rem; box-shadow:var(--shadow-sm); border:var(--border); margin-bottom:2rem; }
        .chart-section .section-title { font-size:1.2rem; font-weight:800; margin-bottom:0.75rem; color:var(--text); letter-spacing:0.03em; }
        .chart-section .chart-container { position:relative; height:280px; }

.ai-assistant {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 18px var(--primary-glow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 999;
}

.ai-assistant:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 28px var(--primary-glow);
}

/* Tooltip مستقل عن parent */
.ai-tooltip {
  position: fixed;       /* مستقل بالنسبة للشاشة */
  top: 20px;             /* نفس ارتفاع الأيقونة */
  left: 80px;           /* على يسار الأيقونة */
  background: var(--primary);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0;
  white-space: nowrap;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.ai-assistant:hover + .ai-tooltip {
  opacity: 1;
  transform: translateY(-2px);
}
        
        @media (max-width:768px) {
          .stats-grid { grid-template-columns:1fr; }
          .header-text h1 { font-size:1.3rem; }
        }
      `}</style>

       <div className="ai-assistant">
  <Bot size={26} />
</div>
<span className="ai-tooltip">مساعد سواعد</span>

      <header className="header">

       
        <div className="avatar">{dashboardData.studentName.charAt(0)}</div>
        <div className="header-text">
          <h1>أهلاً يا {dashboardData.studentName} 👋</h1>
          <p className="program">{dashboardData.programTitle}</p>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="label">إجمالي الساعات</div>
          <div className="value">{dashboardData.totalHours}</div>
        </div>
        <div className="stat-card">
          <div className="label">ترتيبك</div>
          <div className="value rank">#{dashboardData.rank}</div>
        </div>
        <div className="stat-card">
          <div className="label">برنامجك</div>
          <div className="value points">{dashboardData.programTitle}</div>
        </div>
      </section>

      <section className="progress-section">
        <div className="label">
          لقد أنجزت {dashboardData.totalHours} من {dashboardData.targetHours} ساعة
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
      </section>

      <section className="badges-section">
        <div className="section-title">شاراتي</div>
        <div className="badges-scroll">
          <span className="badge burgundy">نجم التطوع</span>
          <span className="badge gold">المساعد الأول</span>
          <span className="badge teal">100 ساعة</span>
          <span className="badge purple">قائد الفريق</span>
          <span className="badge blue">المتطوع النشط</span>
        </div>
      </section>

      <section className="chart-section">
        <div className="section-title">ساعات التطوع الشهرية</div>
        <div className="chart-container">
          <canvas id="monthlyChart"></canvas>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;


















