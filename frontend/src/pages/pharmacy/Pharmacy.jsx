import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialMedicine = {
  name: "",
  category: "",
  stock: "",
  price: "",
  expiry: "",
  supplier: "",
};

function Pharmacy() {
  const [medicine, setMedicine] = useState(initialMedicine);
  const [medicines, setMedicines] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/medicines");
      setMedicines(data || []);
    } catch (err) {
      alert(err.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setMedicine({ ...medicine, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setMedicine(initialMedicine);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setMedicine(initialMedicine);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveMedicine = async (e) => {
    e.preventDefault();
    if (!medicine.name || !medicine.stock || !medicine.price) {
      alert("Name, Stock, and Price are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/medicines/${editId}`, medicine);
      } else {
        await apiPost("/medicines", medicine);
      }
      await fetchMedicines();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save medicine");
    }
  };

  const editMedicine = (id) => {
    const selected = medicines.find((item) => item._id === id);
    setMedicine(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteMedicine = async (id) => {
    try {
      await apiDelete(`/medicines/${id}`);
      await fetchMedicines();
    } catch (err) {
      alert(err.message || "Failed to delete medicine");
    }
  };

  const filteredMedicines = medicines.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = medicines.filter((m) => Number(m.stock) <= 10).length;
  const totalValue = medicines.reduce((sum, m) => sum + Number(m.stock || 0) * Number(m.price || 0), 0);

  const columns = [
    { key: "name", header: "Medicine", render: (item) => <strong className="record-name">{item.name || "-"}</strong> },
    { key: "category", header: "Category", render: (item) => <span className="soft-pill">{item.category || "General"}</span> },
    { key: "stock", header: "Stock", render: (item) => <span className={Number(item.stock) <= 10 ? "badge bg-warning" : "badge bg-success"}>{item.stock}</span> },
    { key: "price", header: "Price", render: (item) => <strong>Rs. {item.price || 0}</strong> },
    { key: "expiry", header: "Expiry", render: (item) => item.expiry || "-" },
    { key: "supplier", header: "Supplier", render: (item) => item.supplier || "-" },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editMedicine(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteMedicine(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="pharmacy-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pharmacy & Medicines</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Medicines: {medicines.length}</span>
            <span className="summary-pill">Low Stock: {lowStock}</span>
            <span className="summary-pill">Inventory Value: Rs. {totalValue.toLocaleString()}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      <DataTable
        title="Medicine Inventory"
        search={search}
        searchPlaceholder="Search medicines..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredMedicines}
        getRowKey={(row) => row._id}
        emptyMessage="No medicines found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Medicine" : "Add Medicine"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveMedicine}>
          <input className="form-control" name="name" placeholder="Medicine Name" value={medicine.name} onChange={handleChange} />
          <input className="form-control" name="category" placeholder="Category (e.g. Tablet, Syrup)" value={medicine.category} onChange={handleChange} />
          <input className="form-control" type="number" name="stock" placeholder="Stock Quantity" value={medicine.stock} onChange={handleChange} />
          <input className="form-control" type="number" name="price" placeholder="Unit Price (Rs.)" value={medicine.price} onChange={handleChange} />
          <input className="form-control" type="date" name="expiry" placeholder="Expiry Date" value={medicine.expiry} onChange={handleChange} />
          <input className="form-control" name="supplier" placeholder="Supplier Name" value={medicine.supplier} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Medicine" : "Add Medicine"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Pharmacy;
