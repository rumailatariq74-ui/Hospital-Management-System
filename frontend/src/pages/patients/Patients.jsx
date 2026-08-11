import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

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
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/patients");
      setPatients(data || []);
    } catch (err) {
      alert(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setPatient({
      ...patient,
      [event.target.name]: event.target.value,
    });
  };

  const openAddModal = () => {
    setPatient(initialPatient);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPatient(initialPatient);
    setEditId(null);
    setIsModalOpen(false);
  };

  const savePatient = async (event) => {
    event.preventDefault();

    try {
      if (editId) {
        await apiPut(`/patients/${editId}`, patient);
      } else {
        await apiPost("/patients", patient);
      }
      await fetchPatients();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save patient");
    }
  };

  const editPatient = (id) => {
    const selected = patients.find((item) => item._id === id);
    setPatient(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deletePatient = async (id) => {
    try {
      await apiDelete(`/patients/${id}`);
      await fetchPatients();
    } catch (err) {
      alert(err.message || "Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item) => <strong className="record-name">{item.name || "-"}</strong>,
    },
    {
      key: "age",
      header: "Age",
      render: (item) => item.age || "-",
    },
    {
      key: "gender",
      header: "Gender",
      render: (item) => <span className="soft-pill">{item.gender || "Unknown"}</span>,
    },
    {
      key: "disease",
      header: "Disease",
      render: (item) => item.disease || "-",
    },
    {
      key: "phone",
      header: "Phone",
      render: (item) => item.phone || "-",
    },
    {
      key: "actions",
      header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit ${item.name || "patient"}`}
            title="Edit"
            onClick={() => editPatient(item._id)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete ${item.name || "patient"}`}
            title="Delete"
            onClick={() => deletePatient(item._id)}
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
        getRowKey={(row) => row._id}
        emptyMessage="No patients found"
      />

      <Modal
        isOpen={isModalOpen}
        title={editId ? "Update Patient" : "Add Patient"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={savePatient}>
          <input className="form-control" name="name" placeholder="Patient Name" value={patient.name} onChange={handleChange} />
          <input className="form-control" name="age" placeholder="Age" value={patient.age} onChange={handleChange} />
          <input className="form-control" name="gender" placeholder="Gender" value={patient.gender} onChange={handleChange} />
          <input className="form-control" name="disease" placeholder="Disease" value={patient.disease} onChange={handleChange} />
          <input className="form-control" name="phone" placeholder="Phone" value={patient.phone} onChange={handleChange} />

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editId ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Patients;
