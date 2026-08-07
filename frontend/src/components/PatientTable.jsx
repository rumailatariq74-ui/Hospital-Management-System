function PatientTable() {
  const patients = [
    {
      id: 1,
      name: "Ali Khan",
      age: 25,
      gender: "Male",
      disease: "Fever",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      age: 30,
      gender: "Female",
      disease: "Diabetes",
    },
    {
      id: 3,
      name: "Ahmed Raza",
      age: 40,
      gender: "Male",
      disease: "Heart Disease",
    },
  ];

  return (
    <div className="table-container">
      <h2>Recent Patients</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Disease</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.disease}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientTable;