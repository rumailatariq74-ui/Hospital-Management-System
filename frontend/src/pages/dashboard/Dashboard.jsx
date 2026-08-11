import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Activity, Calendar, DollarSign, Users, Stethoscope, FlaskConical, BedDouble, Pill } from "lucide-react";
import { apiGet } from "../../services/api";
import DepartmentChart from "../../components/DepartmentChart";
import PatientChart from "../../components/PatientChart";
import DoctorChart from "../../components/DoctorChart";
import DataTable from "../../components/DataTable";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientsData, doctorsData, appointmentsData, billsData, medicinesData, roomsData, labTestsData] = await Promise.all([
          apiGet("/patients"),
          apiGet("/doctors"),
          apiGet("/appointments"),
          apiGet("/bills"),
          apiGet("/medicines"),
          apiGet("/rooms"),
          apiGet("/lab-tests"),
        ]);
        setPatients(patientsData || []);
        setDoctors(doctorsData || []);
        setAppointments(appointmentsData || []);
        setBills(billsData || []);
        setMedicines(medicinesData || []);
        setRooms(roomsData || []);
        setLabTests(labTestsData || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    }
    fetchData();
  }, []);

  const totalRevenue = bills.reduce((total, bill) => total + Number(bill.amount || 0), 0);
  const pendingAppointments = appointments.filter((a) => a.status === "Pending").length;
  const occupiedBeds = rooms.reduce((sum, r) => sum + Number(r.occupied || 0), 0);
  const totalBeds = rooms.reduce((sum, r) => sum + Number(r.beds || 0), 0);
  const lowStock = medicines.filter((m) => Number(m.stock) <= 10).length;
  const pendingLab = labTests.filter((t) => t.result === "Pending").length;

  const recentActivity = (() => {
    const activities = [];
    if (patients.length) activities.push({ text: `New patient registered: ${patients[patients.length - 1].name}`, time: "Just now", icon: Users, color: "#147570" });
    if (appointments.length) activities.push({ text: `Appointment scheduled: ${appointments[appointments.length - 1].patient}`, time: "2 min ago", icon: Calendar, color: "#d4a017" });
    if (bills.length) activities.push({ text: `Bill generated: Rs. ${bills[bills.length - 1].amount}`, time: "15 min ago", icon: DollarSign, color: "#c45b5b" });
    if (labTests.length) activities.push({ text: `Lab test ordered: ${labTests[labTests.length - 1].testName}`, time: "30 min ago", icon: FlaskConical, color: "#8FB59A" });
    if (doctors.length) activities.push({ text: `Doctor on duty: Dr. ${doctors[0].name}`, time: "1 hr ago", icon: Stethoscope, color: "#103D3E" });
    if (activities.length === 0) {
      activities.push({ text: "Welcome to MediCare Hospital Management System", time: "Now", icon: Activity, color: "#147570" });
      activities.push({ text: "Add patients, doctors, and appointments to see activity here", time: "Now", icon: Activity, color: "#8FB59A" });
    }
    return activities;
  })();

  const patientColumns = [
    { key: "name", header: "Name", render: (patient) => <strong className="record-name">{patient.name || "-"}</strong> },
    { key: "age", header: "Age", render: (patient) => patient.age || "-" },
    { key: "disease", header: "Disease", render: (patient) => <span className="soft-pill">{patient.disease || "General"}</span> },
  ];

  const doctorColumns = [
    { key: "name", header: "Name", render: (doctor) => <strong className="record-name">{doctor.name || "-"}</strong> },
    { key: "specialization", header: "Specialization", render: (doctor) => <span className="soft-pill">{doctor.specialization || "General"}</span> },
  ];

  const quickStatCards = [
    { title: "Total Patients", value: patients.length, icon: Users, iconClass: "patients", trend: "+12%", trendUp: true },
    { title: "Total Doctors", value: doctors.length, icon: Stethoscope, iconClass: "doctors", trend: "+3%", trendUp: true },
    { title: "Appointments", value: appointments.length, icon: Calendar, iconClass: "appointments", trend: "+8%", trendUp: true },
    { title: "Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, iconClass: "revenue", trend: "+24%", trendUp: true },
  ];

  const secondaryStats = [
    { title: "Pending Appts", value: pendingAppointments, icon: Calendar, iconClass: "appointments" },
    { title: "Beds Occupied", value: `${occupiedBeds} / ${totalBeds}`, icon: BedDouble, iconClass: "doctors" },
    { title: "Low Stock Items", value: lowStock, icon: Pill, iconClass: "revenue" },
    { title: "Pending Lab Tests", value: pendingLab, icon: FlaskConical, iconClass: "patients" },
  ];

  return (
    <div className="dashboard">
      <div className="page-header" style={{ marginBottom: 24, alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Hospital Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>Welcome back, Administrator. Here is your overview.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="summary-pill">Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="cards" style={{ marginBottom: 24 }}>
        {quickStatCards.map((card, i) => (
          <div className="dashboard-card" key={i}>
            <div className={`card-icon ${card.iconClass}`}>
              <card.icon size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h3>{card.value}</h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, color: card.trendUp ? '#2d7a5a' : '#c45b5b', background: card.trendUp ? 'rgba(143, 181, 154, 0.15)' : 'rgba(196, 91, 91, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                  {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.trend}
                </span>
              </div>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="cards" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {secondaryStats.map((card, i) => (
          <div className="dashboard-card" key={i} style={{ padding: 16 }}>
            <div className={`card-icon ${card.iconClass}`} style={{ width: 40, height: 40, fontSize: 18 }}>
              <card.icon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 18 }}>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed + Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="data-table-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary-dark)', letterSpacing: '-0.3px' }}>Recent Activity</h3>
            <Activity size={16} color="var(--color-text-muted)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentActivity.map((activity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${activity.color}15`, display: 'grid', placeItems: 'center', color: activity.color, flexShrink: 0 }}>
                  <activity.icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.text}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-light)', margin: 0, marginTop: 2 }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <DataTable
            title="Recent Patients"
            showSearch={false}
            search=""
            onSearchChange={() => {}}
            columns={patientColumns}
            data={patients.slice(0, 5)}
            emptyMessage="No patients added"
          />
          <DataTable
            title="Doctors"
            showSearch={false}
            search=""
            onSearchChange={() => {}}
            columns={doctorColumns}
            data={doctors.slice(0, 5)}
            emptyMessage="No doctors added"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <PatientChart patients={patients} />
        <DoctorChart doctors={doctors} />
        <DepartmentChart doctors={doctors} />
      </div>
    </div>
  );
}

export default Dashboard;
