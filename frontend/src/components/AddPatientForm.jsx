import { useState } from "react";
import { toast } from "react-toastify";
import FormField from "./FormField";
import { digitsOnly, numericInputProps } from "../utils/inputValidation";

function AddPatientForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success(`Patient Added\nName: ${name}\nAge: ${age}`);

    setName("");
    setAge("");
  };

  return (
    <div className="form-container">
      <h2>Add Patient</h2>

      <form onSubmit={handleSubmit}>
        <FormField label="Patient Name">
          <input
            type="text"
            placeholder="Enter patient name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>

        <FormField label="Age">
          <input
            type="text"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(digitsOnly(e.target.value))}
            {...numericInputProps}
          />
        </FormField>

        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default AddPatientForm;
