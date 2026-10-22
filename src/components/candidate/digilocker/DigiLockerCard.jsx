import { useState } from "react";
import { ShieldCheck, Zap, Loader2 } from "lucide-react";
import axiosInstance from "../../../API/axiosInstance";

export default function DigiLockerCard({ onClick, loading = false }) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (onClick) {
      onClick();
      return;
    }

    // Direct fallback if onClick not passed
    try {
      setInternalLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || user.id || 1;
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axiosInstance.post(`${API_BASE}/api/candidate/ekyc/digilocker/initiate`, {
        cand_id: candId
      });

      if (res.data?.success && res.data?.authUrl) {
        if (res.data.state) {
          sessionStorage.setItem("digilocker_state", res.data.state);
        }
        sessionStorage.setItem("digilocker_cand_id", String(candId));
        window.location.assign(res.data.authUrl);
      }
    } catch (err) {
      console.error("Direct trigger error:", err);
      alert("Failed to initiate DigiLocker. Please check backend.");
    } finally {
      setInternalLoading(false);
    }
  };

  const isLoading = loading || internalLoading;

  return (
    <div
      onClick={handleClick}
      className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-105 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
    >

      {/* Recommended badge */}
      <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full">
        Recommended
      </div>

      <div>
        {/* DigiLocker logo area */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="8" width="18" height="14" rx="3" fill="#6366F1" />
              <path d="M8 8V6a4 4 0 018 0v2" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="15" r="2" fill="white" />
              <rect x="10" y="16" width="2" height="3" rx="1" fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-indigo-600 font-bold text-lg leading-none">DigiLocker</p>
            <p className="text-gray-400 text-[11px]">Your documents anytime, anywhere</p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Fetch via DigiLocker
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Securely import your verified documents using government-integrated DigiLocker for faster, paperless processing.
        </p>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ShieldCheck size={18} className="text-green-500 shrink-0" />
            <span>Secure & 256-bit Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Zap size={18} className="text-green-500 shrink-0" />
            <span>Instant Verification Approval</span>
          </div>
        </div>
      </div>

      <div>
        {/* CTA Button */}
        <button
          type="button"
          id="btn-get-started-digilocker"
          onClick={handleClick}
          disabled={isLoading}
          className="w-full bg-[#1E1B8B] hover:bg-[#2d29b3] active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all mt-8 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 text-white" />
              <span>Connecting to DigiLocker...</span>
            </>
          ) : (
            <span>Get Started With DigiLocker</span>
          )}
        </button>

        {/* Trust line */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Trusted digital verification, powered by{" "}
          <span className="text-indigo-500 font-medium">DigiLocker</span>
        </p>
      </div>
    </div>
  );
}