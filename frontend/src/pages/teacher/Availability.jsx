import { useState } from "react";
import api from "../../services/api";
import "./Availability.css";

const SLOT_DURATION_MINUTES = 30;

const Availability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Add single 30-min slot
  const addSlot = () => {
    if (!date || !startTime) {
      alert("Please select date and start time");
      return;
    }

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);

    // ❌ Max allowed end time = 20:00
    const maxEnd = new Date(`${date}T20:00:00`);
    if (end > maxEnd) {
      alert("Slot cannot end after 8:00 PM");
      return;
    }

    const newSlot = {
      startTime: start.toTimeString().slice(0, 5),
      endTime: end.toTimeString().slice(0, 5),
      isBooked: false,
    };

    // ❌ Prevent duplicate slots
    const exists = slots.some(
      (s) => s.startTime === newSlot.startTime
    );
    if (exists) {
      alert("This slot already exists");
      return;
    }

    setSlots([...slots, newSlot]);
  };

  // 🔹 Remove slot
  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  // 🔹 Save availability
  const saveAvailability = async () => {
    if (!date || slots.length === 0) {
      alert("Please add at least one slot");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/availability", {
        date,
        slots,
      });

      alert("Availability saved successfully");
      setDate("");
      setSlots([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="availability-page">
      <h2>Create Availability</h2>

      {/* DATE */}
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* START TIME */}
      <div className="form-group">
        <label>Start Time (30 min slot)</label>
        <input
          type="time"
          min="09:00"
          max="19:30"
          step="1800"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <button className="add-btn" onClick={addSlot}>
        + Add Slot
      </button>

      {/* PREVIEW */}
      {slots.length > 0 && (
        <>
          <h3>Selected Slots</h3>
          <div className="slots-preview">
            {slots.map((slot, index) => (
              <div className="slot-chip" key={index}>
                {slot.startTime} – {slot.endTime}
                <button
                  className="remove-chip"
                  onClick={() => removeSlot(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            className="submit-btn"
            onClick={saveAvailability}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Availability"}
          </button>
        </>
      )}
    </div>
  );
};

export default Availability;
