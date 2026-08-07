import { Link, Outlet } from "react-router-dom";

function Layout() {

  return (

    <div className="d-flex">

      {/* Sidebar */}

      <div className="sidebar">

        <h2>🏥 MediCare</h2>

        <Link to="/">Dashboard</Link>

        <Link to="/patients">Patients</Link>

        <Link to="/doctors">Doctors</Link>

        <Link to="/appointments">Appointments</Link>

      </div>



      {/* Main Content */}

      <div className="main-content">

        <nav className="topbar">

          <h3>Hospital Management System</h3>

        </nav>


        <Outlet />

      </div>


    </div>

  );
}


export default Layout;