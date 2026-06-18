import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── LOGIN POPUP ─────────────────────────────────────────── */
function LoginPopup({ type, message, onClose }) {
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
          <span className="font-bold">{isSuccess ? "Login Successful!" : "Login Failed"}</span>
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