import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { otpSetter } from "../store/slices/detailsSlice";
import "./css/Login.css"

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const details = useSelector((state) => state.details);

  const [step, setStep] = useState(3);

  // ===== Form Fields =====
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("STUDENT");

  // ===== Error =====
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // ================= STEP 1: SEND OTP =================
  const sendOTP = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Enter a valid email address");

    try {
      const res = await axios.post(`${apiUrl}/send-email`, { email });
      dispatch(otpSetter(res.data.otp));
      setStep(2);
    } catch {
      setError("Failed to send OTP");
    }
  };

  // ================= STEP 2: VERIFY OTP =================
  const verifyOTP = () => {
    setError("");

    if (!otp) return setError("OTP is required");
    if (otp.length !== 6) return setError("OTP must be 6 digits");

    if (details.otp == otp) {
      setStep(3);
    } else {
      setError("Invalid OTP");
    }
  };

  // ================= STEP 3: REGISTER =================
   const createAccount = async() => {
    // setError("");

    // if (!name) return setError("Full name is required");
    // if (!phone) return setError("Phone number is required");
    // if (!/^[0-9]{10}$/.test(phone))
    //   return setError("Phone number must be 10 digits");

    // if (!password) return setError("Password is required");
    // if (password.length < 6)
    //   return setError("Password must be at least 6 characters");

    // const payload = { name, email, phone, password, role };
    // console.log("REGISTER PAYLOAD:", payload);

    // // call /api/auth/register later

    // await axios.post(`${apiUrl}/api/auth/register`, payload)
    //   .then((res) => {
    //     localStorage.setItem("token", res.data.token);
    //     localStorage.setItem("user", JSON.stringify(res.data.user));
    //     // redirect later
    //     navigate("/home");
    //   })
    //   .catch((err) => {
    //     setError(err.response?.data?.message || "Registration failed");
    //   }); 
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/images/logo.jpg" className="auth-logo" alt="logo" />

        {error && <p className="error">{error}</p>}

        {/* ===== STEP 1 ===== */}
        {step === 1 && (
          <>
            <h2 className="auth-title">Verify your email</h2>

            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn" onClick={sendOTP}>
              Send OTP
            </button>
          </>
        )}

        {/* ===== STEP 2 ===== */}
        {step === 2 && (
          <>
            <h2 className="auth-title">Enter OTP</h2>

            <input
              className="input"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="btn" onClick={verifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {/* ===== STEP 3 ===== */}
        {step === 3 && (
          <>
            <h2 className="auth-title">Create Account</h2>

            <input
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="input"
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn" onClick={createAccount}>
              Create Account
            </button>
          </>
        )}

        {/* 🔹 GO TO LOGIN */}
        <button
          className="btn btn-secondary"
          style={{ marginTop: "12px" }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default Register;
