import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Edit, Trash2, Phone, Mail, Instagram, MapPin, Building2, Search } from "lucide-react";

/* =======================
   Interface (BACKEND ONLY)
======================= */

interface Organization {
  organizationID: number;
  name: string;
  phone: string;
  instagram: string;
  email: string;
  location: string;
}

/* =======================
   API
======================= */

const ORGANIZATIONS_API = "http://localhost:8080/api/organizations";

/* =======================
   Component
======================= */

const Organizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    instagram: "",
    email: "",
    location: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  /* =======================
     Auth Guard
  ======================= */
useEffect(() => {
  const userName = sessionStorage.getItem("userName");
  const role = sessionStorage.getItem("role");

  if (!userName || role !== "ADMIN_ROLE") {
    navigate("/login");
  }
}, [navigate]);

  /* =======================
     Fetch Data
  ======================= */
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetch(ORGANIZATIONS_API, {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        console.log("FORBIDDEN Organizations", res.status);
        setOrganizations([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setOrganizations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  /* =======================
     Handlers
  ======================= */
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      instagram: "",
      email: "",
      location: "",
    });
    setEditingOrg(null);
    setShowForm(false);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      phone: org.phone,
      instagram: org.instagram,
      email: org.email,
      location: org.location,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف المنظمة؟")) return;

    try {
      const res = await fetch(`${ORGANIZATIONS_API}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("غير مصرح بالحذف أو حدث خطأ");
        return;
      }
      setOrganizations((prev) => prev.filter((o) => o.organizationID !== id));
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingOrg
        ? `${ORGANIZATIONS_API}/${editingOrg.organizationID}`
        : ORGANIZATIONS_API;

      const method = editingOrg ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("فشل الحفظ");

      const savedOrg = await res.json();

      if (editingOrg) {
        setOrganizations((prev) =>
          prev.map((o) =>
            o.organizationID === editingOrg.organizationID ? savedOrg : o
          )
        );
      } else {
        setOrganizations((prev) => [...prev, savedOrg]);
      }

      resetForm();
    } catch (e: any) {
      console.error("Submit error:", e);
      alert(e.message || "حدث خطأ أثناء الحفظ");
    }
  };

  /* =======================
     Filtered Organizations
  ======================= */
  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =======================
     UI
  ======================= */
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">المنظمات</h1>
              <p className="text-muted-foreground text-sm">{organizations.length} منظمة</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2 px-4 w-auto"
          >
            <Plus size={18} />
            إضافة منظمة
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث عن اسم المنظمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pr-12"
          />
        </div>

        {loading && <p className="text-center text-muted-foreground">جاري التحميل...</p>}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <div key={org.organizationID} className="dashboard-card">
              <div className="flex justify-between mb-3">
                <h3 className="font-bold">{org.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(org)} className="p-2 text-primary">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(org.organizationID)} className="p-2 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="flex items-center gap-1 text-sm"><Phone className="w-4 h-4" /> {org.phone}</p>
              <p className="flex items-center gap-1 text-sm"><Mail className="w-4 h-4" /> {org.email}</p>
              <p className="flex items-center gap-1 text-sm"><Instagram className="w-4 h-4" /> {org.instagram}</p>
              <p className="flex items-center gap-1 text-sm"><MapPin className="w-4 h-4" /> {org.location}</p>
            </div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card p-6 rounded-xl w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {editingOrg ? "تعديل منظمة" : "إضافة منظمة"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="form-input"
                  placeholder="اسم المنظمة"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <input
                  className="form-input"
                  placeholder="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />

                <input
                  className="form-input"
                  placeholder="إنستجرام"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                />

                <input
                  className="form-input"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <input
                  className="form-input"
                  placeholder="الموقع"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary flex-1"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Organizations;