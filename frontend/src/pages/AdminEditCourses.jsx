import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminEditCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH COURSES ================= */
  const fetchAllCourses = async () => {
    try {
      const res = await api.get("/api/courses");
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Admin fetch courses error:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  /* ================= DELETE COURSE ================= */
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch {
      alert("Failed to delete course");
    }
  };

  /* ================= DELETE ROADMAP ================= */
  const handleDeleteRoadmap = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this roadmap?")) return;

    try {
      await api.delete(`/api/roadmaps/course/${courseId}`);
      alert("Roadmap deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete roadmap");
    }
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin – Manage Courses
        </h1>

        <Link
          to="/admin/courses/create"
          className="inline-flex items-center justify-center
                     bg-blue-700 hover:bg-blue-600
                     text-white px-4 py-2 rounded"
        >
          + Add Course
        </Link>
      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 ? (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded shadow p-6 text-center">
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            No courses found.
          </p>
          <Link
            to="/admin/courses/create"
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col"
            >
              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {course.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {course.description}
              </p>

              {/* META */}
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                <div>
                  <strong>Status:</strong> {course.status}
                </div>
                <div>
                  <strong>Instructor:</strong>{" "}
                  {course.createdBy?.name || "N/A"}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-auto grid grid-cols-2 gap-2 text-sm">

                <Link
                  to={`/courses/${course._id}`}
                  className="border border-gray-300 dark:border-gray-600
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             rounded px-2 py-1 text-center"
                >
                  View
                </Link>

                <Link
                  to={`/admin/courses/edit/${course._id}`}
                  className="bg-blue-700 hover:bg-blue-600
                             text-white rounded px-2 py-1 text-center"
                >
                  Edit
                </Link>

                <Link
                  to={`/instructor/courses/${course._id}/roadmap`}
                  className="bg-indigo-600 hover:bg-indigo-500
                             text-white rounded px-2 py-1 text-center col-span-2"
                >
                  Upload / Replace Roadmap
                </Link>

                <Link
                  to={`/courses/${course._id}/showroadmap`}
                  className="border border-gray-300 dark:border-gray-600
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             rounded px-2 py-1 text-center col-span-2"
                >
                  View Roadmap
                </Link>

                <button
                  onClick={() => handleDeleteRoadmap(course._id)}
                  className="border border-red-500
                             text-red-600 hover:bg-red-50 dark:hover:bg-gray-700
                             rounded px-2 py-1 col-span-2"
                >
                  Delete Roadmap
                </button>

                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="bg-red-600 hover:bg-red-500
                             text-white rounded px-2 py-1 col-span-2"
                >
                  Delete Course
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AdminEditCourses;
