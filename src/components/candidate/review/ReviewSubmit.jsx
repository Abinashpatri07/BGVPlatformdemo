import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewContent from "./ReviewContent";
import SuccessModal from "./SuccessModal";

function ReviewSubmit({ onSubmit }) {
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Fetch candId dynamically
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch candidate details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!checked) return;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/final`, { cand_id: candId });
      
      // show popup
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to finally submit details. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm overflow-hidden h-[85vh] max-h-[800px] flex flex-col border border-gray-100">

        {/* Header */}
        <div className="p-6 bg-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-900">
              Review & Submit
            </h2>
          </div>

          <div className="border border-blue-100 bg-blue-50/50 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium">
            Please Review All Sections Before Final Submission.
          </div>
        </div>

        {/* Scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-2 bg-gray-50/30">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 font-medium">Loading your details...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : (
            <ReviewContent candidateData={data} />
          )}
        </div>

        {/* Bottom */}
        <div className="bg-white py-4 px-6 border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
          
          <label className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="w-4 h-4 accent-[#05058D]"
            />
            <span className="font-medium">Click Here To Confirm That You Have Reviewed Your Details.</span>
          </label>

          <div className="flex justify-center mb-2">
            <button
              onClick={handleSubmit}
              disabled={!checked}
              className={`px-10 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                checked
                  ? "bg-[#05058D] text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit Details
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Popup */}
      {showModal && (
        <SuccessModal 
          onClose={() => {
            setShowModal(false);
            if (onSubmit) onSubmit();
          }} 
        />
      )}
    </>
  );
}

export default ReviewSubmit;