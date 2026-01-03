import { useEffect, useState } from "react";
import api from "../../services/api";
import { updateInterviewStatus } from "../../services/interviewService";
import { Link } from "react-router-dom";

export default function TeacherInterviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    api.get("/interviews/teacher").then((res) => {
      setInterviews(res.data.interviews);
    });
  }, []);

  const confirmInterview = async (id) => {
    await updateInterviewStatus(id, "confirmed");
    alert("Interview confirmed");
  };

  const completeInterview = async (id) => {
    await updateInterviewStatus(id, "completed");
    alert("Interview completed");
  };

  return (
    <div>
      <h2>My Interviews</h2>

      {interviews.map((i) => (
        <div key={i._id} style={{ border: "1px solid #ccc", margin: "10px" }}>
          <p>Status: {i.status}</p>

          {i.status === "pending" && (
            <button onClick={() => confirmInterview(i._id)}>
              Confirm
            </button>
          )}

          {i.status === "confirmed" && (
            <button onClick={() => completeInterview(i._id)}>
              Complete
            </button>
          )}

          {i.status === "completed" && (
            <Link to={`/teacher/feedback/${i._id}`}>
              Give Feedback
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
