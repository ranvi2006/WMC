import { useEffect, useState } from "react";
import api from "../../services/api";

const ErrorLogs = () => {
  const [errors, setErrors] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [selectedError, setSelectedError] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ERRORS ================= */
  const fetchErrors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/errors", {
        params: { page, search, statusCode },
      });
      setErrors(res.data.errors || []);
      setPages(res.data.pagination.pages || 1);
    } catch (err) {
      console.error("Failed to load errors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [page, search, statusCode]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Error Logs
        </h2>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Search message or route"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-1 px-3 py-2 rounded border
                     border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-900
                     text-gray-900 dark:text-gray-100"
        />

        <select
          value={statusCode}
          onChange={(e) => {
            setPage(1);
            setStatusCode(e.target.value);
          }}
          className="w-full sm:w-40 px-3 py-2 rounded border
                     border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-900
                     text-gray-900 dark:text-gray-100"
        >
          <option value="">All Status</option>
          <option value="400">400</option>
          <option value="401">401</option>
          <option value="403">403</option>
          <option value="404">404</option>
          <option value="500">500</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Route</th>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-600 dark:text-gray-300">
                  Loading errors...
                </td>
              </tr>
            ) : errors.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-600 dark:text-gray-300">
                  No errors found
                </td>
              </tr>
            ) : (
              errors.map((e) => (
                <tr
                  key={e._id}
                  onClick={() => setSelectedError(e)}
                  className="cursor-pointer
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             text-gray-800 dark:text-gray-200"
                >
                  <td className="px-4 py-2">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 truncate max-w-xs">
                    {e.message}
                  </td>
                  <td className="px-4 py-2">{e.route}</td>
                  <td className="px-4 py-2">{e.method}</td>
                  <td className="px-4 py-2 font-semibold text-red-600">
                    {e.statusCode}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded border
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-200">
          Page {page} / {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded border
                     border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-200
                     disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedError && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedError(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800
                       rounded-lg shadow-lg
                       max-w-2xl w-full mx-4 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Error Details
            </h3>

            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p><strong>Message:</strong> {selectedError.message}</p>
              <p><strong>Route:</strong> {selectedError.route}</p>
              <p><strong>Method:</strong> {selectedError.method}</p>
              <p><strong>Status:</strong> {selectedError.statusCode}</p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(selectedError.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="mt-4">
              <strong className="text-sm text-gray-700 dark:text-gray-200">
                Stack Trace:
              </strong>
              <pre className="mt-2 p-3 rounded bg-gray-100 dark:bg-gray-900
                              text-xs text-gray-800 dark:text-gray-200
                              max-h-60 overflow-auto">
                {selectedError.stack}
              </pre>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedError(null)}
                className="bg-blue-700 hover:bg-blue-600
                           text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ErrorLogs;
