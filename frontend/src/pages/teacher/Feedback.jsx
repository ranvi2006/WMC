import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Feedback() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
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

  /* ================= UI ================= */
  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      "
    >
      <div className="max-w-2xl mx-auto">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Interview Feedback
        </h2>

        {/* CARD */}
        <div
          className="
            rounded-2xl p-6
            bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
            border border-gray-200 dark:border-white/10
            shadow-lg
          "
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ⭐ RATING */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* 💪 STRENGTHS */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Strengths
              </label>
              <textarea
                rows={3}
                placeholder="What did the student do well?"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                required
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                  resize-none
                "
              />
            </div>

            {/* 🔧 IMPROVEMENTS */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Areas for Improvement
              </label>
              <textarea
                rows={3}
                placeholder="Where can the student improve?"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                required
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                  resize-none
                "
              />
            </div>

            {/* 💡 RECOMMENDATION */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Recommendation (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any advice or next steps?"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="
                  w-full rounded-xl px-4 py-3 text-sm
                  bg-gray-50 dark:bg-[#070814]
                  border border-gray-300 dark:border-white/10
                  text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-purple-600
                  resize-none
                "
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                px-6 py-3 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white text-sm font-semibold
                shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
