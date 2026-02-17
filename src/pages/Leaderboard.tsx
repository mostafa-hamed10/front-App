import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy } from "lucide-react";

interface Student {
  id: number;
  name: string;
  totalHours: number;
  rank?: number;
}

const LEADERBOARD_API = "http://localhost:8080/api/studentAdmin"; // هنجيب الطلاب من نفس API
// لاحقًا ممكن تعمل API مخصوص للـ leaderboard لو حابب

const Leaderboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(LEADERBOARD_API);
        const data: Student[] = await res.json();

        // ترتيب الطلاب حسب totalHours تنازليًا
        const sorted = data
          .sort((a, b) => b.totalHours - a.totalHours)
          .map((s, idx) => ({ ...s, rank: idx + 1 }));
        setStudents(sorted);
      } catch (err) {
        console.error(err);
        setStudents([]);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  // دالة لاختيار badge لكل رتبة
  const getBadge = (rank: number) => {
    if (rank === 1) return "🥇"; // الذهب
    if (rank === 2) return "🥈"; // الفضة
    if (rank === 3) return "🥉"; // البرونز
    return "⭐"; // باقي الطلاب
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">لوحة الصدارة</h1>
            <span className="text-sm text-muted-foreground">
              {students.length} طالب
            </span>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all flex flex-col items-center"
              >
                {/* Badge */}
                <div className="text-4xl mb-2">{getBadge(s.rank!)}</div>

                {/* Name */}
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {s.name}
                </h3>

                {/* Rank */}
                <p className="text-muted-foreground mb-1">
                  الترتيب: {s.rank}
                </p>

                {/* Total Hours */}
                <p className="text-muted-foreground">
                  ⏱ {s.totalHours} ساعة تطوع
                </p>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-muted-foreground col-span-full">
                لا يوجد طلاب
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;