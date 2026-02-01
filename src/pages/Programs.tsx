import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";

interface Program {
  id: number;
  title: string;
  description: string;
  minAge: number;
  maxAge: number;
  hours: string;
  organization?: {
    organizationID: number;
    name: string;
    type: string;
    description: string;
    location: string;
    contactPerson: string;
  };
}

interface Organization {
  organizationID: number;
  name: string;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    minAge: "",
    maxAge: "",
    hours: "",
    organizationId: "",
  });

  const apiUrl = "http://localhost:8080/api/programs";
  const orgUrl = "http://localhost:8080/api/organizations";

  useEffect(() => {
    fetchPrograms();
    fetchOrganizations();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch programs");
      const data = await res.json();
      setPrograms(data);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء جلب البرامج");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await fetch(orgUrl);
      if (!res.ok) throw new Error("Failed to fetch organizations");
      const data = await res.json();
      setOrganizations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      minAge: "",
      maxAge: "",
      hours: "",
      organizationId: "",
    });
    setEditingProgram(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orgId = Number(formData.organizationId);
    if (!orgId) {
      alert("اختر المنظمة أولاً");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      minAge: Number(formData.minAge),
      maxAge: Number(formData.maxAge),
      hours: formData.hours,
      organizationId: orgId,
    };

    try {
      const res = await fetch(
        editingProgram ? `${apiUrl}/${editingProgram.id}` : apiUrl,
        {
          method: editingProgram ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Save failed");

      await fetchPrograms();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حفظ البرنامج");
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);

    setFormData({
      title: program.title,
      description: program.description,
      minAge: String(program.minAge),
      maxAge: String(program.maxAge),
      hours: program.hours,
      organizationId: program.organization
        ? String(program.organization.organizationID)
        : "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف البرنامج؟")) return;

    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حذف البرنامج");
    }
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إدارة البرامج</h1>
              <p className="text-muted-foreground text-sm">
                {programs.length} برنامج تدريبي
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary inline-flex items-center gap-2 px-4 w-auto"
          >
            <Plus className="w-5 h-5" />
            إضافة برنامج
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث عن برنامج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pr-12"
          />
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-6">
                {editingProgram ? "تعديل البرنامج" : "إضافة برنامج جديد"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="اسم البرنامج" required />
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input min-h-[100px]" placeholder="الوصف" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" name="minAge" value={formData.minAge} onChange={handleChange} className="form-input" placeholder="أقل عمر" required />
                  <input type="number" name="maxAge" value={formData.maxAge} onChange={handleChange} className="form-input" placeholder="أقصى عمر" required />
                </div>
                <input name="hours" value={formData.hours} onChange={handleChange} className="form-input" placeholder="عدد الساعات" required />

                <select name="organizationId" value={formData.organizationId} onChange={handleChange} className="form-input" required>
                  <option value="">اختر المنظمة</option>
                  {organizations.map((org) => (
                    <option key={org.organizationID} value={org.organizationID}>
                      {org.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    حفظ
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <p className="text-center">جاري التحميل...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="dashboard-card">
                <div className="flex justify-between mb-4">
                  <span className="badge badge-primary">
                    {program.organization?.name || "غير محدد"}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(program)} className="p-2 text-primary">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(program.id)} className="p-2 text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold mb-2">{program.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {program.description}
                </p>
                <div className="text-sm mt-2 flex justify-between">
                  <span>العمر: {program.minAge}-{program.maxAge}</span>
                  <span>{program.hours} ساعة</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Programs;
