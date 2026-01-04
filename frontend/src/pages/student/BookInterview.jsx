import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./BookInterview.css";

const BookInterview = () => {
  const navigate = useNavigate();

  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // 🔹 Fetch all availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get("/api/availability");
        setAvailability(res.data.availability || []);
      } catch (err) {
        alert("Failed to load availability");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // 🔹 Unique sorted dates
  const availableDates = useMemo(() => {
    const dates = availability.map((a) => a.date);
    return [...new Set(dates)].sort();
  }, [availability]);

  // 🔹 Auto-select nearest date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // 🔹 Slots for selected date (BOOKED + FREE)
  const slotsForDate = useMemo(() => {
    return availability
      .filter((a) => a.date === selectedDate)
      .flatMap((a) =>
        a.slots.map((slot) => ({
          ...slot,
          teacherId: a.teacherId._id,
          teacherName: a.teacherId.name,
        }))
      );
  }, [availability, selectedDate]);

  // 🔹 Book interview
  const handleBook = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    try {
      setBooking(true);
      const paymentId = "6958d2baaeb92aa0cb06634b";

      await api.post("/api/interviews/book", {
        teacherId: selectedSlot.teacherId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        duration: 30,
        paymentId,
      });

      alert("Interview booked successfully");
      navigate("/student/interviews");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (pageLoading) {
    return <p className="loading">Loading availability...</p>;
  }

  return (
    <div className="book-interview-page">
      <h2>Book an Interview</h2>

      {/* DATE SELECTOR */}
      <div className="date-selector">
        {availableDates.map((date) => (
          <button
            key={date}
            className={`date-btn ${
              date === selectedDate ? "active" : ""
            }`}
            onClick={() => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
          >
            {date}
          </button>
        ))}
      </div>

      {/* SLOTS */}
      <div className="slots-section">
        <h3>Available Slots</h3>

        {slotsForDate.length === 0 ? (
          <p className="empty">No slots available</p>
        ) : (
          <div className="slots-grid">
            {slotsForDate.map((slot) => {
              const isBooked = slot.isBooked;
              const isSelected = selectedSlot?._id === slot._id;

              return (
                <div
                  key={slot._id}
                  className={`slot-card 
                    ${isBooked ? "booked" : ""}
                    ${isSelected ? "selected" : ""}
                  `}
                  onClick={() => {
                    if (!isBooked) setSelectedSlot(slot);
                  }}
                >
                  <p className="time">
                    {slot.startTime} – {slot.endTime}
                  </p>

                  <p className="teacher">
                    {slot.teacherName}
                  </p>

                  {isBooked && (
                    <span className="booked-label">
                      Booked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOOK BUTTON */}
      <div className="book-footer">
        <button
          className="book-btn"
          onClick={handleBook}
          disabled={!selectedSlot || booking}
        >
          {booking ? "Booking..." : "Book Interview"}
        </button>
      </div>
    </div>
  );
};

export default BookInterview;
