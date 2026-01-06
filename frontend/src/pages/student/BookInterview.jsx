import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import loadRazorpay from "../../utils/loadRazorpay";

const BookInterview = () => {
  const navigate = useNavigate();
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  /* ================= FETCH AVAILABILITY ================= */
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get("/api/availability");
        setAvailability(res.data.availability || []);
      } catch {
        alert("Failed to load availability");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  /* ================= DATES ================= */
  const availableDates = useMemo(() => {
    return [...new Set(availability.map(a => a.date))].sort();
  }, [availability]);

  useEffect(() => {
    if (availableDates.length && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  /* ================= SLOTS ================= */
  const slotsForDate = useMemo(() => {
    return availability
      .filter(a => a.date === selectedDate)
      .flatMap(a =>
        a.slots.map(slot => ({
          ...slot,
          teacherId: a.teacherId._id,
          teacherName: a.teacherId.name,
        }))
      );
  }, [availability, selectedDate]);

  /* ================= PAYMENT ================= */
  const verifyPayment = async (response, paymentId) => {
    try {
      await api.post("/api/payments/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId,
      });

      await api.post("/api/interviews/book", {
        teacherId: selectedSlot.teacherId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        duration: 30,
        paymentId,
      });

      navigate("/student/interviews");
    } catch {
      alert("Payment verification failed");
    } finally {
      setBooking(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return;

    setBooking(true);
    const loaded = await loadRazorpay();
    if (!loaded) return setBooking(false);

    const res = await api.post("/api/payments/create");
    const { orderId, paymentId, amount } = res.data;

    new window.Razorpay({
      key: razorpayKey,
      amount,
      currency: "INR",
      order_id: orderId,
      handler: (response) => verifyPayment(response, paymentId),
      modal: { ondismiss: () => setBooking(false) },
      theme: { color: "#2563eb" },
    }).open();
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading availability…
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto px-4 py-5 text-gray-900 dark:text-gray-100">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-4">
        Book an Interview
      </h2>

      {/* DATE SELECTOR */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableDates.map(date => (
          <button
            key={date}
            onClick={() => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
            className={`
              px-3 py-1.5 text-xs font-semibold rounded-md border
              ${date === selectedDate
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-900 text-white border-gray-700 hover:border-blue-500"}
            `}
          >
            {date}
          </button>
        ))}
      </div>

      {/* SLOTS */}
      <h3 className="text-sm font-semibold mb-3">
        Available Slots
      </h3>

      {slotsForDate.length === 0 ? (
        <p className="text-xs text-gray-500">
          No slots available
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {slotsForDate.map(slot => {
            const isBooked = slot.isBooked;
            const isSelected = selectedSlot?._id === slot._id;

            return (
              <button
                key={slot._id}
                disabled={isBooked}
                onClick={() => setSelectedSlot(slot)}
                className={`
                  relative px-3 py-2 rounded-md border text-center transition
                  
                  ${isBooked && `
                    bg-[repeating-linear-gradient(
                      45deg,
                      #1f2937,
                      #1f2937 6px,
                      #111827 6px,
                      #111827 12px
                    )]
                    border-gray-600
                    cursor-not-allowed
                    opacity-70
                  `}

                  ${!isBooked && isSelected && `
                    bg-blue-600 text-white border-blue-600
                  `}

                  ${!isBooked && !isSelected && `
                    bg-gray-900 text-white border-gray-700
                    hover:border-blue-500
                  `}
                `}
              >
                {/* TIME */}
                <div className="text-sm font-semibold">
                  {slot.startTime}
                </div>

                {/* TEACHER */}
                <div className="text-[11px] opacity-80">
                  {slot.teacherName}
                </div>

                {/* BOOKED BADGE */}
                {isBooked && (
                  <span className="
                    absolute top-1 right-1
                    text-[10px] font-semibold
                    bg-red-600 text-white
                    px-1.5 py-0.5 rounded
                  ">
                    BOOKED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* SELECTED SUMMARY */}
      {selectedSlot && (
        <div className="mt-4 text-xs text-gray-300">
          Selected: <strong>{selectedSlot.startTime}</strong> with{" "}
          <strong>{selectedSlot.teacherName}</strong>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleBook}
          disabled={!selectedSlot || booking}
          className="
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white text-sm font-semibold
            px-5 py-2 rounded-md
            shadow-md shadow-blue-500/30
            hover:from-blue-500 hover:to-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          {booking ? "Processing…" : "Book ₹9"}
        </button>
      </div>

    </div>
  );
};

export default BookInterview;
