import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/dashboard/Dashboard";
import Patients from "./pages/patients/Patients";
import Doctors from "./pages/doctor/Doctor";
import Appointments from "./pages/appoitments/Appointments";
import Billing from "./pages/billing/Billing";
import { FaWhatsapp } from "react-icons/fa";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window === "undefined" ? true : window.innerWidth > 960;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((current) => !current);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 960) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

      <div className={`app-layout ${isSidebarOpen ? "" : "sidebar-collapsed"}`}>
        <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />
        <button
          className={`sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
      
      
          <a
  href="https://wa.me/923143207686?text=Hello%20I%20want%20online%20consultation"
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-btn"
>
  <FaWhatsapp />

  <span>
    Consult Doctor
  </span>

</a>
        </main>
      </div>
    </>
  );
}

export default App;
  
