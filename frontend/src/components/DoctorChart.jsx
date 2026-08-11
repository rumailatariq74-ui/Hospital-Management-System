import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function DoctorChart({ doctors = [] }) {
  const counts = {};

  doctors.forEach((doctor) => {
    const specialization = doctor?.specialization || "General";
    counts[specialization] = (counts[specialization] || 0) + 1;
  });

  const data = Object.entries(counts).map(([department, doctors]) => ({
    department,
    doctors,
  }));

  return (
    <div>

      <h2>Doctors By Department</h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#e0eeef" />
          <XAxis dataKey="department" tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
          <YAxis tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />

          <Tooltip />

          <Bar
            dataKey="doctors"
            fill="url(#barGradient)"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#147570" />
              <stop offset="100%" stopColor="#8FB59A" />
            </linearGradient>
          </defs>

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default DoctorChart;