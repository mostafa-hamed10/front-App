import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface Program {
  id: number;
  title: string;
}

interface Student {
  id: number;
  name: string;
  age: string;
  school: string;
  stage: string;
  totalHours?: number;
  programs?: Program;
  programsId?: number;
}

const STUDENTS_API = "http://localhost:8080/api/student";
const PROGRAMS_API = "http://localhost:8080/api/programs";

const MyStudentScreen = () => {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("userName");

  const [studentData, setStudentData] = useState<Student | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | "">("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    school: "",
    stage: "",
  });
  const [loading, setLoading] = useState(true);

  // ===================== جلب البرامج =====================
  const fetchPrograms = async () => {
    try {
      const res = await fetch(PROGRAMS_API);
      const data: Program[] = await res.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching programs:", e);
      setPrograms([]);
    }
  };

  // ===================== جلب بيانات الطالب =====================
  const fetchStudentData = async () => {
    if (!username) return setLoading(false);

    setLoading(true);
    try {
      const res = await fetch(`${STUDENTS_API}/mydata?username=${username}`);
      if (!res.ok) throw new Error("Failed to fetch student data");

      const student: Student = await res.json();
      setStudentData(student);

      if (student) {
        setFormData({
          name: student.name ?? "",
          age: student.age ?? "",
          school: student.school ?? "",
          stage: student.stage ?? "",
        });
        setSelectedProgramId(student.programs?.id ?? "");
      }
    } catch (e) {
      console.error("Error fetching student data:", e);
      setStudentData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
    fetchStudentData();
  }, []);

  // ===================== حفظ البيانات =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) return alert("لم يتم تسجيل الدخول!");
    if (!selectedProgramId) return alert("اختر البرنامج أولاً");

    const payload = { ...formData, programsId: selectedProgramId };

    try {
      const method = studentData && studentData.id ? "PUT" : "POST";
      const url = studentData && studentData.id
        ? `${STUDENTS_API}/update/${studentData.id}?username=${username}`
        : `${STUDENTS_API}/add?username=${username}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("فشل الحفظ");

      const savedStudent: Student = await res.json();
      setStudentData(savedStudent);

      // بعد الحفظ، توجيه الطالب مباشرة للـ Dashboard مع البيانات
      navigate("/dashboard/studentDashboard", { state: { student: savedStudent }, replace: true });
    } catch (e: any) {
      console.error("Error saving student data:", e);
      alert(e.message || "حدث خطأ أثناء الحفظ");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        جاري التحميل...
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/Images/student-bg4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 65%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/25 rounded-xl shadow-lg p-8 w-full max-w-md backdrop-blur-sm translate-y-20">
        <h1 className="text-2xl font-bold mb-6 text-center">
          ادخل بياناتك الشخصية
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="اسم الطالب"
            className="w-full px-4 py-2 border rounded-lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="العمر"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="المرحلة"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              required
            />
          </div>
          <input
            type="text"
            placeholder="المدرسة"
            className="w-full px-4 py-2 border rounded-lg"
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            required
          />
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value ? Number(e.target.value) : "")}
            required
          >
            <option value="">اختر البرنامج</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            حفظ
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyStudentScreen;