import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialAmbulance = {
  vehicleNo: "",
  driver: "",
  phone: "",
  status: "Available",
  type: "Basic",
  lastService: "",
};

function Ambulance() {
  const [ambulance, setAmbulance] = useState(initialAmbulance);
  const [ambulances, setAmbulances] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/ambulances");
      setAmbulances(data || []);
    } catch (err) {
      alert(err.message || "Failed to load ambulances");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setAmbulance({ ...ambulance, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setAmbulance(initialAmbulance);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setAmbulance(initialAmbulance);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveAmbulance = async (e) => {
    e.preventDefault();
    if (!ambulance.vehicleNo || !ambulance.driver) {
      alert("Vehicle number and driver are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/ambulances/${editId}`, ambulance);
      } else {
        await apiPost("/ambulances", ambulance);
      }
      await fetchAmbulances();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save ambulance");
    }
  };

  const editAmbulance = (id) => {
    const selected = ambulances.find((item) => item._id === id);
    setAmbulance(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteAmbulance = async (id) => {
    try {
      await apiDelete(`/ambulances/${id}`);
      await fetchAmbulances();
    } catch (err) {
      alert(err.message || "Failed to delete ambulance");
    }
  };

  const filteredAmbulances = ambulances.filter((item) =>
    item.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
    item.driver.toLowerCase().includes(search.toLowerCase())
  );

  const available = ambulances.filter((a) => a.status === "Available").length;
  const onDuty = ambulances.filter((a) => a.status === "On Duty").length;

  const columns = [
    { key: "vehicleNo", header: "Vehicle No", render: (item) => <strong className="record-name">{item.vehicleNo || "-"}</strong> },
    { key: "driver", header: "Driver", render: (item) => item.driver || "-" },
    { key: "phone", header: "Phone", render: (item) => item.phone || "-" },
    { key: "type", header: "Type", render: (item) => <span className="soft-pill">{item.type || "Basic"}</span> },
    { key: "status", header: "Status", render: (item) => <span className={item.status === "Available" ? "badge bg-success" : item.status === "On Duty" ? "badge bg-warning" : "badge bg-warning"}>{item.status}</span> },
    { key: "lastService", header: "Last Service", render: (item) => item.lastService || "-" },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editAmbulance(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteAmbulance(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="ambulance-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ambulance Services</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Ambulances: {ambulances.length}</span>
            <span className="summary-pill">Available: {available}</span>
            <span className="summary-pill">On Duty: {onDuty}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Ambulance
        </button>
      </div>

      <DataTable
        title="Ambulance Fleet"
        search={search}
        searchPlaceholder="Search vehicle or driver..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredAmbulances}
        getRowKey={(row) => row._id}
        emptyMessage="No ambulances found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Ambulance" : "Add Ambulance"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveAmbulance}>
          <input className="form-control" name="vehicleNo" placeholder="Vehicle Number" value={ambulance.vehicleNo} onChange={handleChange} />
          <input className="form-control" name="driver" placeholder="Driver Name" value={ambulance.driver} onChange={handleChange} />
          <input className="form-control" name="phone" placeholder="Driver Phone" value={ambulance.phone} onChange={handleChange} />
          <select className="form-control" name="type" value={ambulance.type} onChange={handleChange}>
            <option>Basic</option>
            <option>Advanced Life Support</option>
            <option>Mortuary</option>
          </select>
          <select className="form-control" name="status" value={ambulance.status} onChange={handleChange}>
            <option>Available</option>
            <option>On Duty</option>
            <option>Maintenance</option>
          </select>
          <input className="form-control" type="date" name="lastService" placeholder="Last Service Date" value={ambulance.lastService} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Ambulance" : "Add Ambulance"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Ambulance;
