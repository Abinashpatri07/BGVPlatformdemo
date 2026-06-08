import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── LOGIN POPUP ─────────────────────────────────────────── */
function LoginPopup({ type, message, onClose }) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden text-center">

        {/* Header */}
        <div
          className={`relative flex items-center justify-center ${
            isSuccess ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ height: "160px" }}
        >
          {/* Concave bottom curve */}
          <div
            style={{
              position: "absolute",
              bottom: "-1px",
              left: "-10%",
              width: "120%",
              height: "50px",
              backgroundColor: "white",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />
          {/* Icon */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "68px",
              height: "68px",
              backgroundColor: "rgba(255,255,255,0.25)",
              borderRadius: "16px",
              marginBottom: "20px",
            }}
          >
            {isSuccess ? (
              /* Checkmark */
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              /* X mark */
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pt-2 pb-8">
          <h2
            className={`text-lg font-bold mb-2 ${
              isSuccess ? "text-green-600" : "text-red-500"
            }`}
          >
            {isSuccess ? "Login Successful!" : "Login Failed"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="border border-red-400 text-red-500 hover:bg-red-50 px-10 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

/* ── SUPER ADMIN LOGIN FORM ──────────────────────────────── */
export default function SuperAdminLoginForm() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup]       = useState(null); // { type, message }

  const handleLogin = () => {
    const dummyEmail    = "superadmin@gmail.com";
    const dummyPassword = "123456";

    if (!email || !password) {
      setPopup({ type: "error", message: "Please enter email and password." });
      return;
    }

    if (email === dummyEmail && password === dummyPassword) {
      localStorage.clear();
      localStorage.setItem("role", "super-admin");
      localStorage.setItem(
        "user",
        JSON.stringify({ name: "Dhiren mukharji", email: "superadmin@gmail.com", role: "Super Admin" })
      );
      setPopup({ type: "success", message: "Welcome back, Dhiren mukharji!" });
      setTimeout(() => navigate("/super-admin/home"), 1500);
    } else if (email === dummyEmail && password !== dummyPassword) {
      setPopup({ type: "error", message: "Incorrect password. Please try again." });
    } else {
      setPopup({ type: "error", message: "Invalid email or password." });
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm px-8">

      {/* POPUP */}
      {popup && (
        <LoginPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Heading */}
      <h1 className="text-4xl font-black text-center tracking-widest uppercase text-gray-900 mb-1">
        Welcome
      </h1>

      <p className="text-center text-sm text-gray-500 mb-8">
        Super Admin Login Portal
      </p>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Password */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Remember + Forgot */}
      <div className="flex justify-between items-center mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" />
          Remember me
        </label>
        <button
          onClick={() => navigate("/super-admin/forgot-password")}
          className="text-sm text-gray-500 hover:text-indigo-600"
        >
          Forgot password
        </button>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white py-3 rounded-lg font-medium"
      >
        Log in
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-10">
        Need help?{" "}
        <span className="text-indigo-500 cursor-pointer hover:underline">
          Contact Support
        </span>
      </p>

    </div>
  );
}