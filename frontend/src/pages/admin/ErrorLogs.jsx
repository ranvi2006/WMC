import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ErrorLogs.css";

const ErrorLogs = () => {
  const [errors, setErrors] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [selectedError, setSelectedError] = useState(null);

  const fetchErrors = async () => {
    const res = await api.get("/api/admin/errors", {
      params: { page, search, statusCode },
    });

    setErrors(res.data.errors);
    setPages(res.data.pagination.pages);
  };

  useEffect(() => {
    fetchErrors();
  }, [page, search, statusCode]);

  return (
    <div className="error-page">
      <h2>Error Logs</h2>

      {/* FILTERS */}
      <div className="filters">
        <input
          placeholder="Search message or route"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusCode}
          onChange={(e) => setStatusCode(e.target.value)}
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
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Message</th>
            <th>Route</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {errors.map((e) => (
            <tr
              key={e._id}
              className="clickable"
              onClick={() => setSelectedError(e)}
            >
              <td>{new Date(e.createdAt).toLocaleString()}</td>
              <td>{e.message}</td>
              <td>{e.route}</td>
              <td>{e.method}</td>
              <td>{e.statusCode}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {pages}
        </span>
        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedError && (
        <div className="modal-overlay" onClick={() => setSelectedError(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Error Details</h3>

            <p><strong>Message:</strong> {selectedError.message}</p>
            <p><strong>Route:</strong> {selectedError.route}</p>
            <p><strong>Method:</strong> {selectedError.method}</p>
            <p><strong>Status:</strong> {selectedError.statusCode}</p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(selectedError.createdAt).toLocaleString()}
            </p>

            <div className="stack">
              <strong>Stack Trace:</strong>
              <pre>{selectedError.stack}</pre>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedError(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorLogs;
