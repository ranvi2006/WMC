import { useEffect, useState } from "react";
import api from "../../services/api";

export default function RescheduleRequests() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    api.get("/api/reschedule/teacher").then((res) => {
      setRequests(res.data.requests || []);
    });
  }, []);

  /* ================= APPROVE ================= */
  const approve = async (request) => {
    try {
      const hasDateTime =
        !!request.requestedDate && !!request.requestedStartTime;

      // Student already selected → direct approve
      if (hasDateTime) {
        setLoadingId(request._id);
        await api.post(`/api/reschedule/${request._id}/approve`);
        setRequests((prev) =>
          prev.filter((r) => r._id !== request._id)
        );
        return;
      }

      // Teacher selects date/time
      setActiveRequest(request);
      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= CONFIRM ================= */
  const confirmApprove = async () => {
    if (!activeRequest) return;

    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    try {
      setLoadingId(activeRequest._id);

      await api.post(
        `/api/reschedule/${activeRequest._id}/approve`,
        { date, time }
      );

      setRequests((prev) =>
        prev.filter((r) => r._id !== activeRequest._id)
      );

      setActiveRequest(null);
      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= REJECT ================= */
  const reject = async (id) => {
    try {
      setLoadingId(id);
      await api.post(`/api/reschedule/${id}/reject`);
      setRequests((prev) =>
        prev.filter((r) => r._id !== id)
      );
    } catch {
      alert("Reject failed");
    } finally {
      setLoadingId(null);
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
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reschedule Requests
          </h2>
          <span
            className="
              px-3 py-1 rounded-full text-xs font-semibold
              bg-purple-600 text-white
            "
          >
            {requests.length}
          </span>
        </div>

        {/* EMPTY */}
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No pending reschedule requests
          </p>
        ) : (
          <div className="grid gap-5">
            {requests.map((r) => (
              <div
                key={r._id}
                className="
                  rounded-2xl p-5
                  bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
                  border border-gray-200 dark:border-white/10
                  shadow-lg
                "
              >
                {/* INFO */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {r.studentId?.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {r.studentId?.email}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {r.requestedDate || "Teacher will decide"}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {r.requestedStartTime || "Teacher will decide"}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-5">
                  <button
                    disabled={loadingId === r._id}
                    onClick={() => approve(r)}
                    className="
                      px-4 py-2 rounded-xl text-xs font-semibold
                      bg-green-600 text-white
                      hover:bg-green-500 transition
                      disabled:opacity-50
                    "
                  >
                    {loadingId === r._id
                      ? "Approving..."
                      : "Approve"}
                  </button>

                  <button
                    disabled={loadingId === r._id}
                    onClick={() => reject(r._id)}
                    className="
                      px-4 py-2 rounded-xl text-xs font-semibold
                      bg-red-600 text-white
                      hover:bg-red-500 transition
                      disabled:opacity-50
                    "
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {activeRequest && (
        <div
          className="
            fixed inset-0 z-50
            bg-black/50
            flex items-center justify-center
            px-4
          "
        >
          <div
            className="
              w-full max-w-md rounded-2xl p-6
              bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
              border border-gray-200 dark:border-white/10
              shadow-xl
            "
          >
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Select Date & Time
            </h3>

            {/* DATE */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full mb-3 rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
                [color-scheme:dark]
                [&::-webkit-calendar-picker-indicator]:invert
              "
            />

            {/* TIME */}
            <input
              type="time"
              min="09:00"
              max="20:30"
              step="1800"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="
                w-full mb-6 rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
                [color-scheme:dark]
                [&::-webkit-calendar-picker-indicator]:invert
              "
            />

            {/* ACTIONS */}
            <div className="flex gap-2 justify-end">
              <button
                disabled={loadingId === activeRequest._id}
                onClick={confirmApprove}
                className="
                  px-4 py-2 rounded-xl text-sm font-semibold
                  bg-green-600 text-white
                  hover:bg-green-500 transition
                  disabled:opacity-50
                "
              >
                Confirm & Approve
              </button>

              <button
                onClick={() => setActiveRequest(null)}
                className="
                  px-4 py-2 rounded-xl text-sm font-semibold
                  bg-gray-300 dark:bg-gray-700
                  text-gray-800 dark:text-gray-200
                  hover:opacity-80 transition
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
