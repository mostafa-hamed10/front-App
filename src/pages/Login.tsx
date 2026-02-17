import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // تسجيل الدخول
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "اسم المستخدم أو كلمة المرور غير صحيحة");
      }

      const data = await response.json();

      // حفظ اسم المستخدم والرول
      sessionStorage.setItem("userName", data.userName);
      sessionStorage.setItem("role", (data.role || "STUDENT_ROLE").trim());

      const role = (data.role || "STUDENT_ROLE").trim();

      if (role === "ADMIN_ROLE") {
        navigate("/dashboard/organizations");
        return; // يمنع تنفيذ أي كود بعد كده
      }

      // للطلاب فقط
      const studentRes = await fetch(
        `http://localhost:8080/api/student/mydata?username=${data.userName}`
      );
      const studentsArray = await studentRes.json();

      if (!studentsArray || studentsArray.length === 0) {
        navigate("/dashboard/MyStudentScreen"); // أول مرة يدخل
        return;
      }

      const student = studentsArray[0];

      const hasProfile = student?.programs?.title?.trim();

      if (hasProfile) {
        navigate("/dashboard/studentDashboard"); // لو سجل بياناته
      } else {
        navigate("/dashboard/MyStudentScreen"); // لأول مرة يدخل
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" dir="rtl">
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">تسجيل الدخول</h1>
          <p className="text-muted-foreground mt-2">
            أدخل بياناتك للوصول إلى حسابك
          </p>
        </div>

        {error && <p className="text-destructive mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">اسم المستخدم</label>
            <div className="relative">
              <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="form-input pr-12"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input pr-12 pl-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;