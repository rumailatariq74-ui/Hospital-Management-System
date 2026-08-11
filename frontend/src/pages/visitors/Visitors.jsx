import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, LogIn, LogOut, UserCheck } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialVisitor = {
  name: "",
  patient: "",
  relation: "",
  phone: "",
  entryTime: "",
  exitTime: "",
  purpose: "",
};

function Visitors() {
  const [visitor, setVisitor] = useState(initialVisitor);
  const [visitors, setVisitors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/visitors");
      setVisitors(data || []);
    } catch (err) {
      alert(err.message || "Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setVisitor({ ...visitor, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setVisitor(initialVisitor);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setVisitor(initialVisitor);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveVisitor = async (e) => {
    e.preventDefault();
    if (!visitor.name || !visitor.patient) {
      alert("Visitor name and patient name are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/visitors/${editId}`, visitor);
      } else {
        await apiPost("/visitors", visitor);
      }
      await fetchVisitors();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save visitor");
    }
  };

  const editVisitor = (id) => {
    const selected = visitors.find((item) => item._id === id);
    setVisitor(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteVisitor = async (id) => {
    try {
      await apiDelete(`/visitors/${id}`);
      await fetchVisitors();
    } catch (err) {
      alert(err.message || "Failed to delete visitor");
    }
  };

  const filteredVisitors = visitors.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.patient.toLowerCase().includes(search.toLowerCase())
  );

  const currentlyInside = visitors.filter((v) => v.entryTime && !v.exitTime).length;
  const totalToday = visitors.filter((v) => {
    if (!v.entryTime) return false;
    const today = new Date().toISOString().split("T")[0];
    return v.entryTime.startsWith(today);
  }).length;

  const columns = [
    { key: "name", header: "Visitor", render: (item) => <strong className="record-name">{item.name || "-"}</strong> },
    { key: "patient", header: "Visiting Patient", render: (item) => item.patient || "-" },
    { key: "relation", header: "Relation", render: (item) => <span className="soft-pill">{item.relation || "-"}</span> },
    { key: "phone", header: "Phone", render: (item) => item.phone || "-" },
    { key: "purpose", header: "Purpose", render: (item) => item.purpose || "-" },
    { key: "entryTime", header: "Entry", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LogIn size={12} /> {item.entryTime || "-"}</span> },
    { key: "exitTime", header: "Exit", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LogOut size={12} /> {item.exitTime || "-"}</span> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editVisitor(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteVisitor(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="visitors-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserCheck size={26} color="var(--color-primary)" /> Visitor Management
          </h1>
          <div className="summary-row">
            <span className="summary-pill">Total Visitors: {visitors.length}</span>
            <span className="summary-pill">Currently Inside: {currentlyInside}</span>
            <span className="summary-pill">Today: {totalToday}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Visitor
        </button>
      </div>

      <DataTable
        title="Visitor Log"
        search={search}
        searchPlaceholder="Search visitor or patient..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredVisitors}
        getRowKey={(row) => row._id}
        emptyMessage="No visitors recorded"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Visitor" : "Add Visitor"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveVisitor}>
          <input className="form-control" name="name" placeholder="Visitor Full Name" value={visitor.name} onChange={handleChange} />
          <input className="form-control" name="patient" placeholder="Patient Name Being Visited" value={visitor.patient} onChange={handleChange} />
          <input className="form-control" name="relation" placeholder="Relation to Patient (e.g. Father, Friend)" value={visitor.relation} onChange={handleChange} />
          <input className="form-control" name="phone" placeholder="Visitor Phone" value={visitor.phone} onChange={handleChange} />
          <input className="form-control" name="purpose" placeholder="Purpose of Visit" value={visitor.purpose} onChange={handleChange} />
          <input className="form-control" type="datetime-local" name="entryTime" placeholder="Entry Time" value={visitor.entryTime} onChange={handleChange} />
          <input className="form-control" type="datetime-local" name="exitTime" placeholder="Exit Time" value={visitor.exitTime} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Visitor" : "Add Visitor"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Visitors;
