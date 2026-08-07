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
          <CartesianGrid />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line 
            type="monotone"
            dataKey="patients"
            stroke="#2563eb"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PatientChart;