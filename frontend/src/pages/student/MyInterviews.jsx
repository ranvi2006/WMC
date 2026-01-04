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

  const totalMinutes = Math.floor(diff / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let result = "";

  if (days > 0) result += `${days}d `;
  if (hours > 0 || days > 0) result += `${hours}h `;
  result += `${minutes}m`;

  return result.trim();
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

        // 🔹 Smart default tab
        if (data.some(i => i.status === "pending")) setActiveTab("pending");
        else if (data.some(i => i.status === "confirmed")) setActiveTab("confirmed");
        else if (data.some(i => i.status === "completed")) setActiveTab("completed");
        else setActiveTab(null);
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

  /* 🔹 Global empty state */
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
        {["pending", "confirmed", "completed"].map((tab) => {
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

            const countdown = getCountdown(date, startTime);
            const joinAllowed =
              meetingLink &&
              (status === "pending" || status === "confirmed") &&
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
                    ⏳ Starts in <strong>{countdown}</strong>
                  </p>
                )}

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

                  {(status === "pending" || status === "confirmed") && (
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
                        <button className="join-btn disabled" disabled>
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
