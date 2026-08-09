import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialStaff = {
  name: "",
  role: "Nurse",
  department: "",
  phone: "",
  shift: "Morning",
  salary: "",
};

function Staff() {
  const [staffMember, setStaffMember] = useState(initialStaff);
  const [staff, setStaff] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("staff"));
    if (data) setStaff(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("staff", JSON.stringify(staff));
  }, [staff]);

  const handleChange = (e) => setStaffMember({ ...staffMember, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setStaffMember(initialStaff);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setStaffMember(initialStaff);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveStaff = (e) => {
    e.preventDefault();
    if (!staffMember.name || !staffMember.role) {
      alert("Name and Role are required");
      return;
    }
    if (editId) {
      setStaff(staff.map((item) => (item.id === editId ? { ...staffMember, id: editId } : item)));
    } else {
      setStaff([...staff, { ...staffMember, id: Date.now() }]);
    }
    closeModal();
  };

  const editStaffMember = (id) => {
    const selected = staff.find((item) => item.id === id);
    setStaffMember(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteStaffMember = (id) => setStaff(staff.filter((item) => item.id !== id));

  const filteredStaff = staff.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalSalary = staff.reduce((sum, s) => sum + Number(s.salary || 0), 0);

  const columns = [
    { key: "name", header: "Name", render: (item) => <strong className="record-name">{item.name || "-"}</strong> },
    { key: "role", header: "Role", render: (item) => <span className="soft-pill">{item.role || "-"}</span> },
    { key: "department", header: "Department", render: (item) => item.department || "-" },
    { key: "phone", header: "Phone", render: (item) => item.phone || "-" },
    { key: "shift", header: "Shift", render: (item) => item.shift || "-" },
    { key: "salary", header: "Salary", render: (item) => <strong>Rs. {item.salary || 0}</strong> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editStaffMember(item.id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteStaffMember(item.id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="staff-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff & Nurses</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Staff: {staff.length}</span>
            <span className="summary-pill">Monthly Payroll: Rs. {totalSalary.toLocaleString()}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Staff
        </button>
      </div>

      <DataTable
        title="Staff List"
        search={search}
        searchPlaceholder="Search staff..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredStaff}
        getRowKey={(row) => row.id}
        emptyMessage="No staff found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Staff" : "Add Staff"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveStaff}>
          <input className="form-control" name="name" placeholder="Full Name" value={staffMember.name} onChange={handleChange} />
          <select className="form-control" name="role" value={staffMember.role} onChange={handleChange}>
            <option>Nurse</option>
            <option>Receptionist</option>
            <option>Lab Technician</option>
            <option>Pharmacist</option>
            <option>Accountant</option>
            <option>Security</option>
            <option>Cleaner</option>
          </select>
          <input className="form-control" name="department" placeholder="Department" value={staffMember.department} onChange={handleChange} />
          <input className="form-control" name="phone" placeholder="Phone Number" value={staffMember.phone} onChange={handleChange} />
          <select className="form-control" name="shift" value={staffMember.shift} onChange={handleChange}>
            <option>Morning</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
          <input className="form-control" type="number" name="salary" placeholder="Monthly Salary (Rs.)" value={staffMember.salary} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Staff" : "Add Staff"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default Staff;
