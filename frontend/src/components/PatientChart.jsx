import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PatientChart({ patients = [] }) {
  const monthly = new Map();

  patients.forEach((patient) => {
    const raw = patient?.createdAt;
    if (!raw) return;
    const date = new Date(raw);
    if (isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const month = date.toLocaleString("en-US", { month: "short" });

    if (!monthly.has(key)) {
      monthly.set(key, { month, patients: 0 });
    }
    monthly.get(key).patients += 1;
  });

  const data = Array.from(monthly.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  return (
    <div>
      <h2>Patient Growth</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0eeef" />
          <XAxis dataKey="month" tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
          <YAxis tick={{ fill: '#5a7a7b', fontSize: 12 }} axisLine={{ stroke: '#e0eeef' }} tickLine={false} />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="patients"
            stroke="#147570"
            strokeWidth={3}
            dot={{ fill: "#147570", strokeWidth: 2, r: 4, stroke: "#FBFDFD" }}
            activeDot={{ r: 6, fill: "#8FB59A", stroke: "#147570", strokeWidth: 2 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PatientChart;