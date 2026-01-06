import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/interviews/admin");
      setInterviews(res.data.interviews || []);
    } catch (err) {
      console.error("Failed to fetch interviews", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const cancelInterview = async (id) => {
    if (!window.confirm("Cancel this interview?")) return;

    try {
      await api.patch(`/api/interviews/${id}/admin-cancel`);

      setInterviews((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, status: "cancelled" } : i
        )
      );

      if (selectedInterview?._id === id) {
        setSelectedInterview((prev) => ({
          ...prev,
          status: "cancelled",
        }));
      }
    } catch (err) {
      console.error("Failed to cancel interview", err);
    }
  };

  const filtered = interviews.filter(
    (i) => filter === "all" || i.status === filter
  );

  /* ================= STATUS BADGE ================= */
  const statusBadge = (status) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";

    switch (status) {
      case "confirmed":
        return `${base} bg-green-500/20 text-green-400`;
      case "completed":
        return `${base} bg-blue-500/20 text-blue-400`;
      case "cancelled":
        return `${base} bg-red-500/20 text-red-400`;
      default:
        return `${base} bg-yellow-500/20 text-yellow-300`;
    }
  };

  /* ================= DETAILS VIEW ================= */
  if (selectedInterview) {
    const i = selectedInterview;

    return (
      <div className="min-h-screen bg-[#0b0f1a] px-6 py-6">
        <div className="max-w-3xl mx-auto bg-[#12172a] rounded-xl shadow p-6 text-gray-200">

          <button
            onClick={() => setSelectedInterview(null)}
            className="text-sm text-purple-400 mb-4"
          >
            ← Back to list
          </button>

          <h2 className="text-xl font-bold mb-4">
            Interview Details
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Status:</strong>{" "}
              <span className={statusBadge(i.status)}>
                {i.status}
              </span>
            </p>
            <p><strong>Date:</strong> {i.date}</p>
            <p><strong>Time:</strong> {i.startTime}</p>
          </div>

          <hr className="my-4 border-white/10" />

          <div className="space-y-2 text-sm">
            <h3 className="font-semibold">Student</h3>
            <p>{i.studentId?.name}</p>
            <p className="text-gray-400">{i.studentId?.email}</p>

            <h3 className="font-semibold mt-3">Teacher</h3>
            <p>{i.teacherId?.name}</p>
            <p className="text-gray-400">{i.teacherId?.email}</p>
          </div>

          <hr className="my-4 border-white/10" />

          <div className="space-y-2 text-sm">
            <p>
              <strong>Meeting Link:</strong>{" "}
              {i.meetingLink ? (
                <a
                  href={i.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-400 underline"
                >
                  Open meeting
                </a>
              ) : (
                "Not added"
              )}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {i.paymentId ? (
                <span className="text-green-400">Paid</span>
              ) : (
                <span className="text-red-400">Unpaid</span>
              )}
            </p>
          </div>

          {i.status !== "cancelled" && (
            <button
              onClick={() => cancelInterview(i._id)}
              className="
                mt-6 px-4 py-2 rounded-lg
                bg-red-600 hover:bg-red-500
                text-white font-semibold
              "
            >
              Cancel Interview
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ================= LIST VIEW ================= */
  return (
    <div className="min-h-screen bg-[#0b0f1a] px-6 py-6 text-gray-100">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          All Interviews
        </h2>

        <button
          onClick={() => navigate("/admin/create-slots")}
          className="
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-500 hover:to-indigo-500
            text-white px-4 py-2 rounded-lg
            font-semibold
          "
        >
          + Create Interview Slots
        </button>
      </div>

      {/* FILTER */}
      <div className="max-w-7xl mx-auto mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="
            px-3 py-2 rounded-lg
            bg-[#12172a]
            border border-white/10
            text-white
            focus:ring-2 focus:ring-purple-500
            [color-scheme:dark]
          "
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-[#12172a] rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-300">
            Loading interviews...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Teacher</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-400">
                    No interviews found
                  </td>
                </tr>
              ) : (
                filtered.map((i) => (
                  <tr
                    key={i._id}
                    className="
                      border-t border-white/10
                      hover:bg-white/5
                      text-gray-100
                    "
                  >
                    <td className="px-4 py-3">{i.studentId?.name}</td>
                    <td className="px-4 py-3">{i.teacherId?.name}</td>
                    <td className="px-4 py-3">{i.date}</td>
                    <td className="px-4 py-3">{i.startTime}</td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(i.status)}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {i.paymentId ? (
                        <span className="text-green-400">Paid</span>
                      ) : (
                        <span className="text-red-400">Unpaid</span>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-3">
                      <button
                        onClick={() => setSelectedInterview(i)}
                        className="text-purple-400 hover:underline"
                      >
                        View
                      </button>

                      {i.status !== "cancelled" && (
                        <button
                          onClick={() => cancelInterview(i._id)}
                          className="text-red-400 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
