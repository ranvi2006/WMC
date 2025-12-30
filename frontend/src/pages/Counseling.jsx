import { useState } from "react";
import axios from "axios";
import "./css/Counseling.css";

const Counseling = () => {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!topic || !date || !timeSlot) {
      return setError("Please fill all required fields");
    }

    try {
      setLoading(true);

      await axios.post(
        `${apiUrl}/api/counseling/book`,
        { topic, message, date, timeSlot },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Counseling session booked successfully!");
      setTopic("");
      setMessage("");
      setDate("");
      setTimeSlot("");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="counseling-page">
      <div className="counseling-card">
        <h2>Book Counseling Session</h2>
        <p className="muted">
          Get one-on-one guidance from experienced counselors to improve your
          career and interview skills.
        </p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Topic (e.g. Career Guidance)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <textarea
            className="input textarea"
            placeholder="Describe your concern (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="row">
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select
              className="input"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              <option value="">Select Time Slot</option>
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>02:00 PM - 03:00 PM</option>
              <option>04:00 PM - 05:00 PM</option>
            </select>
          </div>

          <button className="btn" disabled={loading}>
            {loading ? "Booking..." : "Book Session"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Counseling;
