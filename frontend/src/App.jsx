import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctor";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import { FaWhatsapp } from "react-icons/fa";


import "./app.css";

function App() {
  return (
    <>
      <Navbar />

      <div className="container">
        <Sidebar />

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