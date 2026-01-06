import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  /* ================= CANCEL ================= */
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

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/api/interviews/my");
        const data = res.data.interviews || [];
        setInterviews(data);

        const priority = ["pending", "confirmed", "completed", "cancelled"];
        const firstTab = priority.find(tab =>
          data.some(i => i.status === tab)
        );
        setActiveTab(firstTab || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading interviews…
      </div>
    );
  }

  if (!activeTab) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <h2 className="text-2xl font-bold">
          No interviews yet
        </h2>
        <p className="text-gray-500 text-sm">
          Book your first interview to get started
        </p>
        <button
          onClick={() => navigate("/student/book-interview")}
          className="
            px-6 py-3 rounded-xl
            bg-gradient-to-r from-indigo-600 to-blue-600
            text-white text-sm font-semibold
            shadow-lg shadow-indigo-500/30
            hover:opacity-90 transition
          "
        >
          Book Interview ₹9
        </button>
      </div>
    );
  }

  const filtered = interviews.filter(i => i.status === activeTab);

  const statusColor = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-600",
    completed: "bg-green-600",
    cancelled: "bg-red-600",
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Interviews
          </h2>

          <button
            onClick={() => navigate("/student/book-interview")}
            className="
              hidden sm:inline-flex
              px-5 py-2 rounded-xl
              bg-gradient-to-r from-indigo-600 to-blue-600
              text-white text-sm font-semibold
              shadow-lg shadow-indigo-500/30
              hover:opacity-90 transition
            "
          >
            Book Interview ₹9
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["pending", "confirmed", "completed", "cancelled"].map(tab => {
            const hasData = interviews.some(i => i.status === tab);
            if (!hasData) return null;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-full
                  text-xs font-semibold uppercase tracking-wide
                  transition
                  ${activeTab === tab
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">
              No {activeTab} interviews
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filtered.map(interview => {
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
                <div
                  key={_id}
                  className="
                    bg-white dark:bg-gray-900
                    rounded-2xl p-5
                    shadow-md border
                    border-gray-200 dark:border-gray-800
                    hover:shadow-lg transition
                  "
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {teacherId?.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {teacherId?.email}
                      </p>
                    </div>

                    <span
                      className={`
                        px-3 py-1 rounded-full
                        text-xs font-semibold text-white
                        ${statusColor[status]}
                      `}
                    >
                      {status}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 dark:text-gray-300 mt-4">
                    <div>
                      <span className="font-semibold">Date:</span> {date}
                    </div>
                    <div>
                      <span className="font-semibold">Time:</span> {startTime}
                    </div>
                    <div>
                      <span className="font-semibold">Duration:</span> {duration} min
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 flex-wrap mt-5">
                    {status === "completed" && (
                      <button
                        onClick={() => navigate(`/student/feedback/${_id}`)}
                        className="
                          px-4 py-2 text-xs rounded-xl
                          bg-green-600 text-white
                          hover:bg-green-500 transition
                        "
                      >
                        View Feedback
                      </button>
                    )}

                    {status === "cancelled" && (
                      <button
                        onClick={() => navigate(`/student/${_id}/reschedule`)}
                        className="
                          px-4 py-2 text-xs rounded-xl
                          bg-indigo-600 text-white
                          hover:bg-indigo-500 transition
                        "
                      >
                        Reschedule
                      </button>
                    )}

                    {(status === "pending" || status === "confirmed") && (
                      <>
                        {meetingLink && (
                          <a
                            href={meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              px-4 py-2 text-xs rounded-xl
                              bg-blue-600 text-white
                              hover:bg-blue-500 transition
                            "
                          >
                            Join
                          </a>
                        )}

                        <button
                          onClick={() => cancelInterview(_id)}
                          className="
                            px-4 py-2 text-xs rounded-xl
                            bg-red-600 text-white
                            hover:bg-red-500 transition
                          "
                        >
                          Cancel
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
    </div>
  );
}
