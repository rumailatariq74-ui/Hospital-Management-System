import { useState, useEffect } from "react";


function Doctor() {


  const [doctor, setDoctor] = useState({

    name: "",
    specialization: "",
    phone: "",
    experience: ""

  });


  const [doctors, setDoctors] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");




  useEffect(() => {

    const savedDoctors = JSON.parse(
      localStorage.getItem("doctors")
    );


    if(savedDoctors){

      setDoctors(savedDoctors);

    }


  }, []);




  useEffect(() => {

    localStorage.setItem(
      "doctors",
      JSON.stringify(doctors)
    );


  }, [doctors]);





  const handleChange = (e)=>{

    setDoctor({

      ...doctor,
      [e.target.name]: e.target.value

    });

  };





  const saveDoctor = (e)=>{

    e.preventDefault();



    if(editIndex !== null){


      const updatedDoctors = [...doctors];

      updatedDoctors[editIndex] = doctor;

      setDoctors(updatedDoctors);

      setEditIndex(null);



    }else{


      setDoctors([

        ...doctors,
        doctor

      ]);


    }




    setDoctor({

      name:"",
      specialization:"",
      phone:"",
      experience:""

    });


  };





  const editDoctor = (index)=>{


    setDoctor(doctors[index]);

    setEditIndex(index);


  };





  const deleteDoctor = (index)=>{


    const updatedDoctors = doctors.filter(

      (_,i)=> i !== index

    );


    setDoctors(updatedDoctors);


  };






  const filteredDoctors = doctors.filter(

    (item)=>

    item.name.toLowerCase()
    .includes(search.toLowerCase())

  );





  return (

    <div className="container">


      <h1 className="page-title">
        Doctors Management
      </h1>



      <h4>
        Total Doctors: {doctors.length}
      </h4>





      {/* Add Doctor Form */}

      <div className="card shadow p-4 mb-4">


        <h3>
          Add Doctor
        </h3>



        <form onSubmit={saveDoctor}>


          <input

          className="form-control mb-3"

          name="name"

          placeholder="Doctor Name"

          value={doctor.name}

          onChange={handleChange}

          />




          <input

          className="form-control mb-3"

          name="specialization"

          placeholder="Specialization"

          value={doctor.specialization}

          onChange={handleChange}

          />




          <input

          className="form-control mb-3"

          name="phone"

          placeholder="Phone Number"

          value={doctor.phone}

          onChange={handleChange}

          />




          <input

          className="form-control mb-3"

          name="experience"

          placeholder="Experience"

          value={doctor.experience}

          onChange={handleChange}

          />




          <button className="btn btn-primary">

          {

          editIndex !== null

          ? "Update Doctor"

          : "Add Doctor"

          }


          </button>


        </form>


      </div>






      {/* Doctor List */}


      <div className="card shadow p-4">


        <h3>
          Doctor List
        </h3>



        <input

        className="form-control my-3"

        placeholder="Search Doctor..."

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

        />





        <table className="table table-bordered">


          <thead className="table-dark">

            <tr>

              <th>Name</th>

              <th>Specialization</th>

              <th>Phone</th>

              <th>Experience</th>

              <th>Action</th>


            </tr>


          </thead>





          <tbody>


          {

          filteredDoctors.map((item,index)=>(


            <tr key={index}>


              <td>
                {item.name}
              </td>


              <td>
                {item.specialization}
              </td>


              <td>
                {item.phone}
              </td>


              <td>
                {item.experience}
              </td>



              <td>


                <button

                className="btn btn-success btn-sm me-2"

                onClick={()=>editDoctor(index)}

                >

                Edit

                </button>




                <button

                className="btn btn-danger btn-sm"

                onClick={()=>deleteDoctor(index)}

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


export default Doctor;