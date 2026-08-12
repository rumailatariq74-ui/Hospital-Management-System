import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, LayoutList, CalendarDays } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import CalendarView from "../../components/CalendarView";
import FormField from "../../components/FormField";
import SearchableDropdown from "../../components/SearchableDropdown";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";
import { toast } from "react-toastify";

const initialAppointment = {
  patient: "",
  doctor: "",
  date: "",
  time: "",
  status: "Pending",
};

function Appointments() {
  const [appointment, setAppointment] = useState(initialAppointment);
  const [appointments, setAppointments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAppointments();
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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/appointments");
      setAppointments(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setAppointment({
      ...appointment,
      [event.target.name]: event.target.value,
    });
  };

  const openAddModal = () => {
    setAppointment(initialAppointment);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setAppointment(initialAppointment);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveAppointment = async (event) => {
    event.preventDefault();

    try {
      if (editId) {
        await apiPut(`/appointments/${editId}`, appointment);
      } else {
        await apiPost("/appointments", appointment);
      }
      await fetchAppointments();
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to save appointment");
    }
  };

  const editAppointment = (id) => {
    const selected = appointments.find((item) => item._id === id);
    setAppointment(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteAppointment = async (id) => {
    try {
      await apiDelete(`/appointments/${id}`);
      await fetchAppointments();
    } catch (err) {
      toast.error(err.message || "Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter((item) =>
    item.patient.toLowerCase().includes(search.toLowerCase())
  );
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
      key: "date",
      header: "Date",
      render: (item) => item.date || "-",
    },
    {
      key: "time",
      header: "Time",
      render: (item) => item.time || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const statusClass =
          item.status === "Completed" ? "status-completed" :
          item.status === "Confirmed" ? "status-confirmed" :
          "status-pending";
        return <span className={`status ${statusClass}`}>{item.status}</span>;
      },
    },
    {
      key: "actions",
      header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit ${item.patient || "appointment"}`}
            title="Edit"
            onClick={() => editAppointment(item._id)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete ${item.patient || "appointment"}`}
            title="Delete"
            onClick={() => deleteAppointment(item._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="appointment-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Management</h1>
          <h4>Total Appointments: {appointments.length}</h4>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className={`btn ${viewMode === 'list' ? 'btn-primary' : ''}`} type="button" onClick={() => setViewMode('list')} style={viewMode !== 'list' ? { background: 'var(--color-bg)', color: 'var(--color-text)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' } : {}}>
            <LayoutList size={16} /> List
          </button>
          <button className={`btn ${viewMode === 'calendar' ? 'btn-primary' : ''}`} type="button" onClick={() => setViewMode('calendar')} style={viewMode !== 'calendar' ? { background: 'var(--color-bg)', color: 'var(--color-text)', border: '1.5px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' } : {}}>
            <CalendarDays size={16} /> Calendar
          </button>
          <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
            <Plus size={18} /> Add Appointment
          </button>
        </div>
      </div>

      {viewMode === 'calendar' && <CalendarView appointments={appointments} />}

      {viewMode === 'list' && <DataTable
        title="Appointment List"
        search={search}
        searchPlaceholder="Search appointments..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredAppointments}
        getRowKey={(row) => row._id}
        emptyMessage="No appointments found"
      />}

      <Modal
        isOpen={isModalOpen}
        title={editId ? "Update Appointment" : "Add Appointment"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={saveAppointment}>
          <SearchableDropdown label="Patient" value={appointment.patient} options={patientOptions} placeholder="Select patient" onChange={(value) => setAppointment({ ...appointment, patient: value })} />
          <SearchableDropdown label="Doctor" value={appointment.doctor} options={doctorOptions} placeholder="Select doctor" onChange={(value) => setAppointment({ ...appointment, doctor: value })} />
          <FormField label="Date">
            <input className="form-control" type="date" name="date" value={appointment.date} onChange={handleChange} />
          </FormField>
          <FormField label="Time">
            <input className="form-control" type="time" name="time" value={appointment.time} onChange={handleChange} />
          </FormField>
          <FormField label="Status">
            <select className="form-control" name="status" value={appointment.status} onChange={handleChange}>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
            </select>
          </FormField>

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editId ? "Update Appointment" : "Add Appointment"}
          </button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Appointments;
