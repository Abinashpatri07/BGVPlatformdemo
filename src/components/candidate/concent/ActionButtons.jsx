import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../API/axiosInstance";

export default function ActionButtons({ consentRead = false }) {
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitConsent = async (latitude, longitude) => {
    try {
      // Calling the backend API. Using dummy cand_id 1 for now as requested in other files.
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axiosInstance.post(`${API_BASE}/api/candidate/submit/consent`, {
        cand_id: candId,
        client_id: 1,
        latitude,
        longitude
      });

      // Consent (Step 0) complete hone par usko green rakhne ke liye
      try {
        const saved = sessionStorage.getItem("candidate_completedSteps");
        let steps = saved ? JSON.parse(saved) : [];
        if (!steps.includes(0)) {
          steps.push(0);
          sessionStorage.setItem("candidate_completedSteps", JSON.stringify(steps));
        }
      } catch (e) {}

      navigate("/digilocker");
    } catch (error) {
      console.error(error);
      alert("Failed to save consent to database. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAgree = () => {
    if (!checked || isSubmitting) return;

    setIsSubmitting(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          submitConsent(lat, lon);
        },
        (error) => {
          // Location denied or unavailable — submit without coordinates
          console.warn("Location not available, proceeding without it:", error.message);
          submitConsent(null, null);
        },
        { timeout: 5000 }
      );
    } else {
      // Geolocation not supported — proceed without location
      submitConsent(null, null);
    }
  };

  const isCheckboxDisabled = !consentRead || isSubmitting;
  const isButtonDisabled = !checked || isSubmitting;

  return (
    <div className="mt-10 px-6 py-4 rounded-xl">

      {/* Hint: consent form not yet read */}
      {!consentRead && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-amber-500 text-base">⚠️</span>
          <p className="text-[12px] text-amber-700 leading-snug">
            Please <strong>View</strong> and agree to the consent form above before proceeding.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Left: Checkbox + Text */}
        <div className="flex items-start gap-3 max-w-2xl">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 w-4 h-4 accent-indigo-600"
            disabled={isCheckboxDisabled}
            title={!consentRead ? "Please read and agree to the consent form first" : ""}
          />

          <p className={`text-sm leading-relaxed ${consentRead ? "text-gray-600" : "text-gray-400"}`}>
            By selecting <span className="font-medium">'Yes, I agree'</span>, you consent to sign the
            authorization form and confirm that the information provided is
            accurate to the best of your knowledge.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleAgree}
          disabled={isButtonDisabled}
          className={`px-5 py-2 rounded-lg text-[13px] text-white font-medium whitespace-nowrap shrink-0 transition ${
            !isButtonDisabled
              ? "bg-indigo-700 hover:bg-indigo-800"
              : "bg-gray-400 cursor-not-allowed opacity-80"
          }`}
        >
          {isSubmitting ? "Processing..." : "Yes, I Agree"}
        </button>
      </div>

    </div>
  );
}