import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

function Reports() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    setPatients(JSON.parse(localStorage.getItem("patients")) || []);
    setAppointments(JSON.parse(localStorage.getItem("appointments")) || []);
    setBills(JSON.parse(localStorage.getItem("bills")) || []);
    setMedicines(JSON.parse(localStorage.getItem("medicines")) || []);
    setRooms(JSON.parse(localStorage.getItem("rooms")) || []);
    setStaff(JSON.parse(localStorage.getItem("staff")) || []);
  }, []);

  const totalRevenue = bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const totalBeds = rooms.reduce((sum, r) => sum + Number(r.beds || 0), 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + Number(r.occupied || 0), 0);
  const inventoryValue = medicines.reduce((sum, m) => sum + Number(m.stock || 0) * Number(m.price || 0), 0);
  const totalPayroll = staff.reduce((sum, s) => sum + Number(s.salary || 0), 0);

  const revenueData = [
    { month: "Jan", revenue: 12000, expenses: 8000 },
    { month: "Feb", revenue: 15000, expenses: 9000 },
    { month: "Mar", revenue: 18000, expenses: 10000 },
    { month: "Apr", revenue: 22000, expenses: 11000 },
    { month: "May", revenue: 25000, expenses: 12000 },
    { month: "Jun", revenue: 28000, expenses: 13000 },
  ];

  const departmentData = [
    { name: "Cardiology", patients: 45, revenue: 85000 },
    { name: "Neurology", patients: 30, revenue: 62000 },
    { name: "Dental", patients: 55, revenue: 45000 },
    { name: "General", patients: 80, revenue: 38000 },
    { name: "Pediatrics", patients: 40, revenue: 52000 },
  ];

  const pieColors = ["#147570", "#8FB59A", "#103D3E", "#1a918b", "#b5d4be"];

  const genderData = [
    { name: "Male", value: patients.filter(p => p.gender?.toLowerCase() === "male").length },
    { name: "Female", value: patients.filter(p => p.gender?.toLowerCase() === "female").length },
    { name: "Other", value: patients.filter(p => !p.gender || (p.gender?.toLowerCase() !== "male" && p.gender?.toLowerCase() !== "female")).length },
  ].filter(d => d.value > 0);

  const statusData = [
    { name: "Pending", value: appointments.filter(a => a.status === "Pending").length },
    { name: "Confirmed", value: appointments.filter(a => a.status === "Confirmed").length },
    { name: "Completed", value: appointments.filter(a => a.status === "Completed").length },
  ].filter(d => d.value > 0);

  return (
    <div className="reports-page">
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <h4>Hospital Performance Overview</h4>
        </div>
      </div>

      <div className="cards" style={{ marginBottom: 28 }}>
        <div className="dashboard-card">
          <div className="card-icon revenue"><span style={{ fontSize: 22 }}>Rs</span></div>
          <div><h3>Rs. {totalRevenue.toLocaleString()}</h3><p>Total Revenue</p></div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon patients"><span style={{ fontSize: 22 }}>B</span></div>
          <div><h3>{occupiedBeds} / {totalBeds}</h3><p>Beds Occupied</p></div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon doctors"><span style={{ fontSize: 22 }}>I</span></div>
          <div><h3>Rs. {inventoryValue.toLocaleString()}</h3><p>Inventory Value</p></div>
        </div>
        <div className="dashboard-card">
          <div className="card-icon departments"><span style={{ fontSize: 22 }}>P</span></div>
          <div><h3>Rs. {totalPayroll.toLocaleString()}</h3><p>Monthly Payroll</p></div>
        </div>
      </div>

      <div className="charts" style={{ marginBottom: 20 }}>
        <div>
          <h2>Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#147570" stopOpacity={0.3}/><stop offset="95%" stopColor="#147570" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8FB59A" stopOpacity={0.3}/><stop offset="95%" stopColor="#8FB59A" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0eeef" />
              <XAxis dataKey="month" tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
              <YAxis tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#147570" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#8FB59A" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts" style={{ marginBottom: 20 }}>
        <div>
          <h2>Department Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0eeef" />
              <XAxis dataKey="name" tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
              <YAxis tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" fill="#147570" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#8FB59A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginBottom: 20 }}>
        <div>
          <h2>Patient Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={genderData.length ? genderData : [{ name: "No Data", value: 1 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} label>
                {(genderData.length ? genderData : [{ name: "No Data", value: 1 }]).map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} stroke="var(--color-white)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2>Appointment Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData.length ? statusData : [{ name: "No Data", value: 1 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} label>
                {(statusData.length ? statusData : [{ name: "No Data", value: 1 }]).map((entry, index) => (
                  <Cell key={index} fill={["#147570", "#8FB59A", "#103D3E", "#d4a017"][index % 4]} stroke="var(--color-white)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts">
        <div>
          <h2>Staff Salary by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staff.reduce((acc, s) => {
              const existing = acc.find(a => a.role === s.role);
              if (existing) existing.salary += Number(s.salary || 0);
              else acc.push({ role: s.role || "Unknown", salary: Number(s.salary || 0) });
              return acc;
            }, staff.length ? [] : [{ role: "Nurse", salary: 0 }, { role: "Doctor", salary: 0 }])}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0eeef" />
              <XAxis dataKey="role" tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
              <YAxis tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
              <Tooltip />
              <Bar dataKey="salary" fill="#103D3E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Reports;
