import React, { useState } from "react";
import axios from "axios";

function UANStep({ onNext }) {
  const [selected, setSelected] = useState("");
  const [uanNumber, setUanNumber] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const questionData = {
    question: "Do You Have A UAN Number?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  };

  const handleSelect = (value) => {
    setSelected(value);
    setUanNumber("");
    setError(false);
  };

  const handleSubmit = async () => {
    if (!selected) {
      setError(true);
      return;
    }

    if (selected === "yes" && !uanNumber.trim()) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      // API call to save UAN number would go here.
      // E.g., await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/submit/uan`, { has_uan: selected === "yes", uan_number: uanNumber });
      
      if (onNext) onNext();
    } catch (err) {
      console.error("Failed to save UAN", err);
      alert("Failed to save UAN details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#01026E] mb-2">
            Universal Account Number (UAN)
          </h2>
          <p className="text-gray-500 text-sm">
            Please provide your UAN details for verification
          </p>
        </div>
      </div>

      <h3 className="mt-12 text-2xl font-medium text-[#05058D]">
        {questionData.question}
      </h3>

      <div className="mt-8 space-y-5">
        {questionData.options.map((item) => (
          <label
            key={item.value}
            className="flex items-center gap-4 cursor-pointer"
          >
            <input
              type="radio"
              name="uan-check"
              checked={selected === item.value}
              onChange={() => handleSelect(item.value)}
              className="h-5 w-5 accent-[#05058D]"
            />
            <span className="text-lg text-gray-900">
              {item.label}
            </span>
          </label>
        ))}
      </div>

      {selected === "yes" && (
        <div className="mt-8 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={uanNumber}
            onChange={(e) => {
              setUanNumber(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Enter 12-digit UAN"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <span>Please provide the required information.</span>
        </div>
      )}

      <div className="mt-12">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#01026E] text-white px-10 py-3 rounded-xl font-medium hover:bg-blue-900 transition shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Next"}
        </button>
      </div>
    </div>
  );
}

export default UANStep;
