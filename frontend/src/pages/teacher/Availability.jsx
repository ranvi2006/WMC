import { useState } from "react";
import api from "../../services/api";

export default function Availability() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([
    { startTime: "10:00", endTime: "10:30" }
  ]);

  const saveAvailability = async () => {
    try {
      await api.post("/availability", { date, slots });
      alert("Availability saved");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving availability");
    }
  };

  return (
    <div>
      <h2>Set Availability</h2>

      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <button onClick={saveAvailability}>Save Availability</button>
    </div>
  );
}
