import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./BookInterview.css";

export default function BookInterview() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ===== DATE SETUP (TODAY DEFAULT) =====
  const today = new Date().toISOString().split("T")[0];

  // ===== STATE =====
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH AVAILABLE SLOTS
     (Today + Future only)
  ========================== */
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        const res = await api.post("/api/availability/getAll", { date });

        const availability = res.data?.availability || [];

        // Flatten teacher-wise availability
        const allSlots = availability.flatMap((item) =>
          item.slots.map((slot) => ({
            ...slot,
            teacherId: item.teacherId,
          }))
        );

        setSlots(allSlots);
      } catch (err) {
        console.error("Slot fetch error:", err);
        setSlots([]);
      }
    };

    fetchSlots();
  }, [date]);

  /* =========================
     BOOK INTERVIEW
  ========================== */
  const handleBook = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    try {
      setLoading(true);

      // TEMP payment id (replace with real payment later)
      const paymentId = "6958d2baaeb92aa0cb06634b";

      await api.post("/api/interviews/book", {
        teacherId: selectedSlot.teacherId,
        date,
        startTime: selectedSlot.startTime,
        duration: 30,
        paymentId,
      });

      alert("Interview booked successfully");
      navigate("/student/interviews");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-interview-page">
      <h2>Book Interview</h2>

      {/* USER DETAILS */}
      <div className="user-info">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      {/* DATE PICKER */}
      <div className="date-picker">
        <label>Select Date</label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null);
          }}
        />
      </div>

      {/* AVAILABLE SLOTS */}
      <div className="slots">
        <h3>Available Slots</h3>

        {slots.length === 0 && <p>No slots available</p>}

        <div className="slot-grid">
          {slots.map((slot) => {
            const isSelected = selectedSlot?._id === slot._id;

            return (
              <button
                key={slot._id}
                className={`slot-btn 
                  ${slot.isBooked ? "booked" : ""} 
                  ${isSelected ? "active" : ""}
                `}
                disabled={slot.isBooked}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.startTime} – {slot.endTime}
              </button>
            );
          })}
        </div>

        {/* SLOT LEGEND */}
        <div className="slot-legend">
          <span><span className="legend-box available" /> Available</span>
          <span><span className="legend-box booked" /> Booked</span>
        </div>
      </div>

      {/* BOOK BUTTON */}
      <button
        className="book-btn"
        onClick={handleBook}
        disabled={loading || !selectedSlot}
      >
        {loading ? "Processing..." : "Book Interview (₹9)"}
      </button>
    </div>
  );
}
