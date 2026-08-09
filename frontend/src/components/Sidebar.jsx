import { NavLink } from "react-router-dom";
import {
  Ambulance,
  BarChart3,
  CalendarDays,
  Droplets,
  FlaskConical,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  Megaphone,
  Pill,
  ReceiptText,
  Scissors,
  Settings,
  Stethoscope,
  Users,
  UserCheck,
  UserCog,
  BedDouble,
  FileText,
  Wrench,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/billing", label: "Billing", icon: ReceiptText },
  { to: "/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/pharmacy", label: "Pharmacy", icon: Pill },
  { to: "/rooms", label: "Rooms & Beds", icon: BedDouble },
  { to: "/laboratory", label: "Laboratory", icon: FlaskConical },
  { to: "/staff", label: "Staff", icon: UserCog },
  { to: "/bloodbank", label: "Blood Bank", icon: Droplets },
  { to: "/ambulance", label: "Ambulance", icon: Ambulance },
  { to: "/emergency", label: "Emergency", icon: HeartPulse },
  { to: "/surgery", label: "OT & Surgery", icon: Scissors },
  { to: "/equipment", label: "Equipment", icon: Wrench },
  { to: "/visitors", label: "Visitors", icon: UserCheck },
  { to: "/noticeboard", label: "Notice Board", icon: Megaphone },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
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
