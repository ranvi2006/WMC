import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SystemMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH HEALTH ================= */
  const fetchHealth = async () => {
    try {
      const res = await api.get("/api/monitoring/health");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load system health", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading system health...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Unable to load system health
      </div>
    );
  }

  /* ================= HELPERS ================= */
  const statusColor = (status) =>
    status === "Connected" || status === "OK"
      ? "text-green-500"
      : "text-red-500";

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Monitoring
        </h1>

        <button
          onClick={() => navigate("/admin/errors")}
          className="inline-flex items-center justify-center
                     bg-red-600 hover:bg-red-500
                     text-white px-4 py-2 rounded"
        >
          View Error Logs →
        </button>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* API STATUS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            API Status
          </h3>
          <p className={`font-semibold ${statusColor(data.server.status)}`}>
            ● {data.server.status}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Uptime: {data.server.uptime}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Env: {data.server.environment}
          </p>
        </div>

        {/* DATABASE */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Database
          </h3>
          <p className={`font-semibold ${statusColor(data.database.status)}`}>
            ● {data.database.status}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Response: {data.database.responseTime}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Collections: {data.database.collections}
          </p>
        </div>

        {/* ERRORS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Errors (24h)
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Total: <strong>{data.errors.last24h}</strong>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Top: {data.errors.topError || "N/A"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Last: {data.errors.lastErrorTime || "N/A"}
          </p>
        </div>

        {/* SYSTEM LOAD */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            System Load
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Requests (1h): {data.systemLoad.requestsLastHour}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Avg Response: {data.systemLoad.avgResponseTime}
          </p>
        </div>

      </div>
    </div>
  );
};

export default SystemMonitoring;
