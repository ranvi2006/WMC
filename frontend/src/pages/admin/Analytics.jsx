import { useEffect, useState } from "react";
import api from "../../services/api";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/admin/analytics");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading analytics...
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================= OVERVIEW ================= */}
        <SectionTitle>Overview</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard title="Users" value={data.overview.totalUsers} />
          <StatCard title="Courses" value={data.overview.totalCourses} />
          <StatCard title="Enrollments" value={data.overview.totalEnrollments} />
          <StatCard title="Revenue" value={`₹${data.overview.totalRevenue}`} />
        </div>

        {/* ================= USERS ================= */}
        <Section title="Users Analytics">
          <ResponsiveGrid
            items={[
              ["Active Users", data.users.active],
              ["Inactive Users", data.users.inactive],
              ["Verified Users", data.users.verified],
              ["New (30 days)", data.users.newLast30Days],
            ]}
          />
        </Section>

        {/* ================= COURSES ================= */}
        <Section title="Course Performance">

          {/* MOBILE VIEW (CARDS) */}
          <div className="space-y-3 md:hidden">
            {data.courses.map((c, i) => (
              <div
                key={i}
                className="rounded-lg border dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {c.name}
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <Metric label="Enrollments" value={c.enrollments} />
                  <Metric label="Completed" value={c.completed} />
                  <Metric
                    label="Roadmap"
                    value={c.hasRoadmap ? "Yes" : "No"}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (TABLE) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border dark:border-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-center">Enrollments</th>
                  <th className="p-3 text-center">Completed</th>
                  <th className="p-3 text-center">Roadmap</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map((c, i) => (
                  <tr key={i} className="border-t dark:border-gray-800">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3 text-center">{c.enrollments}</td>
                    <td className="p-3 text-center">{c.completed}</td>
                    <td className="p-3 text-center">
                      {c.hasRoadmap ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Section>

        {/* ================= INTERVIEWS ================= */}
        <Section title="Interviews">
          <ResponsiveGrid
            items={[
              ["Scheduled", data.interviews.scheduled],
              ["Completed", data.interviews.completed],
              ["Cancelled", data.interviews.cancelled],
              ["Pending Today", data.interviews.pendingToday],
            ]}
          />
        </Section>

        {/* ================= PAYMENTS ================= */}
        <Section title="Payments">
          <ResponsiveGrid
            items={[
              ["Total Revenue", `₹${data.payments.totalRevenue}`],
              ["This Month", `₹${data.payments.thisMonth}`],
              ["Successful", data.payments.successful],
              ["Failed", data.payments.failed],
            ]}
          />
        </Section>

        {/* ================= SYSTEM ================= */}
        <Section title="System Health">
          <ResponsiveGrid
            items={[
              ["Errors (24h)", data.system.errorsLast24h],
              ["Critical Errors", data.system.criticalErrors],
            ]}
          />
        </Section>

      </div>
    </section>
  );
};

/* ================= UI HELPERS ================= */

const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    {children}
  </h2>
);

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-5">
    <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-4">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);

const ResponsiveGrid = ({ items }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {items.map(([label, value], i) => (
      <div
        key={i}
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
      >
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    ))}
  </div>
);

const Metric = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default Analytics;
