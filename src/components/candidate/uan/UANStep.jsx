import React, { useState } from "react";
import axios from "axios";
import { ArrowRight, Hash } from "lucide-react";

function UANStep({ onNext }) {
  const [step, setStep] = useState("question");
  const [uanNumber, setUanNumber] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSkip = async () => {
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/uan`, { has_uan: false, uan_number: null });
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert("Failed to save UAN details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (uanNumber.trim().length !== 12) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/uan`, { has_uan: true, uan_number: uanNumber });
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save UAN details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-blue-900 text-2xl font-bold">
          Universal Account Number (UAN)
        </h2>
      </div>

      {step === "question" && (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-blue-100/50 shadow-inner">
             <Hash className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-2xl font-semibold text-[#05058D] mb-2 text-center">
            Do You Have A UAN Number?
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-md text-sm leading-relaxed">
            Universal Account Number is used for Provident Fund tracking. Providing it helps create a much stronger verification profile for your background check.
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => setStep("input")}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-[#05058D] text-white rounded-xl hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 font-medium text-sm"
            >
              Yes, I have
            </button>
            <button
              onClick={handleSkip}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 font-medium text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : <>No, skip <ArrowRight className="w-4 h-4 ml-1" /></>}
            </button>
          </div>
        </div>
      )}

      {step === "input" && (
        <div className="mt-8 flex-1">
           <p className="text-gray-600 mb-6 text-sm">
             Please enter your 12-digit Universal Account Number below.
           </p>

           <div className="max-w-md">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               UAN Number <span className="text-red-500">*</span>
             </label>
             <input
               type="text"
               value={uanNumber}
               maxLength={12}
               onChange={(e) => {
                 const val = e.target.value.replace(/\D/g, "");
                 setUanNumber(val);
                 if (error) setError(false);
               }}
               placeholder="Enter 12-digit UAN"
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
             />
             {error && (
               <p className="text-red-500 text-sm mt-2">Please enter exactly 12 digits.</p>
             )}
           </div>

           <div className="mt-10 flex gap-4">
             <button
               onClick={handleSubmit}
               disabled={loading}
               className="bg-[#05058D] text-white px-10 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 text-sm"
             >
               {loading ? "Saving..." : "Submit"}
             </button>
             <button
               onClick={() => setStep("question")}
               className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition text-sm"
             >
               Back
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default UANStep;
