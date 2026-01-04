import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminInterviews.css";

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/interviews/admin");
      setInterviews(res.data.interviews || []);
    } catch (err) {
      console.error("Failed to fetch interviews", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelInterview = async (id) => {
    if (!window.confirm("Cancel this interview?")) return;

    await api.patch(`/api/interviews/${id}/admin-cancel`);

    setInterviews((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, status: "cancelled" } : i
      )
    );

    if (selectedInterview?._id === id) {
      setSelectedInterview({
        ...selectedInterview,
        status: "cancelled",
      });
    }
  };

  const filtered = interviews.filter(
    (i) => filter === "all" || i.status === filter
  );

  /* =======================
     DETAILS VIEW
  ======================= */
  if (selectedInterview) {
    const i = selectedInterview;

    return (
      <div className="admin-interviews-page">
        <button className="back-btn" onClick={() => setSelectedInterview(null)}>
          ← Back to list
        </button>

        <h2>Interview Details</h2>

        <div className="details-card">
          <p><strong>Status:</strong> {i.status}</p>
          <p><strong>Date:</strong> {i.date}</p>
          <p><strong>Time:</strong> {i.startTime}</p>

          <hr />

          <h3>Student</h3>
          <p>{i.studentId?.name}</p>
          <p>{i.studentId?.email}</p>

          <h3>Teacher</h3>
          <p>{i.teacherId?.name}</p>
          <p>{i.teacherId?.email}</p>

          <hr />

          <p>
            <strong>Meeting Link:</strong>{" "}
            {i.meetingLink ? (
              <a href={i.meetingLink} target="_blank" rel="noreferrer">
                Open meeting
              </a>
            ) : (
              "Not added"
            )}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {i.paymentId ? "Paid" : "Unpaid"}
          </p>

          {i.status !== "cancelled" && (
            <button
              className="cancel-btn"
              onClick={() => cancelInterview(i._id)}
            >
              Cancel Interview
            </button>
          )}
        </div>
      </div>
    );
  }

  /* =======================
     LIST VIEW
  ======================= */
  return (
    <div className="admin-interviews-page">
      <h2>All Interviews</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Teacher</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((i) => (
              <tr key={i._id}>
                <td>{i.studentId?.name}</td>
                <td>{i.teacherId?.name}</td>
                <td>{i.date}</td>
                <td>{i.startTime}</td>
                <td>{i.status}</td>
                <td>{i.paymentId ? "Paid" : "Unpaid"}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedInterview(i)}
                  >
                    View
                  </button>

                  {i.status !== "cancelled" && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelInterview(i._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
