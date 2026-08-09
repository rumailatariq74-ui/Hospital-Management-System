import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Wrench, Calendar, AlertTriangle } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

const initialEquipment = {
  name: "",
  type: "",
  serialNo: "",
  manufacturer: "",
  purchaseDate: "",
  lastService: "",
  nextService: "",
  status: "Operational",
  location: "",
};

function Equipment() {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [equipments, setEquipments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("equipments"));
    if (data) setEquipments(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("equipments", JSON.stringify(equipments));
  }, [equipments]);

  const handleChange = (e) => setEquipment({ ...equipment, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setEquipment(initialEquipment);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEquipment(initialEquipment);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveEquipment = (e) => {
    e.preventDefault();
    if (!equipment.name || !equipment.serialNo) {
      alert("Equipment name and serial number are required");
      return;
    }
    if (editId) {
      setEquipments(equipments.map((item) => (item.id === editId ? { ...equipment, id: editId } : item)));
    } else {
      setEquipments([...equipments, { ...equipment, id: Date.now() }]);
    }
    closeModal();
  };

  const editEquipmentItem = (id) => {
    const selected = equipments.find((item) => item.id === id);
    setEquipment(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteEquipmentItem = (id) => setEquipments(equipments.filter((item) => item.id !== id));

  const filteredEquipments = equipments.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.serialNo.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  const operational = equipments.filter((e) => e.status === "Operational").length;
  const maintenance = equipments.filter((e) => e.status === "Under Maintenance").length;
  const outOfOrder = equipments.filter((e) => e.status === "Out of Order").length;

  const today = new Date().toISOString().split("T")[0];
  const overdueService = equipments.filter((e) => e.nextService && e.nextService < today && e.status !== "Out of Order").length;

  const columns = [
    { key: "name", header: "Equipment", render: (item) => <strong className="record-name">{item.name || "-"}</strong> },
    { key: "type", header: "Type", render: (item) => <span className="soft-pill">{item.type || "-"}</span> },
    { key: "serialNo", header: "Serial No", render: (item) => item.serialNo || "-" },
    { key: "manufacturer", header: "Manufacturer", render: (item) => item.manufacturer || "-" },
    { key: "location", header: "Location", render: (item) => item.location || "-" },
    { key: "lastService", header: "Last Service", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wrench size={12} /> {item.lastService || "-"}</span> },
    { key: "nextService", header: "Next Service", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: item.nextService && item.nextService < today ? '#c45b5b' : 'inherit' }}><Calendar size={12} /> {item.nextService || "-"} {item.nextService && item.nextService < today ? '(Overdue)' : ''}</span> },
    { key: "status", header: "Status", render: (item) => <span className={item.status === "Operational" ? "badge bg-success" : item.status === "Under Maintenance" ? "badge bg-warning" : "badge"} style={item.status === "Out of Order" ? { background: "linear-gradient(135deg, rgba(196, 91, 91, 0.1), rgba(196, 91, 91, 0.03))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" } : {}}>{item.status}</span> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editEquipmentItem(item.id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteEquipmentItem(item.id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="equipment-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Wrench size={26} color="var(--color-primary)" /> Medical Equipment
          </h1>
          <div className="summary-row">
            <span className="summary-pill">Total: {equipments.length}</span>
            <span className="summary-pill">Operational: {operational}</span>
            <span className="summary-pill">Maintenance: {maintenance}</span>
            <span className="summary-pill" style={{ background: "linear-gradient(135deg, rgba(196, 91, 91, 0.12), rgba(196, 91, 91, 0.04))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" }}>
              <AlertTriangle size={14} /> Out of Order: {outOfOrder}
            </span>
            {overdueService > 0 && (
              <span className="summary-pill" style={{ background: "linear-gradient(135deg, rgba(212, 160, 23, 0.12), rgba(212, 160, 23, 0.04))", color: "#a07800", border: "1px solid rgba(212, 160, 23, 0.15)" }}>
                Service Overdue: {overdueService}
              </span>
            )}
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Equipment
        </button>
      </div>

      <DataTable
        title="Equipment Inventory"
        search={search}
        searchPlaceholder="Search equipment, serial, or location..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredEquipments}
        getRowKey={(row) => row.id}
        emptyMessage="No equipment registered"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Equipment" : "Add Equipment"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveEquipment}>
          <input className="form-control" name="name" placeholder="Equipment Name (e.g. MRI Machine, X-Ray)" value={equipment.name} onChange={handleChange} />
          <input className="form-control" name="type" placeholder="Type / Category" value={equipment.type} onChange={handleChange} />
          <input className="form-control" name="serialNo" placeholder="Serial Number" value={equipment.serialNo} onChange={handleChange} />
          <input className="form-control" name="manufacturer" placeholder="Manufacturer" value={equipment.manufacturer} onChange={handleChange} />
          <input className="form-control" name="location" placeholder="Location (e.g. Room 101, Radiology)" value={equipment.location} onChange={handleChange} />
          <input className="form-control" type="date" name="purchaseDate" placeholder="Purchase Date" value={equipment.purchaseDate} onChange={handleChange} />
          <input className="form-control" type="date" name="lastService" placeholder="Last Service Date" value={equipment.lastService} onChange={handleChange} />
          <input className="form-control" type="date" name="nextService" placeholder="Next Service Date" value={equipment.nextService} onChange={handleChange} />
          <select className="form-control" name="status" value={equipment.status} onChange={handleChange}>
            <option>Operational</option>
            <option>Under Maintenance</option>
            <option>Out of Order</option>
          </select>
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Equipment" : "Add Equipment"}</button>
        </form>
      </Modal>
    </div>
  );
}

export default Equipment;
