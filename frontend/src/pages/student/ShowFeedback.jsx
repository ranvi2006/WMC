import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ShowFeedback.css";

const ShowFeedback = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get(
          `/api/feedback/${interviewId}`
        );
        setFeedback(res.data.feedback);
      } catch (err) {
        console.error(err);
        setFeedback(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [interviewId]);

  if (loading) {
    return <p className="loading">Loading feedback...</p>;
  }

  if (!feedback) {
    return (
      <div className="feedback-page empty">
        <h2>No feedback available</h2>
        <p>
          Your teacher has not submitted feedback yet.
        </p>
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <h2>Interview Feedback</h2>

      {/* RATING */}
      <div className="rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              feedback.rating >= star
                ? "star active"
                : "star"
            }
          >
            ★
          </span>
        ))}
      </div>

      {/* CONTENT */}
      <div className="feedback-card">
        <div className="section">
          <h4>Strengths</h4>
          <p>{feedback.strengths}</p>
        </div>

        <div className="section">
          <h4>Areas for Improvement</h4>
          <p>{feedback.improvements}</p>
        </div>

        {feedback.recommendation && (
          <div className="section">
            <h4>Recommendation</h4>
            <p>{feedback.recommendation}</p>
          </div>
        )}
      </div>

      <p className="teacher">
        — {feedback.teacherId?.name}
      </p>

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        Back to Interviews
      </button>
    </div>
  );
};

export default ShowFeedback;
