import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, AlertTriangle, HeartPulse } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialCase = {
  patient: "",
  condition: "",
  priority: "Medium",
  doctor: "",
  vitals: "",
  status: "Waiting",
  time: "",
};

function Emergency() {
  const [caseItem, setCaseItem] = useState(initialCase);
  const [cases, setCases] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("emergencyCases"));
    if (data) setCases(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("emergencyCases", JSON.stringify(cases));
  }, [cases]);

  const handleChange = (e) => setCaseItem({ ...caseItem, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setCaseItem(initialCase);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCaseItem(initialCase);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveCase = (e) => {
    e.preventDefault();
    if (!caseItem.patient || !caseItem.condition) {
      alert("Patient and condition are required");
      return;
    }
    if (editId) {
      setCases(cases.map((item) => (item.id === editId ? { ...caseItem, id: editId } : item)));
    } else {
      setCases([...cases, { ...caseItem, id: Date.now() }]);
    }
    closeModal();
  };

  const editCase = (id) => {
    const selected = cases.find((item) => item.id === id);
    setCaseItem(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteCase = (id) => setCases(cases.filter((item) => item.id !== id));

  const filteredCases = cases.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase()) ||
    item.condition.toLowerCase().includes(search.toLowerCase())
  );

  const waiting = cases.filter((c) => c.status === "Waiting").length;
  const inTreatment = cases.filter((c) => c.status === "In Treatment").length;
  const critical = cases.filter((c) => c.priority === "Critical").length;

  const columns = [
    { key: "patient", header: "Patient", render: (item) => <strong className="record-name">{item.patient || "-"}</strong> },
    { key: "condition", header: "Condition", render: (item) => <span className="soft-pill">{item.condition || "-"}</span> },
    {
      key: "priority", header: "Priority",
      render: (item) => (
        <span className={
          item.priority === "Critical" ? "badge" :
          item.priority === "High" ? "badge" : "badge"
        } style={{
          background: item.priority === "Critical" ? "linear-gradient(135deg, rgba(196, 91, 91, 0.15), rgba(196, 91, 91, 0.05))" :
                     item.priority === "High" ? "linear-gradient(135deg, rgba(212, 160, 23, 0.15), rgba(212, 160, 23, 0.05))" :
                     "linear-gradient(135deg, rgba(20, 117, 112, 0.12), rgba(20, 117, 112, 0.04))",
          color: item.priority === "Critical" ? "#c45b5b" : item.priority === "High" ? "#a07800" : "var(--color-primary)",
          border: item.priority === "Critical" ? "1px solid rgba(196, 91, 91, 0.2)" : item.priority === "High" ? "1px solid rgba(212, 160, 23, 0.2)" : "1px solid rgba(20, 117, 112, 0.15)"
        }}>{item.priority}</span>
      )
    },
    { key: "doctor", header: "Attending Doctor", render: (item) => item.doctor || "-" },
    { key: "vitals", header: "Vitals", render: (item) => item.vitals || "-" },
    {
      key: "status", header: "Status",
      render: (item) => <span className={item.status === "Admitted" ? "badge bg-success" : item.status === "In Treatment" ? "badge bg-warning" : "badge"} style={item.status === "Discharged" ? { background: "linear-gradient(135deg, rgba(143, 181, 154, 0.15), rgba(143, 181, 154, 0.05))", color: "#2d7a5a", border: "1px solid rgba(143, 181, 154, 0.2)" } : {}}>{item.status}</span>
    },
    { key: "time", header: "Time", render: (item) => item.time || "-" },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editCase(item.id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteCase(item.id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="emergency-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={26} color="#c45b5b" /> Emergency & Triage
          </h1>
          <div className="summary-row">
            <span className="summary-pill" style={{ background: "linear-gradient(135deg, rgba(196, 91, 91, 0.12), rgba(196, 91, 91, 0.04))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" }}>
              <HeartPulse size={14} /> Critical: {critical}
            </span>
            <span className="summary-pill">Waiting: {waiting}</span>
            <span className="summary-pill">In Treatment: {inTreatment}</span>
            <span className="summary-pill">Total Cases: {cases.length}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Emergency Case
        </button>
      </div>

      <DataTable
        title="Emergency Cases"
        search={search}
        searchPlaceholder="Search patient or condition..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredCases}
        getRowKey={(row) => row.id}
        emptyMessage="No emergency cases"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Case" : "Add Emergency Case"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveCase}>
          <input className="form-control" name="patient" placeholder="Patient Name" value={caseItem.patient} onChange={handleChange} />
          <input className="form-control" name="condition" placeholder="Condition (e.g. Chest Pain, Trauma)" value={caseItem.condition} onChange={handleChange} />
          <select className="form-control" name="priority" value={caseItem.priority} onChange={handleChange}>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input className="form-control" name="doctor" placeholder="Attending Doctor" value={caseItem.doctor} onChange={handleChange} />
          <input className="form-control" name="vitals" placeholder="Vitals (e.g. BP 120/80, HR 72)" value={caseItem.vitals} onChange={handleChange} />
          <select className="form-control" name="status" value={caseItem.status} onChange={handleChange}>
            <option>Waiting</option>
            <option>In Treatment</option>
            <option>Admitted</option>
            <option>Discharged</option>
            <option>Referred</option>
          </select>
          <input className="form-control" type="time" name="time" value={caseItem.time} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Case" : "Add Case"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default Emergency;
