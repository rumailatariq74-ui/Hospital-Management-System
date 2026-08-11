import { Bell, Hospital, LogOut, Menu, Settings, X } from "lucide-react";
import adminImage from "../assets/admin.jpg";

function Navbar({ isSidebarOpen, onToggleSidebar, onLogout }) {
  return (
    <nav className="top-navbar">
      <div className="brand-section">
        <button
          className="menu-btn"
          type="button"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Open sidebar"}
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hospital-logo">
          <Hospital size={28} />
        </div>

        <div className="brand-text">
          <h2>MediCare Hospital</h2>
          <p>Hospital Management System</p>
        </div>
      </div>

      <div className="search-section">
        <input type="text" placeholder="Search Patients, Doctors..." />
      </div>

      <div className="profile-section">
        <button className="notify-btn" type="button" aria-label="Notifications">
          <Bell size={19} />
        </button>

        <button className="setting-btn" type="button" aria-label="Settings">
          <Settings size={19} />
        </button>

        <button className="notify-btn" type="button" aria-label="Logout" onClick={onLogout}>
          <LogOut size={19} />
        </button>

        <div className="admin-profile">
          <div className="profile-image">
            <img src={adminImage} alt="Admin" />
          </div>

          <div className="profile-info">
            <h4>Rumaila Tariq</h4>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
