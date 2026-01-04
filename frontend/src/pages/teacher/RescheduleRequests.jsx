import { useEffect, useState } from "react";
import api from "../../services/api";
import "./RescheduleRequests.css";

export default function RescheduleRequests() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  /* =========================
     FETCH REQUESTS
  ========================= */
  useEffect(() => {
    api.get("/api/reschedule/teacher").then((res) => {
      setRequests(res.data.requests);
    });
  }, []);

  /* =========================
     APPROVE HANDLER
  ========================= */
  const approve = async (request) => {
    try {
      const hasDateTime =
        !!request.requestedDate && !!request.requestedStartTime;

      // ✅ Student already selected date/time → direct approve
      if (hasDateTime) {
        setLoadingId(request._id);

        await api.post(`/api/reschedule/${request._id}/approve`);

        setRequests((prev) =>
          prev.filter((r) => r._id !== request._id)
        );
        return;
      }

      // ⏳ Teacher must select date/time
      setActiveRequest(request);
      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     CONFIRM APPROVE (WITH DATE/TIME)
  ========================= */
  const confirmApprove = async () => {
    if (!activeRequest) return;

    try {
      if (!date || !time) {
        alert("Please select date and time");
        return;
      }

      setLoadingId(activeRequest._id);

      await api.post(`/api/reschedule/${activeRequest._id}/approve`, {
        date,
        time,
      });

      setRequests((prev) =>
        prev.filter((r) => r._id !== activeRequest._id)
      );

      setActiveRequest(null);
      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setLoadingId(null);
    }
  };

  /* =========================
     REJECT
  ========================= */
  const reject = async (id) => {
    try {
      setLoadingId(id);
      await api.post(`/api/reschedule/${id}/reject`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Reject failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="reschedule-requests-page">
      <div className="page-header">
        <h2>Reschedule Requests</h2>
        <span className="count-badge">{requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <p className="empty-text">No pending reschedule requests</p>
      ) : (
        <div className="requests-list">
          {requests.map((r) => (
            <div className="request-card" key={r._id}>
              <div className="request-info">
                <h4>{r.studentId?.name}</h4>
                <p className="email">{r.studentId?.email}</p>

                <p>
                  <strong>Date:</strong>{" "}
                  {r.requestedDate || "Teacher will decide"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {r.requestedStartTime || "Teacher will decide"}
                </p>
              </div>

              <div className="actions">
                <button
                  className="approve-btn"
                  disabled={loadingId === r._id}
                  onClick={() => approve(r)}
                >
                  {loadingId === r._id ? "Approving..." : "Approve"}
                </button>

                <button
                  className="reject-btn"
                  disabled={loadingId === r._id}
                  onClick={() => reject(r._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          DATE & TIME MODAL
      ========================= */}
      {activeRequest && (
        <div className="approve-modal">
          <div className="modal-content">
            <h3>Select Date & Time</h3>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="time"
              min="09:00"
              max="20:30"
              step="1800"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="approve-btn"
                disabled={loadingId === activeRequest._id}
                onClick={confirmApprove}
              >
                Confirm & Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => setActiveRequest(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
