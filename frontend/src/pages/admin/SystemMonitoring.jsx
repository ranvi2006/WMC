import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./SystemMonitoring.css";

const SystemMonitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <p className="loading-text">Loading system health...</p>;
  if (!data) return <p className="error-text">Unable to load system health</p>;

  return (
    <div className="monitoring-page">
      {/* HEADER */}
      <div className="monitoring-header">
        <h1 className="page-title">System Monitoring</h1>

        <button
          className="error-log-btn"
          onClick={() => navigate("/admin/errors")}
        >
          View Error Logs →
        </button>
      </div>

      <div className="monitoring-grid">
        {/* API STATUS */}
        <div className="monitoring-card">
          <h3>API Status</h3>
          <p className="status green">● {data.server.status}</p>
          <p>Uptime: {data.server.uptime}</p>
          <p>Env: {data.server.environment}</p>
        </div>

        {/* DATABASE */}
        <div className="monitoring-card">
          <h3>Database</h3>
          <p
            className={`status ${
              data.database.status === "Connected" ? "green" : "red"
            }`}
          >
            ● {data.database.status}
          </p>
          <p>Response: {data.database.responseTime}</p>
          <p>Collections: {data.database.collections}</p>
        </div>

        {/* ERRORS */}
        <div className="monitoring-card">
          <h3>Errors (24h)</h3>
          <p>Total: {data.errors.last24h}</p>
          <p>Top: {data.errors.topError}</p>
          <p>Last: {data.errors.lastErrorTime}</p>
        </div>

        {/* SYSTEM LOAD */}
        <div className="monitoring-card">
          <h3>System Load</h3>
          <p>Requests (1h): {data.systemLoad.requestsLastHour}</p>
          <p>Avg Response: {data.systemLoad.avgResponseTime}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
