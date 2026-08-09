import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PatientChart() {

  const data = [
    { month: "Jan", patients: 30 },
    { month: "Feb", patients: 45 },
    { month: "Mar", patients: 60 },
    { month: "Apr", patients: 80 },
    { month: "May", patients: 100 },
  ];

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