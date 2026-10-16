import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ClientForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email.");
      setSuccessMsg("");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      setSuccessMsg("");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/client-admin/auth/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message || "Password reset link has been sent to your email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EEF0F8] flex items-center justify-center overflow-hidden px-4">
      {/* Background shapes */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-28 border-[#C8CCEB]" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#C8CCEB] rounded-[60%_40%_40%_60%/40%_40%_60%_60%]" />

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/60">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <Mail className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Client Admin Password Reset
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your registered email address and we'll send you a link to set or reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Email Sent!</p>
              <p className="text-sm text-emerald-700 mt-1">{successMsg}</p>
              <p className="text-xs text-emerald-600 mt-2">
                Check your inbox (and spam folder) for the reset link.
              </p>
            </div>
          </div>
        )}

        {!successMsg ? (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-indigo-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                setSuccessMsg("");
                setEmail("");
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
            >
              Resend with another email
            </button>
          </div>
        )}

        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={16} />
            Back to Client Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
