import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function DigiLockerCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("processing"); // "processing" | "success" | "error"
  const [message, setMessage] = useState("Fetching verified documents from DigiLocker...");
  const [candidateInfo, setCandidateInfo] = useState(null);

  useEffect(() => {
    const exchangeToken = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state") || sessionStorage.getItem("digilocker_state");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || "DigiLocker verification was cancelled or failed.");
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Invalid callback: Authorization code missing.");
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = sessionStorage.getItem("digilocker_cand_id") || user.cand_id || user.id || 1;

        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const res = await axios.post(`${API_BASE}/api/candidate/ekyc/digilocker/token`, {
          code,
          state,
          cand_id: Number(candId)
        });

        if (res.data?.success) {
          setStatus("success");
          setMessage("Identity & Address verified successfully via DigiLocker!");
          setCandidateInfo(res.data.data);

          // Mark verification in session
          sessionStorage.setItem("candidate_digilocker_verified", "true");
          sessionStorage.setItem("candidate_currentStep", "1");
          sessionStorage.setItem("candidate_highestStep", "2");

          // Automatically navigate to verification page after 2.5 seconds
          setTimeout(() => {
            navigate("/verification");
          }, 2500);
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Failed to complete verification.");
        }
      } catch (err) {
        console.error("Token exchange failed:", err);
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
          "Could not exchange token with DigiLocker. Please try manual entry."
        );
      }
    };

    exchangeToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#EEF0F8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full p-8 text-center">

        {/* PROCESSING */}
        {status === "processing" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verifying with DigiLocker</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
            <div className="pt-2 text-xs text-gray-400">
              Connecting securely to Government eKYC Gateway...
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verification Complete!</h2>
            <p className="text-sm text-gray-600">{message}</p>

            {candidateInfo && (
              <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 text-xs space-y-1 mt-4">
                <p><span className="text-gray-400 font-medium">Name:</span> <strong className="text-gray-800">{candidateInfo.name}</strong></p>
                {candidateInfo.dob && <p><span className="text-gray-400 font-medium">DOB:</span> <strong className="text-gray-800">{candidateInfo.dob}</strong></p>}
                {candidateInfo.gender && <p><span className="text-gray-400 font-medium">Gender:</span> <strong className="text-gray-800">{candidateInfo.gender === 'M' ? 'Male' : candidateInfo.gender === 'F' ? 'Female' : candidateInfo.gender}</strong></p>}
                <p><span className="text-gray-400 font-medium">Aadhaar Status:</span> <span className="text-green-600 font-semibold">Verified ✅</span></p>
              </div>
            )}

            <button
              onClick={() => navigate("/verification")}
              className="w-full bg-[#1E1B8B] hover:bg-[#2d29b3] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
            >
              <span>Continue to Verification Steps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-sm text-red-600">{message}</p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => navigate("/digilocker")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem("candidate_currentStep", "1");
                  navigate("/verification");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                Continue with Manual Entry
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
