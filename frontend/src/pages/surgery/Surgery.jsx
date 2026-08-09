import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Scissors, Clock, AlertCircle } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialSurgery = {
  patient: "",
  surgeon: "",
  type: "",
  room: "",
  date: "",
  time: "",
  duration: "",
  priority: "Normal",
  status: "Scheduled",
  notes: "",
};

function Surgery() {
  const [surgery, setSurgery] = useState(initialSurgery);
  const [surgeries, setSurgeries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("surgeries"));
    if (data) setSurgeries(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("surgeries", JSON.stringify(surgeries));
  }, [surgeries]);

  const handleChange = (e) => setSurgery({ ...surgery, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setSurgery(initialSurgery);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSurgery(initialSurgery);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveSurgery = (e) => {
    e.preventDefault();
    if (!surgery.patient || !surgery.surgeon || !surgery.type) {
      alert("Patient, Surgeon, and Surgery Type are required");
      return;
    }
    if (editId) {
      setSurgeries(surgeries.map((item) => (item.id === editId ? { ...surgery, id: editId } : item)));
    } else {
      setSurgeries([...surgeries, { ...surgery, id: Date.now() }]);
    }
    closeModal();
  };

  const editSurgery = (id) => {
    const selected = surgeries.find((item) => item.id === id);
    setSurgery(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteSurgery = (id) => setSurgeries(surgeries.filter((item) => item.id !== id));

  const filteredSurgeries = surgeries.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase()) ||
    item.surgeon.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date().toISOString().split("T")[0];
  const todaySurgeries = surgeries.filter((s) => s.date === today).length;
  const scheduled = surgeries.filter((s) => s.status === "Scheduled").length;
  const completed = surgeries.filter((s) => s.status === "Completed").length;
  const urgent = surgeries.filter((s) => s.priority === "Urgent").length;

  const columns = [
    { key: "patient", header: "Patient", render: (item) => <strong className="record-name">{item.patient || "-"}</strong> },
    { key: "surgeon", header: "Surgeon", render: (item) => item.surgeon || "-" },
    { key: "type", header: "Surgery Type", render: (item) => <span className="soft-pill">{item.type || "-"}</span> },
    { key: "room", header: "OT Room", render: (item) => item.room || "-" },
    { key: "date", header: "Date", render: (item) => item.date || "-" },
    { key: "time", header: "Time", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {item.time || "-"}</span> },
    { key: "duration", header: "Duration", render: (item) => item.duration || "-" },
    {
      key: "priority", header: "Priority",
      render: (item) => (
        <span className="badge" style={{
          background: item.priority === "Urgent" ? "linear-gradient(135deg, rgba(196, 91, 91, 0.15), rgba(196, 91, 91, 0.05))" : item.priority === "High" ? "linear-gradient(135deg, rgba(212, 160, 23, 0.15), rgba(212, 160, 23, 0.05))" : "linear-gradient(135deg, rgba(20, 117, 112, 0.12), rgba(20, 117, 112, 0.04))",
          color: item.priority === "Urgent" ? "#c45b5b" : item.priority === "High" ? "#a07800" : "var(--color-primary)",
          border: item.priority === "Urgent" ? "1px solid rgba(196, 91, 91, 0.2)" : item.priority === "High" ? "1px solid rgba(212, 160, 23, 0.2)" : "1px solid rgba(20, 117, 112, 0.15)"
        }}>{item.priority}</span>
      )
    },
    { key: "status", header: "Status", render: (item) => <span className={item.status === "Completed" ? "badge bg-success" : item.status === "In Progress" ? "badge bg-warning" : "badge"} style={item.status === "Cancelled" ? { background: "linear-gradient(135deg, rgba(196, 91, 91, 0.1), rgba(196, 91, 91, 0.03))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" } : {}}>{item.status}</span> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editSurgery(item.id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteSurgery(item.id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="surgery-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Scissors size={26} color="var(--color-primary)" /> OT & Surgery Schedule
          </h1>
          <div className="summary-row">
            <span className="summary-pill">Today: {todaySurgeries}</span>
            <span className="summary-pill">Scheduled: {scheduled}</span>
            <span className="summary-pill">Completed: {completed}</span>
            <span className="summary-pill" style={{ background: "linear-gradient(135deg, rgba(196, 91, 91, 0.12), rgba(196, 91, 91, 0.04))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" }}>
              <AlertCircle size={14} /> Urgent: {urgent}
            </span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Schedule Surgery
        </button>
      </div>

      <DataTable
        title="Surgery List"
        search={search}
        searchPlaceholder="Search patient, surgeon, or type..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredSurgeries}
        getRowKey={(row) => row.id}
        emptyMessage="No surgeries scheduled"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Surgery" : "Schedule Surgery"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveSurgery}>
          <input className="form-control" name="patient" placeholder="Patient Name" value={surgery.patient} onChange={handleChange} />
          <input className="form-control" name="surgeon" placeholder="Surgeon Name" value={surgery.surgeon} onChange={handleChange} />
          <input className="form-control" name="type" placeholder="Surgery Type (e.g. Appendectomy, C-Section)" value={surgery.type} onChange={handleChange} />
          <input className="form-control" name="room" placeholder="OT Room Number" value={surgery.room} onChange={handleChange} />
          <input className="form-control" type="date" name="date" value={surgery.date} onChange={handleChange} />
          <input className="form-control" type="time" name="time" value={surgery.time} onChange={handleChange} />
          <input className="form-control" name="duration" placeholder="Estimated Duration (e.g. 2 hours)" value={surgery.duration} onChange={handleChange} />
          <select className="form-control" name="priority" value={surgery.priority} onChange={handleChange}>
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
          <select className="form-control" name="status" value={surgery.status} onChange={handleChange}>
            <option>Scheduled</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input className="form-control" name="notes" placeholder="Pre-op Notes / Instructions" value={surgery.notes} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Surgery" : "Schedule Surgery"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default Surgery;
