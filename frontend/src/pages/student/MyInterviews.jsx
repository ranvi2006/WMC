import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyInterview.css";

/* =========================
   HELPERS
========================= */

// Countdown helper
const getCountdown = (date, startTime) => {
  const interviewTime = new Date(`${date}T${startTime}:00`);
  const now = new Date();

  const diff = interviewTime - now;
  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m`;
};

// Join allowed only within 5 minutes before start
const canJoinInterview = (date, startTime) => {
  const interviewTime = new Date(`${date}T${startTime}:00`);
  const now = new Date();
  const diffMinutes = (interviewTime - now) / (1000 * 60);

  return diffMinutes <= 5 && diffMinutes >= 0;
};

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/api/interviews/my");
        setInterviews(res.data.interviews || []);
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

  return (
    <div className="my-interviews-page">
      <h2>My Interviews</h2>

      {interviews.length === 0 && (
        <p className="empty">You have not booked any interviews yet.</p>
      )}

      <div className="interview-list">
        {interviews.map((interview) => {
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
                <h3>{teacherId.name}</h3>
                <span className={`status ${status}`}>
                  {status.toUpperCase()}
                </span>
              </div>

              <p className="email">{teacherId.email}</p>

              {/* DETAILS */}
              <div className="details">
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {startTime}</p>
                <p><strong>Duration:</strong> {duration} mins</p>
              </div>

              {/* COUNTDOWN */}
              {countdown && status !== "completed" && status !== "cancelled" && (
                <p className="countdown">
                  ⏳ Interview starts in <strong>{countdown}</strong>
                </p>
              )}

              {/* ACTIONS */}
              <div className="actions">
                {/* COMPLETED */}
                {status === "completed" && (
                  <>
                    <span className="info-text">Interview completed</span>
                    <button
                      className="feedback-btn"
                      onClick={() => navigate(`/student/feedback/${_id}`)}
                    >
                      Give Feedback
                    </button>
                  </>
                )}

                {/* CANCELLED */}
                {status === "cancelled" && (
                  <span className="info-text cancelled">
                    Interview cancelled
                  </span>
                )}

                {/* UPCOMING */}
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
    </div>
  );
}
