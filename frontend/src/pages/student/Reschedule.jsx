import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Reschedule.css";

export default function Reschedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  /* =========================
     FETCH INTERVIEW
  ========================= */
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/api/interviews/${id}`);
        setInterview(res.data.interview);
      } catch (err) {
        alert("Failed to load interview");
        navigate("/student/interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  if (loading) {
    return <p className="loading">Loading interview details...</p>;
  }

  if (!interview) return null;

  const {
    teacherId,
    date: oldDate,
    startTime,
    duration,
    status,
    cancelledBy,
    rescheduleCount,
  } = interview;
  console.log("Interview details:", interview);

  /* =========================
     BUSINESS RULE FLAGS
  ========================= */
  const isCancelledByStudent = cancelledBy === "student";
  const isCancelledByTeacher = cancelledBy === "teacher";
  const isCancelledByAdmin = cancelledBy === "admin";

  const canReschedule =
    status === "cancelled" &&
    !isCancelledByAdmin &&
    rescheduleCount < 1;

  const canSelectDateTime = isCancelledByTeacher;

  /* =========================
     BLOCK PAGE CONDITIONS
  ========================= */
  if (!canReschedule) {
    return (
      <div className="reschedule-page">
        <h2>Reschedule Interview</h2>
        <p className="error">
          {isCancelledByAdmin
            ? "This interview was cancelled by admin and cannot be rescheduled."
            : "You have already used your reschedule request."}
        </p>
      </div>
    );
  }

  /* =========================
     SUBMIT REQUEST
  ========================= */
  const submit = async () => {
   
    try {
      const payload = {
        interviewId: id,
        reason,
      };

      if (canSelectDateTime) {
        if (!date || !time) {
          alert("Please select date and time");
          return;
        }

        payload.requestedDate = date;
        payload.requestedStartTime = time;
      } else {
        payload.requestedDate = null;
        payload.requestedStartTime = null;
      }
      await api.post("/api/reschedule", payload);

      alert("Reschedule request sent");
      navigate("/student/interviews");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };


  /* =========================
     UI
  ========================= */
  return (
    <div className="reschedule-page">
      <h2>Reschedule Interview</h2>

      {/* INTERVIEW INFO */}
      <div className="interview-info">
        <p><strong>Teacher:</strong> {teacherId?.name}</p>
        <p><strong>Email:</strong> {teacherId?.email}</p>
        <p><strong>Current Date:</strong> {oldDate}</p>
        <p><strong>Current Time:</strong> {startTime}</p>
        <p><strong>Duration:</strong> {duration} mins</p>

        <p className="status cancelled">
          Cancelled by {cancelledBy}
        </p>
      </div>

      {/* FORM */}
      <div className="form-section">
        <label>New Date</label>
        <input
          type="date"
          value={date}
          disabled={!canSelectDateTime}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>New Start Time</label>
        <input
          type="time"
          step="1800"
          min="09:00"
          max="20:30"
          value={time}
          disabled={!canSelectDateTime}
          onChange={(e) => setTime(e.target.value)}
        />

        {isCancelledByStudent && (
          <p className="info-text">
            Teacher will select the new date and time after accepting your request.
          </p>
        )}

        <label>Reason (optional)</label>
        <textarea
          placeholder="Why do you want to reschedule?"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button onClick={submit}>
          Send Reschedule Request
        </button>
      </div>
    </div>
  );
}
