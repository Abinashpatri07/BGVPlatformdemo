import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VendorForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered POC email address.");
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
      const res = await axios.post(`${API_BASE}/api/vendor/auth/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message || "Password reset link has been sent to your email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please check your email and try again.");
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
            Vendor Password Reset
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your registered vendor POC email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMsg ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Check your email</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {successMsg}
            </p>
            <button
              onClick={() => navigate("/vendor/login")}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vendor Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="vendor@company.com"
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-60 text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                to="/vendor/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Vendor Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
