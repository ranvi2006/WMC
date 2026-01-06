import { useEffect, useState } from "react";
import api from "../../services/api";

const CreateSlots = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH TEACHERS ================= */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/api/admin/teachers");
        const list = res.data.teachers || [];
        setTeachers(list);
        setSelectedTeachers(list.map((t) => t._id)); // preselect all
      } catch (err) {
        console.error("Failed to load teachers", err);
      }
    };

    fetchTeachers();
  }, []);

  /* ================= TOGGLE ================= */
  const toggleTeacher = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

  /* ================= CREATE ================= */
  const handleCreateSlots = async () => {
    if (!date) return alert("Select a date");

    const day = new Date(date).getDay();
    if (day === 0) return alert("Sunday is not allowed");

    if (selectedTeachers.length === 0) {
      return alert("Select at least one teacher");
    }

    try {
      setLoading(true);
      await api.post("/api/availability/admin-create", {
        teacherIds: selectedTeachers,
        date,
      });
      alert("Slots created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create slots");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-6">

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create Interview Slots
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Select teachers and a date to generate interview slots
        </p>

        {/* TEACHERS */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Select Teachers
          </h4>

          {teachers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No teachers found
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teachers.map((t) => (
                <label
                  key={t._id}
                  className="flex items-center gap-3
                             bg-gray-50 dark:bg-gray-900
                             border border-gray-300 dark:border-gray-700
                             rounded px-3 py-2 cursor-pointer
                             hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(t._id)}
                    onChange={() => toggleTeacher(t._id)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-800 dark:text-gray-200">
                    {t.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* DATE */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Select Date
          </h4>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded border
                       border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-900
                       text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* ACTION */}
        <button
          onClick={handleCreateSlots}
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-600
                     text-white px-6 py-2 rounded font-medium
                     disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Slots"}
        </button>

      </div>
    </div>
  );
};

export default CreateSlots;
