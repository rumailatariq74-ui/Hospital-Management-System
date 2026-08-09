import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function DepartmentChart() {

  const data = [
    { name: "Cardiology", value: 30 },
    { name: "Neurology", value: 20 },
    { name: "Dental", value: 25 },
    { name: "General", value: 25 },
  ];


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