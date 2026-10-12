import { useState } from "react";
import axios from "axios";
import DigiLockerCard from "../digilocker/DigiLockerCard";
import ManualEntryCard from "../digilocker/ManualEntryCard";
import { useNavigate } from "react-router-dom";
import DigiLockerHeader from "../digilocker/DigiLockerHeader";

export default function DigiLockerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const handleDigiLockerFlow = async () => {
    try {
      console.log("Get Started With DigiLocker button clicked! 🚀");
      setLoading(true);
      setErrorMessage("");
      setDebugInfo("⏳ Backend se request ho rahi hai...");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || user.id || 1;

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      setDebugInfo(`⏳ API call: ${API_BASE}/api/candidate/ekyc/digilocker/initiate (cand_id=${candId})`);

      const response = await axios.post(`${API_BASE}/api/candidate/ekyc/digilocker/initiate`, {
        cand_id: candId
      });

      console.log("Initiate response received:", response.data);

      if (response.data?.success && response.data?.authUrl) {
        if (response.data.state) {
          sessionStorage.setItem("digilocker_state", response.data.state);
        }
        sessionStorage.setItem("digilocker_cand_id", String(candId));

        setDebugInfo("✅ DigiLocker URL mili! Ab redirect ho raha hai DigiLocker ke page par...");
        console.log("Redirecting to DigiLocker Auth URL:", response.data.authUrl);
        // Redirect browser to DigiLocker MeriPehchaan Auth Screen
        setTimeout(() => {
          window.location.assign(response.data.authUrl);
        }, 800);
      } else {
        setErrorMessage("Failed to initiate DigiLocker session. Please try again.");
        setDebugInfo("");
      }
    } catch (err) {
      console.error("DigiLocker initiate error:", err);
      const msg = err.response?.data?.message || err.message || "Could not connect to DigiLocker backend.";
      setErrorMessage(`DigiLocker Error: ${msg}. Please ensure backend is running.`);
      setDebugInfo(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EEF0F8] flex flex-col items-center justify-center overflow-hidden px-6 py-12">

      {/* Background blob */}
      <div className="absolute -top-10 -left-10 w-52 h-52 bg-[#C8CCEB] rounded-full opacity-60 pointer-events-none" />

      {/* Header */}
      <DigiLockerHeader />

      {/* Error Message */}
      {errorMessage && (
        <div className="relative z-10 w-full max-w-3xl mt-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl text-center">
          ❌ {errorMessage}
        </div>
      )}

      {/* Debug / Status Info */}
      {debugInfo && (
        <div className="relative z-10 w-full max-w-3xl mt-3 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl text-center font-medium">
          {debugInfo}
        </div>
      )}

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-8">
        
        {/* DigiLocker option (Left Card) */}
        <DigiLockerCard
          onClick={handleDigiLockerFlow}
          loading={loading}
        />

        {/* Manual entry option (Right Card) */}
        <ManualEntryCard
          onStart={() => {
            sessionStorage.setItem("candidate_currentStep", "1");
            sessionStorage.setItem("candidate_highestStep", "1");
            navigate("/verification");
          }}
        />
      </div>

      {/* Bottom text */}
      <p className="relative z-10 text-xs text-gray-900 mt-10 text-center">
        Your Data Is{" "}
        <span className="underline">सुरक्षित (Safe)</span>{" "}
        And End-To-End Encrypted
      </p>
    </div>
  );
}