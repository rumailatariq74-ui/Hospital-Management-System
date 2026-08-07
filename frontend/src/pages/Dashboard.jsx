import DepartmentChart from "../components/DepartmentChart";
import PatientChart from "../components/PatientChart";
import DoctorChart from "../components/DoctorChart";
import DashboardCard from "../components/DashboardCard";


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
       <div className="table-card">


          <h2>
            Recent Patients
          </h2>


          <table className="table table-bordered">


            <thead className="table-dark">

              <tr>

                <th>Name</th>
                <th>Age</th>
                <th>Disease</th>

              </tr>

            </thead>



            <tbody>


            {
              patients.length > 0 ? (

                patients.slice(0,5).map((patient,index)=>(

                  <tr key={index}>

                    <td>
                      {patient.name}
                    </td>

                    <td>
                      {patient.age}
                    </td>

                    <td>
                      {patient.disease}
                    </td>


                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="3" className="text-center">

                    No Patients Added

                  </td>

                </tr>

              )

            }


            </tbody>


          </table>


        </div>






        {/* Doctors Table */}


        <div className="table-card">


          <h2>
            Doctors
          </h2>



          <table className="table table-bordered">


            <thead className="table-dark">

              <tr>

                <th>Name</th>
                <th>Specialization</th>

              </tr>

            </thead>




            <tbody>


            {
              doctors.length > 0 ? (

                doctors.slice(0,5).map((doctor,index)=>(

                  <tr key={index}>


                    <td>
                      {doctor.name}
                    </td>


                    <td>
                      {doctor.specialization}
                    </td>


                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="2" className="text-center">

                    No Doctors Added

                  </td>

                </tr>

              )

            }


            </tbody>


          </table>


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