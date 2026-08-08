import { NavLink } from "react-router-dom";
import {
  CalendarDays,
  Hospital,
  LayoutDashboard,
  ReceiptText,
  Stethoscope,
  Users,
} from "lucide-react";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/patients",
    label: "Patients",
    icon: Users,
  },
  {
    to: "/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    to: "/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
  {
    to: "/billing",
    label: "Billing",
    icon: ReceiptText,
  },
];

function Sidebar({ isOpen, onNavigate }) {
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="logo">
        <Hospital size={28} />
        <span>MediCare</span>
      </div>

      <ul>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.to}>
              <NavLink to={item.to} onClick={onNavigate} title={item.label}>
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
