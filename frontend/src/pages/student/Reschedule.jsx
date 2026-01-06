import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Reschedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/api/interviews/${id}`);
        setInterview(res.data.interview);
      } catch {
        navigate("/student/interviews");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading interview details…
      </div>
    );
  }

  if (!interview) return null;

  const {
    teacherId,
    date: oldDate,
    startTime,
    duration,
    status,
    cancelledBy,
    rescheduleCount,
  } = interview;

  const isCancelledByAdmin = cancelledBy === "admin";
  const canReschedule =
    status === "cancelled" &&
    !isCancelledByAdmin &&
    rescheduleCount < 1;

  const canSelectDateTime = cancelledBy === "teacher";

  /* ================= SUBMIT ================= */
  const submit = async () => {
    try {
      const payload = { interviewId: id, reason };

      if (canSelectDateTime) {
        if (!date || !time) return alert("Select date & time");
        payload.requestedDate = date;
        payload.requestedStartTime = time;
      }

      await api.post("/api/reschedule", payload);
      alert("Reschedule request sent");
      navigate("/student/interviews");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="
      min-h-screen px-4 py-10
      bg-gray-50
      dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
    ">
      <div className="max-w-xl mx-auto">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Reschedule Interview
        </h2>

        {/* CARD */}
        <div className="
          rounded-2xl p-6
          bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
          border border-gray-200 dark:border-white/10
          shadow-lg
        ">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {teacherId?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teacherId?.email}
              </p>
            </div>

            <span className="
              px-3 py-1 rounded-full text-xs font-semibold
              bg-red-600 text-white
            ">
              cancelled
            </span>
          </div>

          {/* DETAILS */}
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6">
            <p><span className="font-semibold">Date:</span> {oldDate}</p>
            <p><span className="font-semibold">Time:</span> {startTime}</p>
            <p><span className="font-semibold">Duration:</span> {duration} min</p>

            <span className="
              inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
              bg-red-100 text-red-700
              dark:bg-red-500/20 dark:text-red-300
            ">
              Cancelled by {cancelledBy}
            </span>
          </div>

          {!canReschedule ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              This interview cannot be rescheduled.
            </p>
          ) : (
            <>
              {/* DATE */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  New Date
                </label>
                <input
                  type="date"
                  value={date}
                  disabled={!canSelectDateTime}
                  onChange={(e) => setDate(e.target.value)}
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-gray-50 dark:bg-[#070814]
                    border border-gray-300 dark:border-white/10
                    text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-600
                    disabled:opacity-40
                  "
                />
              </div>

              {/* TIME */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  New Start Time
                </label>
                <input
                  type="time"
                  step="1800"
                  min="09:00"
                  max="20:30"
                  value={time}
                  disabled={!canSelectDateTime}
                  onChange={(e) => setTime(e.target.value)}
                  className="
                    w-full rounded-xl px-4 py-3 text-sm
                    bg-gray-50 dark:bg-[#070814]
                    border border-gray-300 dark:border-white/10
                    text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-purple-600
                    disabled:opacity-40
                  "
                />
              </div>

              {/* INFO */}
              {!canSelectDateTime && (
                <div className="
                  mb-4 rounded-xl p-3 text-sm
                  bg-purple-50 text-purple-700
                  dark:bg-purple-500/10 dark:text-purple-300
                ">
                  The teacher will choose the new date & time.
                </div>
              )}

              {/* REASON */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Reason (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Why do you want to reschedule?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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

              {/* ACTION */}
              <button
                onClick={submit}
                className="
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white text-sm font-semibold
                  shadow-lg shadow-purple-600/30
                  hover:opacity-90 transition
                "
              >
                Reschedule
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
