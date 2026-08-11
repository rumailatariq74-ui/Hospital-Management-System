import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialTest = {
  patient: "",
  testName: "",
  doctor: "",
  date: "",
  result: "Pending",
  notes: "",
};

function Laboratory() {
  const [test, setTest] = useState(initialTest);
  const [tests, setTests] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/lab-tests");
      setTests(data || []);
    } catch (err) {
      alert(err.message || "Failed to load lab tests");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setTest({ ...test, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setTest(initialTest);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTest(initialTest);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveTest = async (e) => {
    e.preventDefault();
    if (!test.patient || !test.testName) {
      alert("Patient and Test Name are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/lab-tests/${editId}`, test);
      } else {
        await apiPost("/lab-tests", test);
      }
      await fetchTests();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save lab test");
    }
  };

  const editTest = (id) => {
    const selected = tests.find((item) => item._id === id);
    setTest(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteTest = async (id) => {
    try {
      await apiDelete(`/lab-tests/${id}`);
      await fetchTests();
    } catch (err) {
      alert(err.message || "Failed to delete lab test");
    }
  };

  const filteredTests = tests.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase()) ||
    item.testName.toLowerCase().includes(search.toLowerCase())
  );

  const pending = tests.filter((t) => t.result === "Pending").length;
  const completed = tests.filter((t) => t.result === "Completed").length;

  const columns = [
    { key: "patient", header: "Patient", render: (item) => <strong className="record-name">{item.patient || "-"}</strong> },
    { key: "testName", header: "Test", render: (item) => <span className="soft-pill">{item.testName || "-"}</span> },
    { key: "doctor", header: "Doctor", render: (item) => item.doctor || "-" },
    { key: "date", header: "Date", render: (item) => item.date || "-" },
    { key: "result", header: "Result", render: (item) => <span className={item.result === "Completed" ? "badge bg-success" : "badge bg-warning"}>{item.result}</span> },
    { key: "notes", header: "Notes", render: (item) => item.notes || "-" },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editTest(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteTest(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="lab-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Laboratory & Diagnostics</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Tests: {tests.length}</span>
            <span className="summary-pill">Pending: {pending}</span>
            <span className="summary-pill">Completed: {completed}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Test
        </button>
      </div>

      <DataTable
        title="Lab Test Records"
        search={search}
        searchPlaceholder="Search tests or patients..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredTests}
        getRowKey={(row) => row._id}
        emptyMessage="No lab tests found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Test" : "Add Lab Test"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveTest}>
          <input className="form-control" name="patient" placeholder="Patient Name" value={test.patient} onChange={handleChange} />
          <input className="form-control" name="testName" placeholder="Test Name (e.g. Blood Test, X-Ray)" value={test.testName} onChange={handleChange} />
          <input className="form-control" name="doctor" placeholder="Referring Doctor" value={test.doctor} onChange={handleChange} />
          <input className="form-control" type="date" name="date" value={test.date} onChange={handleChange} />
          <select className="form-control" name="result" value={test.result} onChange={handleChange}>
            <option>Pending</option>
            <option>Completed</option>
            <option>Critical</option>
          </select>
          <input className="form-control" name="notes" placeholder="Notes / Remarks" value={test.notes} onChange={handleChange} />
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Test" : "Add Test"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Laboratory;
