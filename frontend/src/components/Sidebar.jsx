import { NavLink } from "react-router-dom";


function Sidebar() {

  return (

    <aside className="sidebar">


      <div className="logo">

        🏥 MediCare

      </div>



      <ul>


        <li>

          <NavLink to="/">
            📊 Dashboard
          </NavLink>

        </li>



        <li>

          <NavLink to="/patients">
            🧑‍⚕️ Patients
          </NavLink>

        </li>



        <li>

          <NavLink to="/doctors">
            👨‍⚕️ Doctors
          </NavLink>

        </li>



        <li>

          <NavLink to="/appointments">
            📅 Appointments
          </NavLink>

        </li>
<li>
  <NavLink to="/billing">
    💰 Billing
  </NavLink>
</li>


      </ul>


    </aside>

  );

}


export default Sidebar;