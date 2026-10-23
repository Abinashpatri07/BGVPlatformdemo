import { API_BASE_URL } from "../../../API/config.js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API_BASE = API_BASE_URL;

/* ── LOGIN POPUP ─────────────────────────────────────────── */
function LoginPopup({ type, title, message, onClose }) {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-[fadeIn_0.3s_ease-out]">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
        isSuccess ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
      }`}>
        {isSuccess ? (
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <div className="flex flex-col">
          <span className="font-bold">{title || (isSuccess ? "Success!" : "Failed")}</span>
          <span className="text-sm">{message}</span>
        </div>
        {!isSuccess && (
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── CANDIDATE LOGIN FORM ────────────────────────────────── */
export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp]                   = useState("");
  const [step, setStep]                 = useState(1); // 1 = Login, 2 = OTP
  const [popup, setPopup]               = useState(null); // { type, title, message }
  const [isLoading, setIsLoading]       = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setPopup({ type: "success", title: "Logged Out", message: location.state.message });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /* ── Step 1: Email + Password → Send OTP ── */
  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({ type: "error", message: "Please enter email and password." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/candidate/auth/login`, { email, password });

      if (res.data.success && res.data.otpSent) {
        setPopup({ type: "success", title: "OTP Sent!", message: res.data.message });
        setStep(2); // Move to OTP step
      }
    } catch (err) {
      setPopup({
        type: "error",
        title: "Login Failed",
        message: err.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Step 2: Verify OTP → Store token + Navigate ── */
  const handleVerifyOtp = async () => {
    if (!otp) {
      setPopup({ type: "error", title: "Verification Failed", message: "Please enter the OTP." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/candidate/auth/verify-otp`, { email, otp });

      if (res.data.success) {
        localStorage.clear();
        localStorage.setItem("candidateToken", res.data.token);
        localStorage.setItem("role", "candidate");
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setPopup({ type: "success", title: "Login Successful!", message: `Welcome back, ${res.data.user.name}!` });
        setTimeout(() => navigate("/verification"), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid or expired OTP.";
      setPopup({ type: "error", title: "Verification Failed", message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") step === 1 ? handleLogin() : handleVerifyOtp();
  };

  return (
    <div className="relative z-10 w-full max-w-sm px-8">

      {/* POPUP */}
      {popup && (
        <LoginPopup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

      <h1 className="text-4xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
        Welcome
      </h1>
      <p className="text-center text-sm text-gray-500 mb-8">
        Candidate Login Portal
      </p>

      {step === 1 ? (
        <>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
          </div>

          {/* Password */}
          <div className="mb-3 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" />
              Remember me
            </label>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-gray-500 hover:text-indigo-600"
            >
              Forgot password
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Log in"}
          </button>

          
        </>
      ) : (
        <>
          {/* OTP Step */}
          <p className="text-center text-sm text-gray-500 mb-6">
            OTP sent to <span className="font-semibold text-gray-700">{email}</span>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
              Enter the OTP sent to your email
            </label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border rounded-md px-4 py-2.5 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={6}
              autoFocus
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-200 text-white py-3 rounded-lg font-medium mb-3 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={() => { setStep(1); setOtp(""); }}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-700 py-3 rounded-lg font-medium text-sm"
          >
            Back to Login
          </button>
        </>
      )}

    </div>
  );
}