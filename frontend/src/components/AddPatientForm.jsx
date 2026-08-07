import { useState } from "react";

function AddPatientForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(`Patient Added\nName: ${name}\nAge: ${age}`);

    setName("");
    setAge("");
  };

  return (
    <div className="form-container">
      <h2>Add Patient</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default AddPatientForm;