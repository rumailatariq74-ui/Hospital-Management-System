import adminImage from "../assets/admin.jpg";

function Navbar() {
  return (
    <nav className="top-navbar">

      <div className="brand-section">

        <div className="hospital-logo">
          🏥
        </div>

        <div className="brand-text">
          <h2>MediCare Hospital</h2>
          <p>Hospital Management System</p>
        </div>

      </div>


      <div className="search-section">

        <input
          type="text"
          placeholder="Search Patients, Doctors..."
        />

      </div>


      <div className="profile-section">

        <button className="notify-btn">🔔</button>

        <button className="setting-btn">⚙️</button>


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