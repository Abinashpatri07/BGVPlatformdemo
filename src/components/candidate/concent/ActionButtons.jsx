import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ActionButtons() {
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const submitConsent = async (latitude, longitude) => {
    try {
      // Calling the backend API. Using dummy cand_id 1 for now as requested in other files.
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_BASE}/api/candidate/submit/consent`, {
        cand_id: 1,
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
          console.error("Location error:", error);
          alert("Location access is required to submit your consent. Please allow location permissions in your browser.");
          setIsSubmitting(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 flex items-center justify-between px-6 py-4 rounded-xl">
      
      {/* Left: Checkbox + Text */}
      <div className="flex items-start gap-3 max-w-2xl">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 w-4 h-4 accent-indigo-600"
          disabled={isSubmitting}
        />

        <p className="text-sm text-gray-600 leading-relaxed">
          By selecting <span className="font-medium">‘Yes, I agree’</span>, you consent to sign the
          authorization form and confirm that the information provided is
          accurate to the best of your knowledge.
        </p>
      </div>

      {/* Button */}
      <button
        onClick={handleAgree}
        disabled={!checked || isSubmitting}
        className={`px-5 py-2 rounded-lg text-[13px] text-white font-medium whitespace-nowrap shrink-0 transition ${
          checked && !isSubmitting
            ? "bg-indigo-700 hover:bg-indigo-800"
            : "bg-gray-400 cursor-not-allowed opacity-80"
        }`}
      >
        {isSubmitting ? "Processing..." : "Yes, I Agree"}
      </button>
    </div>
  );
}