import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  updateCourse,
} from "../services/courseService";
import "../styles/EditSingleCourse.css";

const AdminSingleEditCourse= () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    language: "English",
    price: 0,
    status: "draft",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        setForm(res.data.data);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    title: form.title,
    description: form.description,
    category: form.category,
    level: form.level,
    language: form.language,
    price: form.price,
    status: form.status,
  };

  try {
    setSaving(true);
    await updateCourse(courseId, payload);
    navigate("/admin/courses");
  } catch (err) {
    setError(err.response?.data?.message || "Update failed");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p className="container">Loading course...</p>;
  if (error) return <p className="container error">{error}</p>;

  return (
    <div className="container edit-single-course">
      <div className="page-header">
        <h1>Edit Course</h1>
      </div>

      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Level</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Language</label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AdminSingleEditCourse;
