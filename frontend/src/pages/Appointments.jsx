import { useState, useEffect } from "react";


function Appointments() {


  const [appointment, setAppointment] = useState({

    patient: "",
    doctor: "",
    date: "",
    time: "",
    status: "Pending"

  });



  const [appointments, setAppointments] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");





  useEffect(() => {

    const savedAppointments = JSON.parse(
      localStorage.getItem("appointments")
    );


    if(savedAppointments){

      setAppointments(savedAppointments);

    }


  }, []);





  useEffect(() => {

    localStorage.setItem(
      "appointments",
      JSON.stringify(appointments)
    );


  }, [appointments]);






  const handleChange = (e)=>{

    setAppointment({

      ...appointment,
      [e.target.name]: e.target.value

    });

  };






  const saveAppointment = (e)=>{

    e.preventDefault();



    if(editIndex !== null){


      const updatedAppointments = [...appointments];


      updatedAppointments[editIndex] = appointment;


      setAppointments(updatedAppointments);


      setEditIndex(null);



    }else{


      setAppointments([

        ...appointments,
        appointment

      ]);


    }





    setAppointment({

      patient:"",
      doctor:"",
      date:"",
      time:"",
      status:"Pending"

    });


  };






  const editAppointment = (index)=>{

    setAppointment(appointments[index]);

    setEditIndex(index);

  };






  const deleteAppointment = (index)=>{


    const updatedAppointments = appointments.filter(

      (_,i)=>i !== index

    );


    setAppointments(updatedAppointments);


  };






  const filteredAppointments = appointments.filter(

    (item)=>

    item.patient.toLowerCase()
    .includes(search.toLowerCase())

  );







  return (

    <div className="container">


      <h1 className="page-title">

        Appointment Management

      </h1>




      <h4>

        Total Appointments: {appointments.length}

      </h4>







      {/* Add Appointment */}


      <div className="card shadow p-4 mb-4">


        <h3>
          Add Appointment
        </h3>



        <form onSubmit={saveAppointment}>


          <input

          className="form-control mb-3"

          name="patient"

          placeholder="Patient Name"

          value={appointment.patient}

          onChange={handleChange}

          />





          <input

          className="form-control mb-3"

          name="doctor"

          placeholder="Doctor Name"

          value={appointment.doctor}

          onChange={handleChange}

          />






          <input

          className="form-control mb-3"

          type="date"

          name="date"

          value={appointment.date}

          onChange={handleChange}

          />






          <input

          className="form-control mb-3"

          type="time"

          name="time"

          value={appointment.time}

          onChange={handleChange}

          />







          <select

          className="form-control mb-3"

          name="status"

          value={appointment.status}

          onChange={handleChange}

          >


            <option>Pending</option>

            <option>Confirmed</option>

            <option>Completed</option>


          </select>







          <button className="btn btn-primary">


          {

          editIndex !== null

          ? "Update Appointment"

          : "Add Appointment"

          }


          </button>



        </form>


      </div>








      {/* Appointment List */}



      <div className="card shadow p-4">


        <h3>
          Appointment List
        </h3>





        <input

        className="form-control my-3"

        placeholder="Search Patient Appointment..."

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

        />







        <table className="table table-bordered">


          <thead className="table-dark">


            <tr>

              <th>Patient</th>

              <th>Doctor</th>

              <th>Date</th>

              <th>Time</th>

              <th>Status</th>

              <th>Action</th>


            </tr>


          </thead>







          <tbody>


          {

          filteredAppointments.map((item,index)=>(


            <tr key={index}>


              <td>
                {item.patient}
              </td>


              <td>
                {item.doctor}
              </td>


              <td>
                {item.date}
              </td>


              <td>
                {item.time}
              </td>


              <td>

                <span className="status">

                  {item.status}

                </span>

              </td>





              <td>


                <button

                className="btn btn-success btn-sm me-2"

                onClick={()=>editAppointment(index)}

                >

                Edit

                </button>





                <button

                className="btn btn-danger btn-sm"

                onClick={()=>deleteAppointment(index)}

                >

                Delete

                </button>


              </td>


            </tr>


          ))

          }


          </tbody>



        </table>


      </div>



    </div>

  );

}


export default Appointments;