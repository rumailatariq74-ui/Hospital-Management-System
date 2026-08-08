import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialPatient = {
  name: "",
  age: "",
  gender: "",
  disease: "",
  phone: "",
};

function Patients() {
  const [patient, setPatient] = useState(initialPatient);
  const [patients, setPatients] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("patients"));

    if (saved) {
      setPatients(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const handleChange = (event) => {
    setPatient({
      ...patient,
      [event.target.name]: event.target.value,
    });
  };

  const openAddModal = () => {
    setPatient(initialPatient);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPatient(initialPatient);
    setEditIndex(null);
    setIsModalOpen(false);
  };

  const savePatient = (event) => {
    event.preventDefault();

    if (editIndex !== null) {
      const updated = [...patients];
      updated[editIndex] = patient;
      setPatients(updated);
    } else {
      setPatients([...patients, patient]);
    }

    closeModal();
  };

  const editPatient = (index) => {
    setPatient(patients[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const deletePatient = (index) => {
    setPatients(patients.filter((_, itemIndex) => itemIndex !== index));
  };

  const filteredPatients = patients
    .map((item, index) => ({ item, originalIndex: index }))
    .filter(({ item }) => item.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      key: "name",
      header: "Name",
      render: ({ item }) => <strong className="record-name">{item.name || "-"}</strong>,
    },
    {
      key: "age",
      header: "Age",
      render: ({ item }) => item.age || "-",
    },
    {
      key: "gender",
      header: "Gender",
      render: ({ item }) => <span className="soft-pill">{item.gender || "Unknown"}</span>,
    },
    {
      key: "disease",
      header: "Disease",
      render: ({ item }) => item.disease || "-",
    },
    {
      key: "phone",
      header: "Phone",
      render: ({ item }) => item.phone || "-",
    },
    {
      key: "actions",
      header: "Action",
      render: ({ item, originalIndex }) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit ${item.name || "patient"}`}
            title="Edit"
            onClick={() => editPatient(originalIndex)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete ${item.name || "patient"}`}
            title="Delete"
            onClick={() => deletePatient(originalIndex)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="patient-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients Management</h1>
          <h4>Total Patients: {patients.length}</h4>
        </div>

        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} />
          Add Patient
        </button>
      </div>

      <DataTable
        title="Patient List"
        search={search}
        searchPlaceholder="Search patients..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredPatients}
        getRowKey={(row) => row.originalIndex}
        emptyMessage="No patients found"
      />

      <Modal
        isOpen={isModalOpen}
        title={editIndex !== null ? "Update Patient" : "Add Patient"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={savePatient}>
          <input className="form-control" name="name" placeholder="Patient Name" value={patient.name} onChange={handleChange} />
          <input className="form-control" name="age" placeholder="Age" value={patient.age} onChange={handleChange} />
          <input className="form-control" name="gender" placeholder="Gender" value={patient.gender} onChange={handleChange} />
          <input className="form-control" name="disease" placeholder="Disease" value={patient.disease} onChange={handleChange} />
          <input className="form-control" name="phone" placeholder="Phone" value={patient.phone} onChange={handleChange} />

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editIndex !== null ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Patients;
