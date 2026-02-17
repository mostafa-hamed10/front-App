import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Building2, 
  LogOut, 
  Menu,
  X,
  GraduationCap,
  Trophy
} from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

// جلب الرول من localStorage
const role = sessionStorage.getItem("role"); // "STUDENT_ROLE" أو "ADMIN_ROLE"

// قائمة التنقل مع تحديد الرول لكل عنصر
const navItems = [
  { name: "شاشتي", path: "/dashboard/MyStudentScreen", icon: Users, roles: ["STUDENT_ROLE"] }, // للطالب فقط
  { name: "الطلاب", path: "/dashboard/students", icon: Users, roles: ["ADMIN_ROLE"] },    // للأدمن فقط
  { name: "البرامج", path: "/dashboard/programs", icon: BookOpen, roles: ["ADMIN_ROLE"] },
  { name: "المنظمات", path: "/dashboard/organizations", icon: Building2, roles: ["ADMIN_ROLE"] },
  { name: "لوحة الصدارة 🏆", path: "/dashboard/leaderboard", icon: Trophy, roles: ["ADMIN_ROLE"] },
];

// تصفية العناصر حسب الرول
const filteredNavItems = navItems.filter(item => item.roles.includes(role || ""));

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-64 bg-sidebar transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">نظام الإدارة</h1>
                <p className="text-xs text-sidebar-foreground/60">لوحة التحكم</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button 
              className="lg:hidden absolute top-4 left-4 text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors ${
                    isActive ? "bg-primary text-white" : "text-sidebar-foreground"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-sidebar-border">
            <button 
              onClick={handleLogout}
              className="nav-link w-full text-destructive hover:bg-destructive/10 flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">مرحباً بكم</p>
              <p className="text-xs text-muted-foreground">{role === "STUDENT_ROLE" ? "طالب" : "مدير النظام"}</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">م</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
