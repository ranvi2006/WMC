import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFounder, setIsFounder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/admin/users");
        setUsers(res.data.users);
        setIsFounder(res.data.isFounder);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= UPDATE ROLE ================= */
  const handleRoleChange = async (userId, role) => {
    try {
      const res = await api.put("/api/admin/users/role", {
        userId,
        role
      });

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, role } : u
          )
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update role"
      );
    }
  };

  /* ================= FILTER ================= */
  const filteredUsers = users
    .filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      roleFilter === "all" ? true : u.role === roleFilter
    );

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading users...
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
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin – Users
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage platform users and roles
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-col sm:flex-row gap-3">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full sm:max-w-sm px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-600
          "
        />

        {/* ROLE FILTER */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            w-full sm:max-w-xs px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-600
          "
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="min-w-full border-collapse">

          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-gray-600 dark:text-gray-300"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="
                    border-t border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-700
                  "
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    {isFounder ? (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                        className="
                          px-2 py-1 rounded
                          bg-white dark:bg-gray-800
                          border border-gray-300 dark:border-gray-600
                          text-gray-900 dark:text-white
                          focus:ring-2 focus:ring-blue-600
                        "
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="capitalize font-medium text-gray-800 dark:text-gray-200">
                        {user.role}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
