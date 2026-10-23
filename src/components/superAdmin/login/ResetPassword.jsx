import { API_BASE_URL } from "../../../API/config.js";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    setSuccessMsg("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { token, email, newPassword }
      );

      setSuccessMsg(response.data.message);
      setError("");

      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/super-admin/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
      setSuccessMsg("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EEF0F8] flex items-center justify-center overflow-hidden">

      {/* Top-right circle — outline only, partially cut off */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-28 border-[#C8CCEB]" />

      {/* Bottom-left organic blob */}
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#C8CCEB] rounded-[60%_40%_40%_60%/40%_40%_60%_60%]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-8 text-center">

        {/* Heading */}
        <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900 mb-3">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Enter your new password below.
        </p>

        {/* New Password */}
        <div className="text-left mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
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

        {/* Confirm Password */}
        <div className="text-left mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}

          {/* Success */}
          {successMsg && (
            <p className="text-green-500 text-xs mt-1">{successMsg}</p>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white text-sm font-medium py-3 rounded-lg transition-all mt-3 disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Back to login */}
        <p
          onClick={() => navigate("/super-admin/login")}
          className="text-center text-xs text-gray-400 hover:text-indigo-500 cursor-pointer mt-6 transition-colors"
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
}
