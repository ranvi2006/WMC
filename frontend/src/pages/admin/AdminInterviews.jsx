import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const cancelInterview = async (id) => {
    if (!window.confirm("Cancel this interview?")) return;

    try {
      await api.patch(`/api/interviews/${id}/admin-cancel`);
      setInterviews((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, status: "cancelled" } : i
        )
      );
    } catch (err) {
      console.error("Failed to cancel interview", err);
    }
  };

  const filtered = interviews.filter(
    (i) => filter === "all" || i.status === filter
  );

  const statusBadge = (status) => {
    const base =
      "inline-flex px-2 py-0.5 rounded-full text-xs font-semibold";

    switch (status) {
      case "confirmed":
        return `${base} bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400`;
      case "completed":
        return `${base} bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400`;
      case "cancelled":
        return `${base} bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400`;
      default:
        return `${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300`;
    }
  };

  /* ================= DETAILS VIEW ================= */
  if (selectedInterview) {
    const i = selectedInterview;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-6">

          <button
            onClick={() => setSelectedInterview(null)}
            className="text-sm text-blue-600 dark:text-blue-400 mb-4"
          >
            ← Back to list
          </button>

          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Interview Details
          </h2>

          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Status:</strong>{" "}
              <span className={statusBadge(i.status)}>{i.status}</span>
            </p>
            <p><strong>Date:</strong> {i.date}</p>
            <p><strong>Time:</strong> {i.startTime}</p>
          </div>

          <hr className="my-4 border-gray-200 dark:border-gray-700" />

          <div className="space-y-2 text-sm">
            <p><strong>Student:</strong> {i.studentId?.name}</p>
            <p className="text-gray-500">{i.studentId?.email}</p>

            <p className="mt-3"><strong>Teacher:</strong> {i.teacherId?.name}</p>
            <p className="text-gray-500">{i.teacherId?.email}</p>
          </div>

          {i.status !== "cancelled" && (
            <button
              onClick={() => cancelInterview(i._id)}
              className="mt-6 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Interviews
        </h2>

        <button
          onClick={() => navigate("/admin/create-slots")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          + Create Interview Slots
        </button>
      </div>

      {/* FILTER */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* ================= MOBILE / TABLET VIEW ================= */}
      <div className="space-y-3 md:hidden">
        {filtered.map((i) => (
          <div
            key={i._id}
            className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {i.studentId?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Teacher: {i.teacherId?.name}
                </p>
              </div>

              <span className={statusBadge(i.status)}>
                {i.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Date: {i.date}</p>
              <p>Time: {i.startTime}</p>
              <p>Payment: {i.paymentId ? "Paid" : "Unpaid"}</p>
            </div>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => setSelectedInterview(i)}
                className="text-blue-600 dark:text-blue-400 text-sm font-medium"
              >
                View
              </button>

              {i.status !== "cancelled" && (
                <button
                  onClick={() => cancelInterview(i._id)}
                  className="text-red-600 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
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
            {filtered.map((i) => (
              <tr
                key={i._id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3">{i.studentId?.name}</td>
                <td className="px-4 py-3">{i.teacherId?.name}</td>
                <td className="px-4 py-3">{i.date}</td>
                <td className="px-4 py-3">{i.startTime}</td>
                <td className="px-4 py-3">
                  <span className={statusBadge(i.status)}>{i.status}</span>
                </td>
                <td className="px-4 py-3">
                  {i.paymentId ? "Paid" : "Unpaid"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedInterview(i)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
