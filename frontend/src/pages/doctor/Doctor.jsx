import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import { toast } from "react-toastify";
import { digitsOnly, numericInputProps } from "../../utils/inputValidation";

const initialDoctor = {
  name: "",
  specialization: "",
  phone: "",
  experience: "",
};

function Doctor() {
  const [doctor, setDoctor] = useState(initialDoctor);
  const [doctors, setDoctors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/doctors");
      setDoctors(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const numericFields = ["phone", "experience"];
    const value = numericFields.includes(event.target.name)
      ? digitsOnly(event.target.value)
      : event.target.value;

    setDoctor({
      ...doctor,
      [event.target.name]: value,
    });
  };

  const openAddModal = () => {
    setDoctor(initialDoctor);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDoctor(initialDoctor);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveDoctor = async (event) => {
    event.preventDefault();

    try {
      if (editId) {
        await apiPut(`/doctors/${editId}`, doctor);
      } else {
        await apiPost("/doctors", doctor);
      }
      await fetchDoctors();
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to save doctor");
    }
  };

  const editDoctor = (id) => {
    const selected = doctors.find((item) => item._id === id);
    setDoctor(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteDoctor = async (id) => {
    try {
      await apiDelete(`/doctors/${id}`);
      await fetchDoctors();
    } catch (err) {
      toast.error(err.message || "Failed to delete doctor");
    }
  };

  const filteredDoctors = doctors.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item) => <strong className="record-name">{item.name || "-"}</strong>,
    },
    {
      key: "specialization",
      header: "Specialization",
      render: (item) => <span className="soft-pill">{item.specialization || "General"}</span>,
    },
    {
      key: "phone",
      header: "Phone",
      render: (item) => item.phone || "-",
    },
    {
      key: "experience",
      header: "Experience",
      render: (item) => item.experience || "-",
    },
    {
      key: "actions",
      header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit ${item.name || "doctor"}`}
            title="Edit"
            onClick={() => editDoctor(item._id)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete ${item.name || "doctor"}`}
            title="Delete"
            onClick={() => deleteDoctor(item._id)}
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
        getRowKey={(row) => row._id}
        emptyMessage="No doctors found"
      />

      <Modal
        isOpen={isModalOpen}
        title={editId ? "Update Doctor" : "Add Doctor"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={saveDoctor}>
          <FormField label="Doctor Name">
            <input className="form-control" name="name" placeholder="Enter doctor name" value={doctor.name} onChange={handleChange} />
          </FormField>
          <FormField label="Specialization">
            <input className="form-control" name="specialization" placeholder="Enter specialization" value={doctor.specialization} onChange={handleChange} />
          </FormField>
          <FormField label="Phone Number">
            <input className="form-control" name="phone" placeholder="Enter phone number" value={doctor.phone} onChange={handleChange} {...numericInputProps} />
          </FormField>
          <FormField label="Experience">
            <input className="form-control" name="experience" placeholder="Years of experience" value={doctor.experience} onChange={handleChange} {...numericInputProps} />
          </FormField>

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editId ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Doctor;
