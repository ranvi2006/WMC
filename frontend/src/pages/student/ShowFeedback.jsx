import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ShowFeedback() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get(`/api/feedback/${interviewId}`);
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading feedback…
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!feedback) {
    return (
      <div className="
        min-h-screen px-4 py-16
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
        flex items-center justify-center
      ">
        <div className="
          max-w-md w-full text-center
          bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
          border border-gray-200 dark:border-white/10
          rounded-2xl p-6 shadow-lg
        ">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No feedback available
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your teacher has not submitted feedback yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="
              px-6 py-2 rounded-xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white text-sm font-semibold
              shadow-lg shadow-purple-600/30
              hover:opacity-90 transition
            "
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="
      min-h-screen px-4 py-10
      bg-gray-50
      dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
    ">
      <div className="max-w-2xl mx-auto">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Interview Feedback
        </h2>

        {/* CARD */}
        <div className="
          rounded-2xl p-6
          bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
          border border-gray-200 dark:border-white/10
          shadow-lg
        ">

          {/* RATING */}
          <div className="flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${
                  feedback.rating >= star
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* STRENGTHS */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">
              Strengths
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {feedback.strengths}
            </p>
          </div>

          {/* IMPROVEMENTS */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">
              Areas for Improvement
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {feedback.improvements}
            </p>
          </div>

          {/* RECOMMENDATION */}
          {feedback.recommendation && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">
                Recommendation
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {feedback.recommendation}
              </p>
            </div>
          )}

          {/* TEACHER */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            — {feedback.teacherId?.name}
          </p>

          {/* ACTION */}
          <button
            onClick={() => navigate(-1)}
            className="
              px-6 py-2 rounded-xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white text-sm font-semibold
              shadow-lg shadow-purple-600/30
              hover:opacity-90 transition
            "
          >
            Back to Interviews
          </button>
        </div>
      </div>
    </div>
  );
}
