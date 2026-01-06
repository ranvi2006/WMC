import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TeacherInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchInterviews = async () => {
    try {
      const res = await api.get("/api/interviews/teacher");
      setInterviews(res.data.interviews || []);

      const links = {};
      res.data.interviews.forEach((i) => {
        links[i._id] = i.meetingLink || "";
      });
      setMeetingLinks(links);
    } catch {
      alert("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  /* ================= STATUS ================= */
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/interviews/${id}/status`, { status });
      setInterviews((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status } : i))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

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
    } catch {
      alert("Cancel failed");
    }
  };

  /* ================= SAVE LINK ================= */
  const saveMeetingLink = async (id) => {
    try {
      setSavingId(id);
      await api.patch(`/api/interviews/${id}/addlink`, {
        meetingLink: meetingLinks[id],
      });

      setInterviews((prev) =>
        prev.map((i) =>
          i._id === id
            ? { ...i, meetingLink: meetingLinks[id] }
            : i
        )
      );
    } catch {
      alert("Failed to save meeting link");
    } finally {
      setSavingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading interviews…
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      "
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Interviews
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/teacher/availability")}
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
              "
            >
              + Create Slots
            </button>

            <button
              onClick={() =>
                navigate("/teacher/reschedule-requests")
              }
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-blue-600 text-white
                hover:bg-blue-500 transition
              "
            >
              Reschedule Requests
            </button>
          </div>
        </div>

        {/* LIST */}
        {interviews.length === 0 ? (
          <p className="text-sm text-gray-500">
            No interviews available
          </p>
        ) : (
          <div className="grid gap-5">
            {interviews.map((interview) => (
              <div
                key={interview._id}
                className="
                  rounded-2xl p-5
                  bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
                  border border-gray-200 dark:border-white/10
                  shadow-lg
                "
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {interview.studentId?.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {interview.studentId?.email}
                    </p>
                  </div>

                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold text-white
                      ${
                        interview.status === "pending"
                          ? "bg-yellow-500"
                          : interview.status === "confirmed"
                          ? "bg-blue-600"
                          : interview.status === "completed"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }
                    `}
                  >
                    {interview.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {interview.date}
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span>{" "}
                    {interview.startTime}
                  </div>
                </div>

                {/* STATUS CONTROL */}
                {(interview.status === "pending" ||
                  interview.status === "confirmed") && (
                  <select
                    onChange={(e) =>
                      updateStatus(interview._id, e.target.value)
                    }
                    className="
                      mb-3 rounded-xl px-3 py-2 text-sm
                      bg-gray-50 dark:bg-[#070814]
                      border border-gray-300 dark:border-white/10
                      text-gray-900 dark:text-white
                    "
                  >
                    <option>
                      {interview.status === "pending"
                        ? "Pending"
                        : "Confirmed"}
                    </option>
                    {interview.status === "pending" && (
                      <option value="confirmed">Confirm</option>
                    )}
                    {interview.status === "confirmed" && (
                      <option value="completed">Complete</option>
                    )}
                  </select>
                )}

                {/* MEETING LINK */}
                {interview.status === "confirmed" && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Paste Zoom / Meet link"
                      value={meetingLinks[interview._id] || ""}
                      onChange={(e) =>
                        setMeetingLinks((prev) => ({
                          ...prev,
                          [interview._id]: e.target.value,
                        }))
                      }
                      className="
                        flex-1 rounded-xl px-4 py-2 text-sm
                        bg-gray-50 dark:bg-[#070814]
                        border border-gray-300 dark:border-white/10
                        text-gray-900 dark:text-white
                      "
                    />
                    <button
                      disabled={savingId === interview._id}
                      onClick={() =>
                        saveMeetingLink(interview._id)
                      }
                      className="
                        px-4 py-2 rounded-xl text-sm
                        bg-indigo-600 text-white
                        hover:bg-indigo-500 transition
                        disabled:opacity-50
                      "
                    >
                      {savingId === interview._id
                        ? "Saving..."
                        : "Save"}
                    </button>
                  </div>
                )}

                {interview.meetingLink &&
                  interview.status !== "confirmed" && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 underline"
                    >
                      Open Meeting
                    </a>
                  )}

                {/* ACTIONS */}
                <div className="flex gap-2 flex-wrap mt-4">
                  {!["completed", "cancelled"].includes(
                    interview.status
                  ) && (
                    <button
                      onClick={() =>
                        cancelInterview(interview._id)
                      }
                      className="
                        px-4 py-2 rounded-xl text-xs
                        bg-red-600 text-white
                        hover:bg-red-500 transition
                      "
                    >
                      Cancel
                    </button>
                  )}

                  {interview.status === "completed" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/teacher/feedback/${interview._id}`
                        )
                      }
                      className="
                        px-4 py-2 rounded-xl text-xs
                        bg-green-600 text-white
                        hover:bg-green-500 transition
                      "
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
