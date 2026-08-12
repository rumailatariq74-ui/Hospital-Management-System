import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Wrench, Calendar, AlertTriangle } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import { toast } from "react-toastify";

const initialEquipment = {
  name: "",
  type: "",
  serialNumber: "",
  manufacturer: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  lastService: "",
  nextService: "",
  status: "Active",
  location: "",
};

function Equipment() {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [equipments, setEquipments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/equipment");
      setEquipments(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

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

  const saveEquipment = async (e) => {
    e.preventDefault();
    if (!equipment.name || !equipment.serialNumber) {
      toast.warning("Equipment name and serial number are required");
      return;
    }
    const payload = {
      ...equipment,
      purchaseDate: equipment.purchaseDate || new Date().toISOString().split("T")[0],
    };
    try {
      if (editId) {
        await apiPut(`/equipment/${editId}`, payload);
      } else {
        await apiPost("/equipment", payload);
      }
      await fetchEquipments();
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to save equipment");
    }
  };

  const editEquipmentItem = (id) => {
    const selected = equipments.find((item) => item._id === id);
    setEquipment(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteEquipmentItem = async (id) => {
    try {
      await apiDelete(`/equipment/${id}`);
      await fetchEquipments();
    } catch (err) {
      toast.error(err.message || "Failed to delete equipment");
    }
  };

  const filteredEquipments = equipments.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.serialNumber || item.serialNo || "").toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  const operational = equipments.filter((e) => e.status === "Active").length;
  const maintenance = equipments.filter((e) => e.status === "Under Maintenance").length;
  const outOfOrder = equipments.filter((e) => e.status === "Inactive").length;

  const today = new Date().toISOString().split("T")[0];
  const overdueService = equipments.filter((e) => e.nextService && e.nextService < today && e.status !== "Inactive").length;

  const columns = [
    { key: "name", header: "Equipment", render: (item) => <strong className="record-name">{item.name || "-"}</strong> },
    { key: "type", header: "Type", render: (item) => <span className="soft-pill">{item.type || "-"}</span> },
    { key: "serialNumber", header: "Serial No", render: (item) => item.serialNumber || item.serialNo || "-" },
    { key: "manufacturer", header: "Manufacturer", render: (item) => item.manufacturer || "-" },
    { key: "location", header: "Location", render: (item) => item.location || "-" },
    { key: "lastService", header: "Last Service", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Wrench size={12} /> {item.lastService || "-"}</span> },
    { key: "nextService", header: "Next Service", render: (item) => <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: item.nextService && item.nextService < today ? '#c45b5b' : 'inherit' }}><Calendar size={12} /> {item.nextService || "-"} {item.nextService && item.nextService < today ? '(Overdue)' : ''}</span> },
    { key: "status", header: "Status", render: (item) => <span className={item.status === "Active" ? "badge bg-success" : item.status === "Under Maintenance" ? "badge bg-warning" : "badge"} style={item.status === "Inactive" ? { background: "linear-gradient(135deg, rgba(196, 91, 91, 0.1), rgba(196, 91, 91, 0.03))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" } : {}}>{item.status}</span> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editEquipmentItem(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteEquipmentItem(item._id)}><Trash2 size={16} /></button>
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
            <span className="summary-pill">Active: {operational}</span>
            <span className="summary-pill">Maintenance: {maintenance}</span>
            <span className="summary-pill" style={{ background: "linear-gradient(135deg, rgba(196, 91, 91, 0.12), rgba(196, 91, 91, 0.04))", color: "#c45b5b", border: "1px solid rgba(196, 91, 91, 0.15)" }}>
              <AlertTriangle size={14} /> Inactive: {outOfOrder}
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
        getRowKey={(row) => row._id}
        emptyMessage="No equipment registered"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Equipment" : "Add Equipment"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveEquipment}>
          <FormField label="Equipment Name">
            <input className="form-control" name="name" placeholder="e.g. MRI Machine, X-Ray" value={equipment.name} onChange={handleChange} />
          </FormField>
          <FormField label="Type / Category">
            <input className="form-control" name="type" placeholder="Enter type or category" value={equipment.type} onChange={handleChange} />
          </FormField>
          <FormField label="Serial Number">
            <input className="form-control" name="serialNumber" placeholder="Enter serial number" value={equipment.serialNumber || equipment.serialNo || ""} onChange={handleChange} />
          </FormField>
          <FormField label="Manufacturer">
            <input className="form-control" name="manufacturer" placeholder="Enter manufacturer" value={equipment.manufacturer} onChange={handleChange} />
          </FormField>
          <FormField label="Location">
            <input className="form-control" name="location" placeholder="e.g. Room 101, Radiology" value={equipment.location} onChange={handleChange} />
          </FormField>
          <FormField label="Last Service Date">
            <input className="form-control" type="date" name="lastService" value={equipment.lastService} onChange={handleChange} />
          </FormField>
          <FormField label="Next Service Date">
            <input className="form-control" type="date" name="nextService" value={equipment.nextService} onChange={handleChange} />
          </FormField>
          <FormField label="Status">
            <select className="form-control" name="status" value={equipment.status} onChange={handleChange}>
              <option>Active</option>
              <option>Under Maintenance</option>
              <option>Inactive</option>
            </select>
          </FormField>
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Equipment" : "Add Equipment"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Equipment;
