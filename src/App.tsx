import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Students from "./pages/Students";
import Programs from "./pages/Programs";
import Organizations from "./pages/Organizations";
import MyStudentScreen from "./pages/MyStudentScreen";
import StudentDashboard from "./pages/StudentDashboard";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ================= Private & Admin Routes =================
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const username = sessionStorage.getItem("userName");
  const role = sessionStorage.getItem("role");
  
  // كل من الطالب والأدمن ممكن يدخلوا الصفحات العامة للمستخدمين
  if (!username || !role) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const role = sessionStorage.getItem("role")?.trim(); // يشيل أي فراغات
  // console.log("Current role:", role); // ممكن تستخدمه للdebug
  if (role !== "ADMIN_ROLE") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================================================

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Redirect */}
          <Route
  path="/dashboard"
  element={
    sessionStorage.getItem("role") === "ADMIN_ROLE"
      ? <Navigate to="/dashboard/organizations" replace />
      : <Navigate to="/dashboard/studentDashboard" replace />
  }
/>

          {/* Private Dashboard Routes */}
          <Route
            path="/dashboard/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/MyStudentScreen"
            element={
              <PrivateRoute>
                <MyStudentScreen />
              </PrivateRoute>
            }
          />
          
           <Route
            path="/dashboard/studentDashboard"
            element={
              <PrivateRoute>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
         
          <Route
            path="/dashboard/programs"
            element={
              <PrivateRoute>
                <Programs />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />

          {/* Admin Only */}
          <Route
            path="/dashboard/organizations"
            element={
              <AdminRoute>
                <Organizations />
              </AdminRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
