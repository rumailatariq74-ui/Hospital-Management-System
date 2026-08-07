import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function DoctorChart() {

  const data = [
    {
      department: "Cardiology",
      doctors: 8,
    },
    {
      department: "Neurology",
      doctors: 5,
    },
    {
      department: "Dental",
      doctors: 7,
    },
    {
      department: "General",
      doctors: 10,
    },
  ];


  return (
    <div>

      <h2>Doctors By Department</h2>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data}>

          <CartesianGrid />

          <XAxis dataKey="department" />

          <YAxis />

          <Tooltip />

          <Bar 
            dataKey="doctors"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default DoctorChart;