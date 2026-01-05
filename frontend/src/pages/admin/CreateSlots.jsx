import { useEffect, useState } from "react";
import api from "../../services/api";
import "./CreateSlots.css";

const CreateSlots = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/api/admin/teachers");

        setTeachers(res.data.teachers || []);
        setSelectedTeachers(
          res.data.teachers?.map(t => t._id) || []
        );
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };

    fetchTeachers();
  }, []);

  const toggleTeacher = (id) => {
    setSelectedTeachers(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const handleCreateSlots = async () => {
    if (!date) return alert("Select a date");

    const day = new Date(date).getDay();
    if (day === 0) return alert("Sunday is not allowed");

    if (selectedTeachers.length === 0) {
      return alert("Select at least one teacher");
    }

    try {
      setLoading(true);
      await api.post("/api/availability/admin-create", {
        teacherIds: selectedTeachers,
        date,
      });
      alert("Slots created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Interview Slots</h2>

      <h4>Select Teachers</h4>
      {teachers.length === 0 ? (
        <p>No teachers found</p>
      ) : (
        teachers.map(t => (
          <div key={t._id}>
            <input
              type="checkbox"
              checked={selectedTeachers.includes(t._id)}
              onChange={() => toggleTeacher(t._id)}
            />
            <span style={{ marginLeft: 8 }}>{t.name}</span>
          </div>
        ))
      )}

      <h4 style={{ marginTop: 20 }}>Select Date</h4>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreateSlots} disabled={loading}>
        {loading ? "Creating..." : "Create Slots"}
      </button>
    </div>
  );
};

export default CreateSlots;
