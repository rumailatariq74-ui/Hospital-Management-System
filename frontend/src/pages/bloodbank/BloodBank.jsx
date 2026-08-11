import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialDonation = {
  donor: "",
  bloodGroup: "A+",
  units: "",
  date: "",
  contact: "",
  status: "Available",
};

function BloodBank() {
  const [donation, setDonation] = useState(initialDonation);
  const [donations, setDonations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/blood-bank");
      setDonations(data || []);
    } catch (err) {
      alert(err.message || "Failed to load blood bank");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setDonation({ ...donation, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setDonation(initialDonation);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDonation(initialDonation);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveDonation = async (e) => {
    e.preventDefault();
    if (!donation.donor || !donation.units) {
      alert("Donor name and units are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/blood-bank/${editId}`, donation);
      } else {
        await apiPost("/blood-bank", donation);
      }
      await fetchDonations();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save donation");
    }
  };

  const editDonation = (id) => {
    const selected = donations.find((item) => item._id === id);
    setDonation(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteDonation = async (id) => {
    try {
      await apiDelete(`/blood-bank/${id}`);
      await fetchDonations();
    } catch (err) {
      alert(err.message || "Failed to delete donation");
    }
  };

  const filteredDonations = donations.filter((item) =>
    item.donor.toLowerCase().includes(search.toLowerCase()) ||
    item.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnits = donations.reduce((sum, d) => sum + Number(d.units || 0), 0);
  const availableUnits = donations.filter((d) => d.status === "Available").reduce((sum, d) => sum + Number(d.units || 0), 0);

  const columns = [
    { key: "donor", header: "Donor", render: (item) => <strong className="record-name">{item.donor || "-"}</strong> },
    { key: "bloodGroup", header: "Blood Group", render: (item) => <span className="soft-pill">{item.bloodGroup}</span> },
    { key: "units", header: "Units", render: (item) => item.units || "-" },
    { key: "date", header: "Date", render: (item) => item.date || "-" },
    { key: "contact", header: "Contact", render: (item) => item.contact || "-" },
    { key: "status", header: "Status", render: (item) => <span className={item.status === "Available" ? "badge bg-success" : "badge bg-warning"}>{item.status}</span> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editDonation(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteDonation(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="bloodbank-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Blood Bank</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Donations: {donations.length}</span>
            <span className="summary-pill">Total Units: {totalUnits}</span>
            <span className="summary-pill">Available: {availableUnits}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Donation
        </button>
      </div>

      <DataTable
        title="Blood Donations"
        search={search}
        searchPlaceholder="Search donor or blood group..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredDonations}
        getRowKey={(row) => row._id}
        emptyMessage="No donations found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Donation" : "Add Donation"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveDonation}>
          <input className="form-control" name="donor" placeholder="Donor Name" value={donation.donor} onChange={handleChange} />
          <select className="form-control" name="bloodGroup" value={donation.bloodGroup} onChange={handleChange}>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
            <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
          </select>
          <input className="form-control" type="number" name="units" placeholder="Units (ml)" value={donation.units} onChange={handleChange} />
          <input className="form-control" type="date" name="date" value={donation.date} onChange={handleChange} />
          <input className="form-control" name="contact" placeholder="Contact Number" value={donation.contact} onChange={handleChange} />
          <select className="form-control" name="status" value={donation.status} onChange={handleChange}>
            <option>Available</option>
            <option>Used</option>
            <option>Expired</option>
          </select>
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Donation" : "Add Donation"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default BloodBank;
