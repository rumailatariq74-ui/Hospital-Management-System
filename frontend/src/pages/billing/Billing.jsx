import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import SearchableDropdown from "../../components/SearchableDropdown";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import { toast } from "react-toastify";
import { decimalInputProps, decimalOnly } from "../../utils/inputValidation";

const initialBill = {
  patient: "",
  doctor: "",
  treatment: "",
  amount: "",
  paymentMethod: "",
  status: "Pending",
  date: "",
};

function Billing() {
  const [bill, setBill] = useState(initialBill);
  const [bills, setBills] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchBills();
    fetchFormOptions();
  }, []);

  const fetchFormOptions = async () => {
    try {
      const [patientData, doctorData] = await Promise.all([apiGet("/patients"), apiGet("/doctors")]);
      setPatients(patientData || []);
      setDoctors(doctorData || []);
    } catch (err) {
      toast.error(err.message || "Failed to load patient and doctor options");
    }
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/bills");
      setBills(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const value = event.target.name === "amount"
      ? decimalOnly(event.target.value)
      : event.target.value;

    setBill({
      ...bill,
      [event.target.name]: value,
    });
  };

  const openAddModal = () => {
    setBill(initialBill);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setBill(initialBill);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveBill = async (event) => {
    event.preventDefault();

    if (!bill.patient || !bill.amount) {
      toast.warning("Patient and Amount required");
      return;
    }

    try {
      if (editId) {
        await apiPut(`/bills/${editId}`, bill);
      } else {
        await apiPost("/bills", bill);
      }
      await fetchBills();
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to save bill");
    }
  };

  const editBill = (id) => {
    const selected = bills.find((item) => item._id === id);
    setBill(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteBill = async (id) => {
    try {
      await apiDelete(`/bills/${id}`);
      await fetchBills();
    } catch (err) {
      toast.error(err.message || "Failed to delete bill");
    }
  };

  const filteredBills = bills.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase())
  );

  const revenue = bills.reduce((sum, item) => sum + Number(item.amount), 0);
  const patientOptions = patients.map((patient) => patient.name).filter(Boolean);
  const doctorOptions = doctors.map((doctor) => doctor.name).filter(Boolean);

  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: (item) => <strong className="record-name">{item.patient || "-"}</strong>,
    },
    {
      key: "doctor",
      header: "Doctor",
      render: (item) => item.doctor || "-",
    },
    {
      key: "treatment",
      header: "Treatment",
      render: (item) => <span className="soft-pill">{item.treatment || "General"}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => <strong>Rs. {item.amount || 0}</strong>,
    },
    {
      key: "paymentMethod",
      header: "Method",
      render: (item) => item.paymentMethod || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className={item.status === "Paid" ? "badge bg-success" : "badge bg-warning"}>
          {item.status}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (item) => item.date || "-",
    },
    {
      key: "actions",
      header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit bill for ${item.patient || "patient"}`}
            title="Edit"
            onClick={() => editBill(item._id)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete bill for ${item.patient || "patient"}`}
            title="Delete"
            onClick={() => deleteBill(item._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="billing-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing Management</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Bills: {bills.length}</span>
            <span className="summary-pill">Total Revenue: Rs. {revenue}</span>
          </div>
        </div>

        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} />
          Add Bill
        </button>
      </div>

      <DataTable
        title="Billing Records"
        search={search}
        searchPlaceholder="Search bills..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredBills}
        getRowKey={(row) => row._id}
        emptyMessage="No bills found"
      />

      <Modal
        isOpen={isModalOpen}
        title={editId ? "Update Bill" : "Add Bill"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={saveBill}>
          <SearchableDropdown label="Patient" value={bill.patient} options={patientOptions} placeholder="Select patient" onChange={(value) => setBill({ ...bill, patient: value })} />
          <SearchableDropdown label="Doctor" value={bill.doctor} options={doctorOptions} placeholder="Select doctor" onChange={(value) => setBill({ ...bill, doctor: value })} />
          <FormField label="Treatment">
            <input className="form-control" name="treatment" placeholder="Enter treatment" value={bill.treatment} onChange={handleChange} />
          </FormField>
          <FormField label="Amount">
            <input className="form-control" name="amount" placeholder="Enter amount" value={bill.amount} onChange={handleChange} {...decimalInputProps} />
          </FormField>
          <FormField label="Payment Method">
            <select className="form-control" name="paymentMethod" value={bill.paymentMethod} onChange={handleChange}>
              <option value="">Select payment method</option>
              <option>Cash</option>
              <option>Card</option>
              <option>Online</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select className="form-control" name="status" value={bill.status} onChange={handleChange}>
              <option>Pending</option>
              <option>Paid</option>
            </select>
          </FormField>
          <FormField label="Date">
            <input className="form-control" type="date" name="date" value={bill.date} onChange={handleChange} />
          </FormField>

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editId ? "Update Bill" : "Add Bill"}
          </button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Billing;
