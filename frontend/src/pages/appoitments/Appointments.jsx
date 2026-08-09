import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, LayoutList, CalendarDays } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import CalendarView from "../../components/CalendarView";

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
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem("appointments"));

    if (savedAppointments) {
      setAppointments(savedAppointments);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleChange = (event) => {
    setAppointment({
      ...appointment,
      [event.target.name]: event.target.value,
    });
  };

  const openAddModal = () => {
    setAppointment(initialAppointment);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setAppointment(initialAppointment);
    setEditIndex(null);
    setIsModalOpen(false);
  };

  const saveAppointment = (event) => {
    event.preventDefault();

    if (editIndex !== null) {
      const updatedAppointments = [...appointments];
      updatedAppointments[editIndex] = appointment;
      setAppointments(updatedAppointments);
    } else {
      setAppointments([...appointments, appointment]);
    }

    closeModal();
  };

  const editAppointment = (index) => {
    setAppointment(appointments[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const deleteAppointment = (index) => {
    setAppointments(appointments.filter((_, itemIndex) => itemIndex !== index));
  };

  const filteredAppointments = appointments
    .map((item, index) => ({ item, originalIndex: index }))
    .filter(({ item }) => item.patient.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      key: "patient",
      header: "Patient",
      render: ({ item }) => <strong className="record-name">{item.patient || "-"}</strong>,
    },
    {
      key: "doctor",
      header: "Doctor",
      render: ({ item }) => item.doctor || "-",
    },
    {
      key: "date",
      header: "Date",
      render: ({ item }) => item.date || "-",
    },
    {
      key: "time",
      header: "Time",
      render: ({ item }) => item.time || "-",
    },
    {
      key: "status",
      header: "Status",
      render: ({ item }) => {
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
      render: ({ item, originalIndex }) => (
        <div className="action-buttons">
          <button
            className="icon-action-btn edit-action"
            type="button"
            aria-label={`Edit ${item.patient || "appointment"}`}
            title="Edit"
            onClick={() => editAppointment(originalIndex)}
          >
            <Pencil size={16} />
          </button>

          <button
            className="icon-action-btn delete-action"
            type="button"
            aria-label={`Delete ${item.patient || "appointment"}`}
            title="Delete"
            onClick={() => deleteAppointment(originalIndex)}
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
        getRowKey={(row) => row.originalIndex}
        emptyMessage="No appointments found"
      />}

      <Modal
        isOpen={isModalOpen}
        title={editIndex !== null ? "Update Appointment" : "Add Appointment"}
        onClose={closeModal}
      >
        <form className="modal-form" onSubmit={saveAppointment}>
          <input className="form-control" name="patient" placeholder="Patient Name" value={appointment.patient} onChange={handleChange} />
          <input className="form-control" name="doctor" placeholder="Doctor Name" value={appointment.doctor} onChange={handleChange} />
          <input className="form-control" type="date" name="date" value={appointment.date} onChange={handleChange} />
          <input className="form-control" type="time" name="time" value={appointment.time} onChange={handleChange} />
          <select className="form-control" name="status" value={appointment.status} onChange={handleChange}>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
          </select>

          <button className="btn btn-primary modal-submit-btn" type="submit">
            {editIndex !== null ? "Update Appointment" : "Add Appointment"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Appointments;
