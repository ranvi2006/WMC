import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./TeacherInterviews.css";

const TeacherInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const navigate = useNavigate();

  // Fetch interviews
  const fetchInterviews = async () => {
    try {
      const res = await api.get("/api/interviews/teacher");
      setInterviews(res.data.interviews);

      const links = {};
      res.data.interviews.forEach((i) => {
        links[i._id] = i.meetingLink || "";
      });
      setMeetingLinks(links);
    } catch (err) {
      alert("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/interviews/${id}/status`, { status });
      setInterviews((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  // Cancel interview
  const cancelInterview = async (id) => {
    if (!window.confirm("Cancel this interview?")) return;

    try {
      await api.patch(`/api/interviews/${id}/status`, {
        status: "cancelled",
      });
      setInterviews((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, status: "cancelled" } : i
        )
      );
    } catch (err) {
      alert("Cancel failed");
    }
  };

  // Save / update meeting link
  const saveMeetingLink = async (id) => {
    try {
      setSavingId(id);
      await api.patch(`/api/interviews/${id}/addlink`, {
        meetingLink: meetingLinks[id],
      });

      setInterviews((prev) =>
        prev.map((i) =>
          i._id === id
            ? { ...i, meetingLink: meetingLinks[id] }
            : i
        )
      );
    } catch (err) {
      alert("Failed to save meeting link");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="loading">Loading interviews...</p>;

  return (
    <div className="teacher-interviews">
      <h2>Teacher Interviews</h2>

      <button
        className="create-slot-btn"
        onClick={() => navigate("/teacher/availability")}
      >
        ➕ Create Slots
      </button>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Meeting Link</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {interviews.map((interview) => (
              <tr key={interview._id}>
                <td>{interview.studentId?.name}</td>
                <td>{interview.studentId?.email}</td>
                <td>{interview.date}</td>
                <td>{interview.startTime}</td>

                {/* Status */}
                <td>
                  {interview.status === "pending" && (
                    <select
                      onChange={(e) =>
                        updateStatus(interview._id, e.target.value)
                      }
                    >
                      <option>Pending</option>
                      <option value="confirmed">Confirm</option>
                    </select>
                  )}

                  {interview.status === "confirmed" && (
                    <select
                      onChange={(e) =>
                        updateStatus(interview._id, e.target.value)
                      }
                    >
                      <option>Confirmed</option>
                      <option value="completed">Complete</option>
                    </select>
                  )}

                  {["completed", "cancelled"].includes(interview.status) && (
                    <span className={`status ${interview.status}`}>
                      {interview.status}
                    </span>
                  )}
                </td>

                {/* Meeting Link */}
                <td>
                  {interview.status === "confirmed" && (
                    <>
                      <input
                        type="text"
                        placeholder="Paste Zoom / Meet link"
                        value={meetingLinks[interview._id] || ""}
                        onChange={(e) =>
                          setMeetingLinks((prev) => ({
                            ...prev,
                            [interview._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="save-link-btn"
                        disabled={savingId === interview._id}
                        onClick={() => saveMeetingLink(interview._id)}
                      >
                        {savingId === interview._id
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </>
                  )}

                  {interview.meetingLink &&
                    interview.status !== "confirmed" && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="meeting-link"
                      >
                        Open Meeting
                      </a>
                    )}
                </td>

                {/* Actions */}
                <td>
                  {!["completed", "cancelled"].includes(
                    interview.status
                  ) && (
                    <button
                      className="cancel-btn"
                      onClick={() =>
                        cancelInterview(interview._id)
                      }
                    >
                      Cancel
                    </button>
                  )}

                  {interview.status === "completed" && (
                    <button
                      className="feedback-btn"
                      onClick={() =>
                        navigate(
                          `/teacher/feedback/${interview._id}`
                        )
                      }
                    >
                      Give Feedback
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherInterviews;
