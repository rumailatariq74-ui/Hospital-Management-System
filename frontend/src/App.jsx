import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/dashboard/Dashboard";
import Patients from "./pages/patients/Patients";
import Doctors from "./pages/doctor/Doctor";
import Appointments from "./pages/appoitments/Appointments";
import Billing from "./pages/billing/Billing";
import Pharmacy from "./pages/pharmacy/Pharmacy";
import Rooms from "./pages/rooms/Rooms";
import Laboratory from "./pages/laboratory/Laboratory";
import Staff from "./pages/staff/Staff";
import BloodBank from "./pages/bloodbank/BloodBank";
import Ambulance from "./pages/ambulance/Ambulance";
import Prescriptions from "./pages/prescriptions/Prescriptions";
import Emergency from "./pages/emergency/Emergency";
import Surgery from "./pages/surgery/Surgery";
import Equipment from "./pages/equipment/Equipment";
import Visitors from "./pages/visitors/Visitors";
import NoticeBoard from "./pages/noticeboard/NoticeBoard";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { FaWhatsapp } from "react-icons/fa";

const authRoutes = ["/login", "/signup"];

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicAuthRoute({ isAuthenticated, children }) {
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window === "undefined" ? true : window.innerWidth > 960;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof window === "undefined" ? false : !!localStorage.getItem("token");
  });
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen((current) => !current);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 960) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <>
      {!isAuthPage && <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} onLogout={handleLogout} />}

      <div className={`app-layout ${isAuthPage || isSidebarOpen ? "" : "sidebar-collapsed"} ${isAuthPage ? "auth-layout" : ""}`}>
        {!isAuthPage && <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />}
        {!isAuthPage && (
          <button
            className={`sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
            type="button"
            aria-label="Close sidebar"
            onClick={closeSidebar}
          />
        )}

        <main className="content">
          <Routes>
            <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Patients /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Doctors /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Appointments /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Billing /></ProtectedRoute>} />
            <Route path="/pharmacy" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Pharmacy /></ProtectedRoute>} />
            <Route path="/rooms" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Rooms /></ProtectedRoute>} />
            <Route path="/laboratory" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Laboratory /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Staff /></ProtectedRoute>} />
            <Route path="/bloodbank" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BloodBank /></ProtectedRoute>} />
            <Route path="/ambulance" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Ambulance /></ProtectedRoute>} />
            <Route path="/prescriptions" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Prescriptions /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Emergency /></ProtectedRoute>} />
            <Route path="/surgery" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Surgery /></ProtectedRoute>} />
            <Route path="/equipment" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Equipment /></ProtectedRoute>} />
            <Route path="/visitors" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Visitors /></ProtectedRoute>} />
            <Route path="/noticeboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><NoticeBoard /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />
            <Route path="/login" element={<PublicAuthRoute isAuthenticated={isAuthenticated}><Login /></PublicAuthRoute>} />
            <Route path="/signup" element={<PublicAuthRoute isAuthenticated={isAuthenticated}><Signup /></PublicAuthRoute>} />
          </Routes>

          {!isAuthPage && (
            <a
              href="https://wa.me/923143207686?text=Hello%20I%20want%20online%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <FaWhatsapp />
              <span>Consult Doctor</span>
            </a>
          )}
        </main>
      </div>
    </>
  );
}

export default App;

