import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../services/enrollmentService";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data?.data || []);
      } catch (err) {
        console.error("Enrollment fetch error:", err);
        setError("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="py-16 text-center text-sm text-red-600 dark:text-red-400">
        {error}
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
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Here are the courses you are currently enrolled in
          </p>
        </div>

        {/* EMPTY */}
        {enrollments.length === 0 ? (
          <div
            className="
              max-w-md mx-auto text-center
              bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
              border border-gray-200 dark:border-white/10
              rounded-2xl p-6 shadow-lg
            "
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have not enrolled in any courses yet.
            </p>
            <Link
              to="/courses"
              className="
                px-6 py-2 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-purple-600 to-indigo-600
                text-white shadow-lg shadow-purple-600/30
                hover:opacity-90 transition
              "
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => (
              <div
                key={item._id}
                className="
                  rounded-2xl p-5
                  bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
                  border border-gray-200 dark:border-white/10
                  shadow-lg
                  flex flex-col
                "
              >
                {/* TITLE */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.courseId?.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {item.courseId?.description}
                </p>

                {/* META */}
                <p className="text-xs text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Status:</strong> {item.status}
                </p>

                {/* ACTION */}
                <div className="mt-auto">
                  <Link
                    to={`/courses/${item.courseId?._id}`}
                    className="
                      inline-block px-4 py-2 rounded-xl
                      bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white text-xs font-semibold
                      shadow-md shadow-purple-600/30
                      hover:opacity-90 transition
                    "
                  >
                    Go to Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
