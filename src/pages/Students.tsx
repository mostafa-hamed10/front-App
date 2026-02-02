import { useEffect, useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Edit, Trash2, Users, Bot, Clock } from "lucide-react";

interface Organization {
  organizationID: number;
  name: string;
}

interface Program {
  id: number;
  title: string;
  description: string;
  minAge: string;
  maxAge: string;
  hours: string;
  numberOfDays: number; // ✅ الحقل الجديد
  organization?: Organization;
}

interface Student {
  id: number;
  name: string;
  age: number;
  school: string;
  stage: string;
  totalHours: number;
  programs?: Program;
  programsId?: number;
}

const STUDENTS_API = "http://localhost:8080/api/students";
const PROGRAMS_API = "http://localhost:8080/api/programs";

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<number | "">("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    school: "",
    stage: "",
  });

  // ⚡ دمج بيانات الطالب مع البرنامج
  const enrichStudentsWithPrograms = useCallback(
    (studentsData: Student[], programsData: Program[]): Student[] => {
      return studentsData.map((student) => {
        const programId = student.programs?.id ?? student.programsId;
        if (programId) {
          const fullProgram = programsData.find((p) => p.id === programId);
          if (fullProgram) {
            // ✅ حساب الساعات الكلية للطالب
            const totalHours =
              Number(fullProgram.hours) * (fullProgram.numberOfDays || 0);
            return { ...student, program: fullProgram, totalHours };
          }
        }
        return { ...student, program: undefined, totalHours: 0 };
      });
    },
    []
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, programsRes] = await Promise.all([
        fetch(STUDENTS_API),
        fetch(PROGRAMS_API),
      ]);
      const studentsData: Student[] = await studentsRes.json();
      const programsData: Program[] = await programsRes.json();

      const safePrograms = Array.isArray(programsData) ? programsData : [];
      const safeStudents = Array.isArray(studentsData) ? studentsData : [];

      setPrograms(safePrograms);

      const enrichedStudents = enrichStudentsWithPrograms(
        safeStudents,
        safePrograms
      );
      setStudents(enrichedStudents);
    } catch (e) {
      console.error(e);
      setStudents([]);
      setPrograms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.school.toLowerCase().includes(term) ||
        s.stage.toLowerCase().includes(term)
    );
  }, [searchTerm, students]);

  const resetForm = () => {
    setFormData({ name: "", age: "", school: "", stage: "" });
    setSelectedProgramId("");
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      age: student.age.toString(),
      school: student.school,
      stage: student.stage,
    });
    setSelectedProgramId(student.programs?.id ?? "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${STUDENTS_API}/${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgramId) {
      alert("اختر البرنامج أولاً");
      return;
    }
    const selectedProgram = programs.find((p) => p.id === selectedProgramId);
    if (!selectedProgram) {
      alert("البرنامج المختار غير موجود");
      return;
    }

    const totalHours = Number(selectedProgram.hours) * (selectedProgram.numberOfDays || 0);

    const payload = {
      name: formData.name,
      age: Number(formData.age),
      school: formData.school,
      stage: formData.stage,
      totalHours,
      programsId: selectedProgramId,
    };

    try {
      const url = editingStudent
        ? `${STUDENTS_API}/${editingStudent.id}`
        : STUDENTS_API;
      const method = editingStudent ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const savedStudent = await res.json();

      const studentWithProgram: Student = {
        ...savedStudent,
        program: selectedProgram,
        totalHours,
      };
      setStudents((prev) =>
        editingStudent
          ? prev.map((s) =>
              s.id === editingStudent.id ? studentWithProgram : s
            )
          : [...prev, studentWithProgram]
      );
      resetForm();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حفظ الطالب");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                إدارة الطلاب
              </h1>
              <span className="text-sm text-muted-foreground">
                {students.length} طالب
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة طالب
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث عن طالب..."
            className="w-full pr-10 pl-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    الاسم
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    العمر
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    المدرسة
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    المرحلة
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    البرنامج
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.age}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.school}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.stage}</td>

                    <td className="px-4 py-3 space-y-1">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {s.programs?.title || "غير محدد"} ({s.totalHours} ساعة)
                      </span>

                      {/* ⭐ Badge UI only */}
                      <div className="inline-block px-4 py-1 text-base font-semibold text-black rounded-full">
                        🥇
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      لا يوجد طلاب
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Students;






