import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyInterview.css";

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  /* =========================
     CANCEL INTERVIEW
  ========================= */
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

      setActiveTab("cancelled");
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  /* =========================
     FETCH INTERVIEWS
  ========================= */
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/api/interviews/my");
        const data = res.data.interviews || [];
        setInterviews(data);

        if (data.some(i => i.status === "pending")) setActiveTab("pending");
        else if (data.some(i => i.status === "confirmed")) setActiveTab("confirmed");
        else if (data.some(i => i.status === "completed")) setActiveTab("completed");
        else if (data.some(i => i.status === "cancelled")) setActiveTab("cancelled");
        else setActiveTab(null);
      } catch (err) {
        console.error("Failed to load interviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) return <p className="loading">Loading interviews...</p>;

  if (!activeTab) {
    return (
      <div className="my-interviews-page empty-state">
        <h2>You have no interviews yet</h2>
        <p>Book your first interview to get started.</p>
        <button
          className="book-now-btn"
          onClick={() => navigate("/student/book-interview")}
        >
          Book Interview
        </button>
      </div>
    );
  }

  const filteredInterviews = interviews.filter(
    (i) => i.status === activeTab
  );

  return (
    <div className="my-interviews-page">
      <h2>My Interviews</h2>

      {/* 🔹 TABS */}
      <div className="tabs">
        {["pending", "confirmed", "completed", "cancelled"].map((tab) => {
          const hasData = interviews.some(i => i.status === tab);
          if (!hasData) return null;

          return (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* 🔹 LIST */}
      {filteredInterviews.length === 0 ? (
        <p className="empty">No {activeTab} interviews</p>
      ) : (
        <div className="interview-list">
          {filteredInterviews.map((interview) => {
            const {
              _id,
              teacherId,
              date,
              startTime,
              duration,
              status,
              meetingLink,
            } = interview;

            return (
              <div className="interview-card" key={_id}>
                {/* HEADER */}
                <div className="interview-header">
                  <h4>{teacherId?.name}</h4>
                  <span className={`status ${status}`}>
                    {status.toUpperCase()}
                  </span>
                </div>

                <p className="email">{teacherId?.email}</p>

                {/* DETAILS */}
                <div className="details">
                  <p><strong>Date:</strong> {date}</p>
                  <p><strong>Time:</strong> {startTime}</p>
                  <p><strong>Duration:</strong> {duration} mins</p>
                </div>

                {/* ACTIONS */}
                <div className="actions">
                  {status === "completed" && (
                    <button
                      className="feedback-btn"
                      onClick={() =>
                        navigate(`/student/feedback/${_id}`)
                      }
                    >
                      View Feedback
                    </button>
                  )}

                  {status === "cancelled" && (
                    <button
                      className="reschedule-btn"
                      onClick={() =>
                        navigate(`/student/${_id}/reschedule`)
                      }
                    >
                      Reschedule Interview
                    </button>
                  )}

                  {(status === "pending" || status === "confirmed") && (
                    <>
                      {/* ✅ SHOW JOIN ONLY IF LINK EXISTS */}
                      {meetingLink && (
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="join-btn"
                        >
                          Join Interview
                        </a>
                      )}

                      <button
                        className="cancel-btn"
                        onClick={() => cancelInterview(_id)}
                      >
                        Cancel Interview
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
