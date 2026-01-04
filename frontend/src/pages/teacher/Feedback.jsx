import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Feedback.css";

const Feedback = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !strengths || !improvements) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/feedback", {
        interviewId,
        rating,
        strengths,
        improvements,
        recommendation,
      });

      alert("Feedback submitted successfully");
      navigate("/teacher/interviews");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      <h2>Interview Feedback</h2>

      <form className="feedback-form" onSubmit={handleSubmit}>
        {/* ⭐ RATING */}
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  rating >= star ? "star active" : "star"
                }
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* 💪 STRENGTHS */}
        <div className="form-group">
          <label>Strengths</label>
          <textarea
            placeholder="What did the student do well?"
            value={strengths}
            onChange={(e) =>
              setStrengths(e.target.value)
            }
            required
          />
        </div>

        {/* 🔧 IMPROVEMENTS */}
        <div className="form-group">
          <label>Areas for Improvement</label>
          <textarea
            placeholder="Where can the student improve?"
            value={improvements}
            onChange={(e) =>
              setImprovements(e.target.value)
            }
            required
          />
        </div>

        {/* 💡 RECOMMENDATION */}
        <div className="form-group">
          <label>Recommendation (Optional)</label>
          <textarea
            placeholder="Any advice or next steps?"
            value={recommendation}
            onChange={(e) =>
              setRecommendation(e.target.value)
            }
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Feedback;
