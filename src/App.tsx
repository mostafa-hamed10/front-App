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
import Leaderboard from "./pages/Leaderboard"; // ✅ استورد Leaderboard
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/students" replace />} />
          <Route path="/dashboard/students" element={<Students />} />
          <Route path="/dashboard/programs" element={<Programs />} />
          <Route path="/dashboard/organizations" element={<Organizations />} />
          <Route path="/dashboard/leaderboard" element={<Leaderboard />} /> {/* ✅ جديد */}

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
