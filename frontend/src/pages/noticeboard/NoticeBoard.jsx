import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Megaphone, Pin, Bell } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialNotice = {
  title: "",
  message: "",
  category: "General",
  priority: "Normal",
  date: "",
  pinned: false,
};

function NoticeBoard() {
  const [notice, setNotice] = useState(initialNotice);
  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notices"));
    if (data) setNotices(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("notices", JSON.stringify(notices));
  }, [notices]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotice({ ...notice, [name]: type === "checkbox" ? checked : value });
  };

  const openAddModal = () => {
    setNotice(initialNotice);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNotice(initialNotice);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveNotice = (e) => {
    e.preventDefault();
    if (!notice.title || !notice.message) {
      alert("Title and message are required");
      return;
    }
    if (editId) {
      setNotices(notices.map((item) => (item.id === editId ? { ...notice, id: editId } : item)));
    } else {
      setNotices([...notices, { ...notice, id: Date.now() }]);
    }
    closeModal();
  };

  const editNotice = (id) => {
    const selected = notices.find((item) => item.id === id);
    setNotice(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteNotice = (id) => setNotices(notices.filter((item) => item.id !== id));

  const togglePin = (id) => {
    setNotices(notices.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)));
  };

  const filteredNotices = notices.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.message.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = notices.filter((n) => n.pinned).length;
  const highPriority = notices.filter((n) => n.priority === "High").length;

  const columns = [
    {
      key: "title", header: "Title",
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.pinned && <Pin size={14} color="#d4a017" />}
          <strong className="record-name">{item.title || "-"}</strong>
          {item.priority === "High" && <Bell size={12} color="#c45b5b" />}
        </div>
      ),
    },
    { key: "message", header: "Message", render: (item) => <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.message?.length > 60 ? item.message.slice(0, 60) + '...' : item.message}</span> },
    { key: "category", header: "Category", render: (item) => <span className="soft-pill">{item.category || "General"}</span> },
    {
      key: "priority", header: "Priority",
      render: (item) => (
        <span className="badge" style={{
          background: item.priority === "High" ? "linear-gradient(135deg, rgba(196, 91, 91, 0.15), rgba(196, 91, 91, 0.05))" : "linear-gradient(135deg, rgba(20, 117, 112, 0.12), rgba(20, 117, 112, 0.04))",
          color: item.priority === "High" ? "#c45b5b" : "var(--color-primary)",
          border: item.priority === "High" ? "1px solid rgba(196, 91, 91, 0.2)" : "1px solid rgba(20, 117, 112, 0.15)"
        }}>{item.priority}</span>
      ),
    },
    { key: "date", header: "Date", render: (item) => item.date || "-" },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn" type="button" title={item.pinned ? "Unpin" : "Pin"} onClick={() => togglePin(item.id)} style={{ background: item.pinned ? 'rgba(212, 160, 23, 0.1)' : undefined, color: item.pinned ? '#d4a017' : undefined }}>
            <Pin size={16} />
          </button>
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editNotice(item.id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteNotice(item.id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="noticeboard-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Megaphone size={26} color="var(--color-primary)" /> Notice Board
          </h1>
          <div className="summary-row">
            <span className="summary-pill">Total Notices: {notices.length}</span>
            <span className="summary-pill">Pinned: {pinned}</span>
            <span className="summary-pill" style={{ background: "linear-gradient(135deg, rgba(196, 91, 91, 0.12), rgba(196, 91, 91, 0.04))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" }}>
              High Priority: {highPriority}
            </span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Post Notice
        </button>
      </div>

      <DataTable
        title="Hospital Notices & Announcements"
        search={search}
        searchPlaceholder="Search notices..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredNotices}
        getRowKey={(row) => row.id}
        emptyMessage="No notices posted"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Notice" : "Post Notice"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveNotice}>
          <input className="form-control" name="title" placeholder="Notice Title" value={notice.title} onChange={handleChange} />
          <textarea className="form-control" name="message" placeholder="Message / Details" value={notice.message} onChange={handleChange} rows={4} style={{ resize: 'vertical', minHeight: 80 }} />
          <select className="form-control" name="category" value={notice.category} onChange={handleChange}>
            <option>General</option>
            <option>Staff</option>
            <option>Patients</option>
            <option>Emergency</option>
            <option>Event</option>
            <option>Holiday</option>
          </select>
          <select className="form-control" name="priority" value={notice.priority} onChange={handleChange}>
            <option>Normal</option>
            <option>High</option>
          </select>
          <input className="form-control" type="date" name="date" value={notice.date} onChange={handleChange} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
            <input type="checkbox" id="pinned" name="pinned" checked={notice.pinned} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
            <label htmlFor="pinned" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer' }}>Pin this notice to top</label>
          </div>
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Notice" : "Post Notice"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default NoticeBoard;
