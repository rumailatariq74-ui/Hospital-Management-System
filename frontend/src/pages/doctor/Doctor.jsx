import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialDoctor = {
  name: "",
  specialization: "",
  phone: "",
  experience: "",
};

function Doctor() {
  const [doctor, setDoctor] = useState(initialDoctor);
  const [doctors, setDoctors] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedDoctors = JSON.parse(localStorage.getItem("doctors"));

    if (savedDoctors) {
      setDoctors(savedDoctors);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [doctors]);

  const handleChange = (event) => {
    setDoctor({
      ...doctor,
      [event.target.name]: event.target.value,
    });
  };

  const openAddModal = () => {
    setDoctor(initialDoctor);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDoctor(initialDoctor);
    setEditIndex(null);
    setIsModalOpen(false);
  };

  const saveDoctor = (event) => {
    event.preventDefault();

    if (editIndex !== null) {
      const updatedDoctors = [...doctors];
      updatedDoctors[editIndex] = doctor;
      setDoctors(updatedDoctors);
    } else {
      setDoctors([...doctors, doctor]);
    }

    closeModal();
  };

  const editDoctor = (index) => {
    setDoctor(doctors[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const deleteDoctor = (index) => {
    setDoctors(doctors.filter((_, itemIndex) => itemIndex !== index));
  };

  const filteredDoctors = doctors
    .map((item, index) => ({ item, originalIndex: index }))
    .filter(({ item }) => item.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      key: "name",
      header: "Name",
      render: ({ item }) => <strong className="record-name">{item.name || "-"}</strong>,
    },
    {
      key: "specialization",
      header: "Specialization",
      render: ({ item }) => <span className="soft-pill">{item.specialization || "General"}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      render: ({ item }) => item.phone || "-",
    },
    {
      key: "experience",
      header: "Experience",
      render: ({ item }) => item.experience || "-",
    },
    {
      key: "actions",
      header: "Action",
      render: ({ item, originalIndex }) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit ${item.name || "doctor"}`}
            title="Edit"
            onClick={() => editDoctor(originalIndex)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete ${item.name || "doctor"}`}
            title="Delete"
            onClick={() => deleteDoctor(originalIndex)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="doctor-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors Management</h1>
          <h4>Total Doctors: {doctors.length}</h4>
        </div>

        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      <DataTable
        title="Doctor List"
        search={search}
        searchPlaceholder="Search doctors..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredDoctors}
        getRowKey={(row) => row.originalIndex}
        emptyMessage="No doctors found"
      />

      <Modal
        isOpen={isModalOpen}
        title={editIndex !== null ? "Update Doctor" : "Add Doctor"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={saveDoctor}>
          <input className="form-control" name="name" placeholder="Doctor Name" value={doctor.name} onChange={handleChange} />
          <input className="form-control" name="specialization" placeholder="Specialization" value={doctor.specialization} onChange={handleChange} />
          <input className="form-control" name="phone" placeholder="Phone Number" value={doctor.phone} onChange={handleChange} />
          <input className="form-control" name="experience" placeholder="Experience" value={doctor.experience} onChange={handleChange} />

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editIndex !== null ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Doctor;
