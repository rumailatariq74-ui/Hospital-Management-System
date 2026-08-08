import DepartmentChart from "../../components/DepartmentChart";
import PatientChart from "../../components/PatientChart";
import DoctorChart from "../../components/DoctorChart";
import DashboardCard from "../../components/DashboardCard";
import DataTable from "../../components/DataTable";


function Dashboard() {


  const patients = JSON.parse(
    localStorage.getItem("patients")
  ) || [];


  const doctors = JSON.parse(
    localStorage.getItem("doctors")
  ) || [];


  const appointments = JSON.parse(
    localStorage.getItem("appointments")
  ) || [];
  const bills = JSON.parse(
  localStorage.getItem("bills")
) || [];

const totalRevenue = bills.reduce(
  (total, bill) => total + Number(bill.amount || 0),
  0
);

const patientColumns = [
  {
    key: "name",
    header: "Name",
    render: (patient) => <strong className="record-name">{patient.name || "-"}</strong>,
  },
  {
    key: "age",
    header: "Age",
    render: (patient) => patient.age || "-",
  },
  {
    key: "disease",
    header: "Disease",
    render: (patient) => <span className="soft-pill">{patient.disease || "General"}</span>,
  },
];

const doctorColumns = [
  {
    key: "name",
    header: "Name",
    render: (doctor) => <strong className="record-name">{doctor.name || "-"}</strong>,
  },
  {
    key: "specialization",
    header: "Specialization",
    render: (doctor) => <span className="soft-pill">{doctor.specialization || "General"}</span>,
  },
];



  return (

    <div className="dashboard">


      <h1>
        Hospital Dashboard
      </h1>



    

      <div className="cards">


        <DashboardCard
          title="Total Patients"
          value={patients.length}
        />


        <DashboardCard
          title="Total Doctors"
          value={doctors.length}
        />


        <DashboardCard
          title="Appointments"
          value={appointments.length}
        />


        <DashboardCard
          title="Departments"
          value="5"
        />


      </div>
      <div className="dashboard-tables">
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

      <div className="charts">

        <PatientChart />

        <DoctorChart />

        <DepartmentChart />

      </div>







      {/* Overview Section */}

      <div className="dashboard-section">


        {/* Patients Table */}

       



      </div>



    </div>

  );

}


export default Dashboard;
