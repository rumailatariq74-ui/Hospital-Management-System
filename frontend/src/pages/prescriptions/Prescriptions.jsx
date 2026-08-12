import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import SearchableDropdown from "../../components/SearchableDropdown";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import { toast } from "react-toastify";

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
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
    fetchFormOptions();
  }, []);

  const fetchFormOptions = async () => {
    try {
      const [patientData, doctorData] = await Promise.all([apiGet("/patients"), apiGet("/doctors")]);
      setPatients(patientData || []);
      setDoctors(doctorData || []);
    } catch (err) {
      toast.error(err.message || "Failed to load patient and doctor options");
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/prescriptions");
      setRxList(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load prescriptions");
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
      toast.warning("Patient and medicines are required");
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
      toast.error(err.message || "Failed to save prescription");
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
      toast.error(err.message || "Failed to delete prescription");
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
  const patientOptions = patients.map((patient) => patient.name).filter(Boolean);
  const doctorOptions = doctors.map((doctor) => doctor.name).filter(Boolean);

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
          <SearchableDropdown label="Patient" value={rx.patient} options={patientOptions} placeholder="Select patient" onChange={(value) => setRx({ ...rx, patient: value })} />
          <SearchableDropdown label="Doctor" value={rx.doctor} options={doctorOptions} placeholder="Select doctor" onChange={(value) => setRx({ ...rx, doctor: value })} />
          <FormField label="Medicines">
            <input className="form-control" name="medicines" placeholder="e.g. Paracetamol, Amoxicillin" value={rx.medicines} onChange={handleChange} />
          </FormField>
          <FormField label="Dosage">
            <input className="form-control" name="dosage" placeholder="e.g. 1 tablet 3x daily" value={rx.dosage} onChange={handleChange} />
          </FormField>
          <FormField label="Duration">
            <input className="form-control" name="duration" placeholder="e.g. 7 days" value={rx.duration} onChange={handleChange} />
          </FormField>
          <FormField label="Date">
            <input className="form-control" type="date" name="date" value={rx.date} onChange={handleChange} />
          </FormField>
          <FormField label="Notes">
            <input className="form-control" name="notes" placeholder="Additional notes" value={rx.notes} onChange={handleChange} />
          </FormField>
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Prescription" : "Save Prescription"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Prescriptions;
