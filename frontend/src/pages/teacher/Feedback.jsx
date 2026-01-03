import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

export default function Feedback() {
  const { interviewId } = useParams();

  const [rating, setRating] = useState(5);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const submitFeedback = async () => {
    try {
      await api.post("/feedback", {
        interviewId,
        rating,
        strengths,
        improvements,
        recommendation,
      });
      alert("Feedback submitted");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting feedback");
    }
  };

  return (
    <div>
      <h2>Give Feedback</h2>

      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <textarea
        placeholder="Strengths"
        onChange={(e) => setStrengths(e.target.value)}
      />

      <textarea
        placeholder="Improvements"
        onChange={(e) => setImprovements(e.target.value)}
      />

      <textarea
        placeholder="Recommendation"
        onChange={(e) => setRecommendation(e.target.value)}
      />

      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
}
