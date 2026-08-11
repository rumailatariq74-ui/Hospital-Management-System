import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { apiGet, apiPost, apiPut, apiDelete } from "../../services/api";

const initialRoom = {
  roomNo: "",
  type: "General",
  beds: "",
  occupied: "",
  floor: "",
  status: "Available",
};

function Rooms() {
  const [room, setRoom] = useState(initialRoom);
  const [rooms, setRooms] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await apiGet("/rooms");
      setRooms(data || []);
    } catch (err) {
      alert(err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setRoom({ ...room, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setRoom(initialRoom);
    setEditId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setRoom(initialRoom);
    setEditId(null);
    setIsModalOpen(false);
  };

  const saveRoom = async (e) => {
    e.preventDefault();
    if (!room.roomNo || !room.beds) {
      alert("Room Number and Beds are required");
      return;
    }
    try {
      if (editId) {
        await apiPut(`/rooms/${editId}`, room);
      } else {
        await apiPost("/rooms", room);
      }
      await fetchRooms();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to save room");
    }
  };

  const editRoom = (id) => {
    const selected = rooms.find((item) => item._id === id);
    setRoom(selected);
    setEditId(id);
    setIsModalOpen(true);
  };

  const deleteRoom = async (id) => {
    try {
      await apiDelete(`/rooms/${id}`);
      await fetchRooms();
    } catch (err) {
      alert(err.message || "Failed to delete room");
    }
  };

  const filteredRooms = rooms.filter((item) =>
    item.roomNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalBeds = rooms.reduce((sum, r) => sum + Number(r.beds || 0), 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + Number(r.occupied || 0), 0);
  const availableBeds = totalBeds - occupiedBeds;

  const columns = [
    { key: "roomNo", header: "Room No", render: (item) => <strong className="record-name">{item.roomNo || "-"}</strong> },
    { key: "type", header: "Type", render: (item) => <span className="soft-pill">{item.type || "General"}</span> },
    { key: "beds", header: "Total Beds", render: (item) => item.beds || "-" },
    { key: "occupied", header: "Occupied", render: (item) => item.occupied || "0" },
    { key: "floor", header: "Floor", render: (item) => item.floor || "-" },
    { key: "status", header: "Status", render: (item) => <span className={item.status === "Available" ? "badge bg-success" : "badge bg-warning"}>{item.status}</span> },
    {
      key: "actions", header: "Action",
      render: (item) => (
        <div className="action-buttons">
          <button className="icon-action-btn edit-action" type="button" aria-label="Edit" title="Edit" onClick={() => editRoom(item._id)}><Pencil size={16} /></button>
          <button className="icon-action-btn delete-action" type="button" aria-label="Delete" title="Delete" onClick={() => deleteRoom(item._id)}><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="rooms-page management-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms & Beds</h1>
          <div className="summary-row">
            <span className="summary-pill">Total Rooms: {rooms.length}</span>
            <span className="summary-pill">Total Beds: {totalBeds}</span>
            <span className="summary-pill">Occupied: {occupiedBeds}</span>
            <span className="summary-pill">Available: {availableBeds}</span>
          </div>
        </div>
        <button className="btn btn-primary add-record-btn" type="button" onClick={openAddModal}>
          <Plus size={18} /> Add Room
        </button>
      </div>

      <DataTable
        title="Room List"
        search={search}
        searchPlaceholder="Search rooms..."
        onSearchChange={setSearch}
        columns={columns}
        data={filteredRooms}
        getRowKey={(row) => row._id}
        emptyMessage="No rooms found"
      />

      <Modal isOpen={isModalOpen} title={editId ? "Update Room" : "Add Room"} onClose={closeModal}>
        <form className="modal-form" onSubmit={saveRoom}>
          <input className="form-control" name="roomNo" placeholder="Room Number" value={room.roomNo} onChange={handleChange} />
          <select className="form-control" name="type" value={room.type} onChange={handleChange}>
            <option>General</option>
            <option>Private</option>
            <option>ICU</option>
            <option>Operation Theater</option>
            <option>Emergency</option>
          </select>
          <input className="form-control" type="number" name="beds" placeholder="Total Beds" value={room.beds} onChange={handleChange} />
          <input className="form-control" type="number" name="occupied" placeholder="Occupied Beds" value={room.occupied} onChange={handleChange} />
          <input className="form-control" name="floor" placeholder="Floor" value={room.floor} onChange={handleChange} />
          <select className="form-control" name="status" value={room.status} onChange={handleChange}>
            <option>Available</option>
            <option>Full</option>
            <option>Maintenance</option>
          </select>
          <button className="btn btn-primary modal-submit-btn" type="submit">{editId ? "Update Room" : "Add Room"}</button>
        </form>
      </Modal>

      {loading && <div className="loading" style={{ textAlign: "center", padding: 12 }}>Loading...</div>}
    </div>
  );
}

export default Rooms;
