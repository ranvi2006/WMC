import { useState } from "react";
import api from "../../services/api";

const SLOT_DURATION_MINUTES = 30;

export default function Availability() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= ADD SLOT ================= */
  const addSlot = () => {
    if (!date || !startTime) {
      alert("Please select date and start time");
      return;
    }

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);

    const maxEnd = new Date(`${date}T20:00:00`);
    if (end > maxEnd) {
      alert("Slot cannot end after 8:00 PM");
      return;
    }

    const newSlot = {
      startTime: start.toTimeString().slice(0, 5),
      endTime: end.toTimeString().slice(0, 5),
      isBooked: false,
    };

    const exists = slots.some(
      (s) => s.startTime === newSlot.startTime
    );
    if (exists) {
      alert("This slot already exists");
      return;
    }

    setSlots([...slots, newSlot]);
  };

  /* ================= REMOVE SLOT ================= */
  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */
  const saveAvailability = async () => {
    if (!date || slots.length === 0) {
      alert("Please add at least one slot");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/availability", {
        date,
        slots,
      });

      alert("Availability saved successfully");
      setDate("");
      setSlots([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="
        min-h-screen px-4 py-10
        bg-gray-50
        dark:bg-gradient-to-br dark:from-[#050510] dark:via-[#0a0a1a] dark:to-[#050510]
      "
    >
      <div className="max-w-xl mx-auto">

        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Create Availability
        </h2>

        {/* CARD */}
        <div
          className="
            rounded-2xl p-6
            bg-white dark:bg-gradient-to-br dark:from-[#0f1025] dark:to-[#0a0b1d]
            border border-gray-200 dark:border-white/10
            shadow-lg
          "
        >
          {/* DATE */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
            />
          </div>

          {/* START TIME */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Start Time (30 min slot)
            </label>
            <input
              type="time"
              min="09:00"
              max="19:30"
              step="1800"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="
                w-full rounded-xl px-4 py-3 text-sm
                bg-gray-50 dark:bg-[#070814]
                border border-gray-300 dark:border-white/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-purple-600
              "
            />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={addSlot}
            className="
              mb-6 px-5 py-2 rounded-xl
              bg-gradient-to-r from-purple-600 to-indigo-600
              text-white text-sm font-semibold
              shadow-lg shadow-purple-600/30
              hover:opacity-90 transition
            "
          >
            + Add Slot
          </button>

          {/* SLOTS */}
          {slots.length > 0 && (
            <>
              <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Selected Slots
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="
                      flex items-center gap-2
                      px-3 py-1.5 rounded-full text-xs
                      bg-purple-100 text-purple-700
                      dark:bg-purple-500/20 dark:text-purple-300
                    "
                  >
                    {slot.startTime} – {slot.endTime}
                    <button
                      onClick={() => removeSlot(index)}
                      className="
                        text-purple-700 dark:text-purple-300
                        hover:text-red-500 transition
                      "
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* SAVE */}
              <button
                onClick={saveAvailability}
                disabled={loading}
                className="
                  px-6 py-3 rounded-xl
                  bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white text-sm font-semibold
                  shadow-lg shadow-purple-600/30
                  hover:opacity-90 transition
                  disabled:opacity-50
                "
              >
                {loading ? "Saving..." : "Save Availability"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
