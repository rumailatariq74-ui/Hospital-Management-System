import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialRx = {
  patient: "",
  doctor: "",
  medicines: "",
  dosage: "",
  duration: "",
  date: "",
  notes: "",
};

function Prescriptions() {
  const [rx, setRx] = useState(initialRx);
  const [rxList, setRxList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/prescriptions");
      setRxList(data || []);
    } catch (err) {
      alert(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setRx({ ...rx, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setRx(initialRx);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setRx(initialRx);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveRx = async (e) => {
    e.preventDefault();
    if (!rx.patient || !rx.medicines) {
      alert("Patient and medicines are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/prescriptions/${editId}`, rx);
      } else {
        await apiPost("/prescriptions", rx);
      }
      await fetchPrescriptions();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save prescription");
    }
  };

  const editRx = (id) => {
    const selected = rxList.find((item) => item._id === id);
    setRx(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteRx = async (id) => {
    try {
      await apiDelete(`/prescriptions/${id}`);
      await fetchPrescriptions();
    } catch (err) {
      alert(err.message || "Failed to delete prescription");
    }
  };

  const filteredRx = rxList.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase()) ||
    item.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const todayCount = rxList.filter((r) => {
    if (!r.date) return false;
    const d = new Date(r.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const columns = [
    { key: "patient", header: "Patient", render: (item) => <strong className="record-name">{item.patient || "-"}</strong> },
    { key: "doctor", header: "Doctor", render: (item) => item.doctor || "-" },
    { key: "medicines", header: "Medicines", render: (item) => <span className="soft-pill">{item.medicines || "-"}</span> },
    { key: "dosage", header: "Dosage", render: (item) => item.dosage || "-" },
    { key: "duration", header: "Duration", render: (item) => item.duration || "-" },
    { key: "date", header: "Date", render: (item) => item.date || "-" },
    { key: "notes", header: "Notes", render: (item) => item.notes || "-" },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editRx(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteRx(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="prescriptions-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prescriptions</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Prescriptions: {rxList.length}</span>
            <span className="summary-pill">Today: {todayCount}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Write Prescription
        </button>
      </div>

      <DataTable
        title="Prescription Records"
        search={search}
        searchPlaceholder="Search patient or doctor..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredRx}
        getRowKey={(row) => row._id}
        emptyMessage="No prescriptions found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Prescription" : "Write Prescription"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveRx}>
          <input className="form-control" name="patient" placeholder="Patient Name" value={rx.patient} onChange={handleChange} />
          <input className="form-control" name="doctor" placeholder="Doctor Name" value={rx.doctor} onChange={handleChange} />
          <input className="form-control" name="medicines" placeholder="Medicines (e.g. Paracetamol, Amoxicillin)" value={rx.medicines} onChange={handleChange} />
          <input className="form-control" name="dosage" placeholder="Dosage (e.g. 1 tablet 3x daily)" value={rx.dosage} onChange={handleChange} />
          <input className="form-control" name="duration" placeholder="Duration (e.g. 7 days)" value={rx.duration} onChange={handleChange} />
          <input className="form-control" type="date" name="date" value={rx.date} onChange={handleChange} />
          <input className="form-control" name="notes" placeholder="Additional Notes" value={rx.notes} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Prescription" : "Save Prescription"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Prescriptions;
