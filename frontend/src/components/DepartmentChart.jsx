import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function DepartmentChart({ doctors = [] }) {
  const counts = {};

  doctors.forEach((doctor) => {
    const specialization = doctor?.specialization || "General";
    counts[specialization] = (counts[specialization] || 0) + 1;
  });

  let data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    data = [{ name: "No Data", value: 1 }];
  }

  return (
    <div>

      <h2>Department Overview</h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={60}
            label
            labelLine={{ stroke: '#5a7a7b', strokeWidth: 1 }}
          >
            {
              data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={["#147570", "#8FB59A", "#103D3E", "#1a918b"][index % 4]}
                  stroke="var(--color-white)"
                  strokeWidth={2}
                />
              ))
            }

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default DepartmentChart;