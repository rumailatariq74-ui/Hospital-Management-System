import { useState, useEffect } from "react";
import "./Patients.css";


function Patients() {


  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    disease: "",
    phone: ""
  });


  const [patients, setPatients] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [search, setSearch] = useState("");



  useEffect(() => {

    const saved = JSON.parse(localStorage.getItem("patients"));

    if(saved){
      setPatients(saved);
    }

  },[]);




  useEffect(()=>{

    localStorage.setItem(
      "patients",
      JSON.stringify(patients)
    );

  },[patients]);





  const handleChange=(e)=>{

    setPatient({
      ...patient,
      [e.target.name]:e.target.value
    });

  };





  const savePatient=(e)=>{

    e.preventDefault();


    if(editIndex !== null){

      const update=[...patients];

      update[editIndex]=patient;

      setPatients(update);

      setEditIndex(null);

    }
    else{

      setPatients([
        ...patients,
        patient
      ]);

    }



    setPatient({
      name:"",
      age:"",
      gender:"",
      disease:"",
      phone:""
    });


  };






  const editPatient=(index)=>{

    setPatient(patients[index]);

    setEditIndex(index);

  };





  const deletePatient=(index)=>{

    const update = patients.filter(
      (_,i)=>i !== index
    );

    setPatients(update);

  };





  const filteredPatients = patients.filter((item)=>

    item.name
    .toLowerCase()
    .includes(search.toLowerCase())

  );







return (

<div className="patient-page">


<h1 className="page-title">
Patients Management
</h1>


<h4>
Total Patients: {patients.length}
</h4>




<div className="patient-flex">



{/* Add Patient */}


<div className="card patient-form">


<h3>
Add Patient
</h3>



<form onSubmit={savePatient}>


<input

className="form-control"

name="name"

placeholder="Patient Name"

value={patient.name}

onChange={handleChange}

/>



<input

className="form-control"

name="age"

placeholder="Age"

value={patient.age}

onChange={handleChange}

/>



<input

className="form-control"

name="gender"

placeholder="Gender"

value={patient.gender}

onChange={handleChange}

/>



<input

className="form-control"

name="disease"

placeholder="Disease"

value={patient.disease}

onChange={handleChange}

/>



<input

className="form-control"

name="phone"

placeholder="Phone"

value={patient.phone}

onChange={handleChange}

/>



<button className="btn btn-primary">

{
editIndex !== null
?
"Update Patient"
:
"Add Patient"
}

</button>



</form>


</div>







{/* Patient List */}


<div className="card patient-list">


<h3>
Patient List
</h3>



<input

className="form-control search-box"

placeholder="Search Patient..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>





<table className="table table-bordered">


<thead className="table-dark">

<tr>

<th>Name</th>

<th>Age</th>

<th>Gender</th>

<th>Disease</th>

<th>Phone</th>

<th>Action</th>


</tr>


</thead>



<tbody>


{

filteredPatients.map((item,index)=>(


<tr key={index}>


<td>{item.name}</td>

<td>{item.age}</td>

<td>{item.gender}</td>

<td>{item.disease}</td>

<td>{item.phone}</td>


<td>


<button

className="btn btn-success btn-sm me-2"

onClick={()=>editPatient(index)}

>

Edit

</button>



<button

className="btn btn-danger btn-sm"

onClick={()=>deletePatient(index)}

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



</div>

);


}


export default Patients;