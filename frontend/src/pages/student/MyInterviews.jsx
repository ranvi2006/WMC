import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyInterview.css";

/* =========================
   HELPERS
========================= */

const getCountdown = (date, startTime) => {
  const interviewTime = new Date(`${date}T${startTime}:00`);
  const now = new Date();
  const diff = interviewTime - now;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m`;
};

const canJoinInterview = (date, startTime) => {
  const interviewTime = new Date(`${date}T${startTime}:00`);
  const now = new Date();
  const diffMinutes = (interviewTime - now) / (1000 * 60);

  return diffMinutes <= 5 && diffMinutes >= 0;
};

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/api/interviews/my");
        const data = res.data.interviews || [];
        setInterviews(data);

        // 🔹 Decide default tab intelligently
        const hasPending = data.some(i => i.status === "pending");
        const hasConfirmed = data.some(i => i.status === "confirmed");
        const hasCompleted = data.some(i => i.status === "completed");

        if (hasPending) setActiveTab("pending");
        else if (hasConfirmed) setActiveTab("confirmed");
        else if (hasCompleted) setActiveTab("completed");
        else setActiveTab(null); // no interviews at all
      } catch (err) {
        console.error("Failed to load interviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <p className="loading">Loading interviews...</p>;
  }

  // 🔹 Global empty state
  if (!activeTab) {
    return (
      <div className="my-interviews-page empty-state">
        <h2>You have no interviews yet</h2>
        <p>
          Book your first interview to get started.
        </p>
        <button
          className="book-now-btn"
          onClick={() =>
            navigate("/student/book-interview")
          }
        >
          Book Interview
        </button>
      </div>
    );
  }

  // 🔹 Filter by active tab
  const filteredInterviews = interviews.filter(
    (i) => i.status === activeTab
  );

  return (
    <div className="my-interviews-page">
      <h2>My Interviews</h2>

      {/* 🔹 TABS */}
      <div className="tabs">
        {["pending", "confirmed", "completed"].map((tab) => {
          const hasData = interviews.some(
            (i) => i.status === tab
          );

          if (!hasData) return null;

          return (
            <button
              key={tab}
              className={`tab-btn ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* 🔹 LIST */}
      {filteredInterviews.length === 0 ? (
        <p className="empty">
          No {activeTab} interviews
        </p>
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

            const countdown = getCountdown(date, startTime);
            const joinAllowed =
              meetingLink &&
              (status === "pending" ||
                status === "confirmed") &&
              canJoinInterview(date, startTime);

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

                {/* COUNTDOWN */}
                {countdown && status !== "completed" && (
                  <p className="countdown">
                    ⏳ Starts in{" "}
                    <strong>{countdown}</strong>
                  </p>
                )}

                {/* ACTIONS */}
                <div className="actions">
                  {status === "completed" && (
                    <button
                      className="feedback-btn"
                      onClick={() =>
                        navigate(
                          `/student/feedback/${_id}`
                        )
                      }
                    >
                      Give Feedback
                    </button>
                  )}

                  {(status === "pending" ||
                    status === "confirmed") && (
                    <>
                      {joinAllowed ? (
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="join-btn"
                        >
                          Join Interview
                        </a>
                      ) : (
                        <button
                          className="join-btn disabled"
                          disabled
                        >
                          Join available 5 minutes before start
                        </button>
                      )}
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
