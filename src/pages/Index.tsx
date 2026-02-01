import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  Award,
  Building2,
  ArrowLeft,
  Calendar,
  BookOpen,
  Bot,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import SawaidLogo from "/Images/logo6.png";

const Index = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  // اظهار الرسالة عند فتح الصفحة واختفائها بعد 3 ثوانٍ
  useEffect(() => {
    const timerShow = setTimeout(() => {
      setShowMessage(true);
    }, 100); // تأخير خفيف لتفعيل الانيميشن

    const timerHide = setTimeout(() => {
      setShowMessage(false);
    }, 3100); // تختفي بعد 3 ثوانٍ من الظهور

    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
    };
  }, []);

  const features = [
    { icon: Heart, title: "فرص تطوعية", description: "اكتشف فرص تطوعية متنوعة في مختلف المجالات" },
    { icon: Users, title: "مجتمع نشط", description: "انضم لمجتمع من المتطوعين الملهمين" },
    { icon: Award, title: "شهادات معتمدة", description: "احصل على شهادات تعزز سيرتك الذاتية" },
    { icon: Calendar, title: "جدولة مرنة", description: "اختر الأوقات التي تناسبك للتطوع" },
    { icon: Building2, title: "منظمات موثوقة", description: "تعاون مع منظمات معتمدة في قطر" },
    { icon: BookOpen, title: "تطوير المهارات", description: "اكتسب مهارات وخبرات عملية قيمة" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background font-sans">

      {/* HERO */}
      <div className="relative min-h-screen text-white bg-gradient-to-br from-[#5A0A1F] via-[#6B0F28] to-[#4A0819] overflow-hidden">

        {/* مساعد سواعد مع Tooltip */}
        <div className="fixed top-1/2 right-6 -translate-y-1/2 z-30 group">
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-white text-[#5A0A1F] text-sm font-semibold px-4 py-2 rounded-xl shadow-lg">
              مساعد سواعد
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition animate-pulse">
            <Bot className="w-7 h-7 text-[#5A0A1F]" />
          </div>
        </div>

        {/* تأثيرات خلفية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* NAV */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
              <img src="/Images/logo6.png" alt="سواعد قطر" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-lg block">سواعد قطر</span>
              <span className="text-xs text-white/70">Sawaid Qatar</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/login")} className="text-white/90 hover:text-white transition font-medium">
              تسجيل الدخول
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-[#5A0A1F] px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-white/95 transition"
            >
              إنشاء حساب
            </button>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">

          {/* الرسالة الترحيبية تظهر عند فتح الصفحة وتختفي بعد 3 ثوانٍ */}
          <div
            className={`flex items-center gap-3 bg-gradient-to-r from-[#6B0F28]/70 to-[#5A0A1F]/70 px-8 py-4 rounded-2xl shadow-xl mb-6 transition-all duration-700 transform ${
              showMessage ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
            <span className="text-white font-bold text-2xl md:text-3xl">
              مرحبًا بكم في منصة سواعد قطر
            </span>
          </div>

          {/* الشعار */}
          <div className="w-36 h-36 bg-white rounded-3xl flex items-center justify-center p-4 shadow-2xl mb-6">
            <img src="/Images/logo6.png" alt="سواعد قطر" className="w-full h-full object-contain" />
          </div>

          {/* اسم الموقع */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            سواعد قطر
          </h1>

          {/* الجملة التوضيحية المبسطة */}
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
            منصتك الرقمية للتطوع الطلابي في قطر
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#5A0A1F] px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition"
            >
             ابدأ رحلتك الان 
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا سواعد قطر؟</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              منصة متكاملة تربط الطلاب بالمبادرات التطوعية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-8 bg-background rounded-3xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-[#5A0A1F]/10 rounded-2xl flex items-center justify-center">
                  <f.icon className="w-8 h-8 text-[#5A0A1F]" />
                </div>
                <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="py-12 bg-[#3A0614] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* قسم اللوجو */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center p-2">
                <img 
                  src="/Images/logo6.png"
                  alt="سواعد قطر" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="font-bold block text-lg">سواعد قطر</span>
                <span className="text-xs text-white/60">Sawaid Qatar</span>
              </div>
            </div>

            {/* روابط الفوتر */}
            <div className="flex items-center gap-6 text-white/70">
              <a href="#" className="hover:text-white transition">عن المنصة</a>
              <a href="#" className="hover:text-white transition">تواصل معنا</a>
            </div>
          </div>

          {/* حقوق النشر */}
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            ©️ 2026 سواعد قطر – جميع الحقوق محفوظة
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;



