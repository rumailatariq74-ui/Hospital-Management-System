import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/bloodbank" element={<BloodBank />} />
            <Route path="/ambulance" element={<Ambulance />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/surgery" element={<Surgery />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/noticeboard" element={<NoticeBoard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
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
  
