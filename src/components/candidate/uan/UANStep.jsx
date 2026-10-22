import { API_BASE_URL } from "../../../API/config.js";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../API/axiosInstance";
import { ArrowRight, Hash, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function UANStep({ onNext }) {
  const [step, setStep] = useState(() => {
    return sessionStorage.getItem("candidate_uan_step") || "question";
  });
  const [uanNumber, setUanNumber] = useState(() => {
    return sessionStorage.getItem("candidate_uan_number") || "";
  });
  const [isUploaded, setIsUploaded] = useState(() => {
    return sessionStorage.getItem("candidate_uan_saved") === "true";
  });
  const [loadingExisting, setLoadingExisting] = useState(() => {
    return !sessionStorage.getItem("candidate_uan_step");
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = API_BASE_URL;
        const response = await axiosInstance.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        
        if (response.data) {
          const empUan = response.data.employment?.find(e => e.cand_emp_uan_number)?.cand_emp_uan_number;
          const idUan = response.data.idDocs?.find(d => d.uan_number)?.uan_number;
          const foundUan = empUan || idUan;

          if (foundUan) {
            setUanNumber(foundUan);
            setStep("input");
            setIsUploaded(true);
            sessionStorage.setItem("candidate_uan_step", "input");
            sessionStorage.setItem("candidate_uan_number", foundUan);
            sessionStorage.setItem("candidate_uan_saved", "true");
          } else if (sessionStorage.getItem("candidate_uan_step") === "skipped") {
            setStep("skipped");
          }
        }
      } catch (err) {
        console.error("Error fetching UAN records:", err);
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchExisting();
  }, []);

  const handleSkip = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const API_BASE = API_BASE_URL;
      
      await axiosInstance.post(`${API_BASE}/api/candidate/submit/uan`, { 
        cand_id: candId,
        has_uan: false, 
        uan_number: null 
      });

      setStep("skipped");
      setIsUploaded(false);
      setUanNumber("");
      sessionStorage.setItem("candidate_uan_step", "skipped");
      sessionStorage.removeItem("candidate_uan_number");
      sessionStorage.removeItem("candidate_uan_saved");

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
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const API_BASE = API_BASE_URL;

      await axiosInstance.post(`${API_BASE}/api/candidate/submit/uan`, { 
        cand_id: candId,
        has_uan: true, 
        uan_number: uanNumber 
      });

      setIsUploaded(true);
      sessionStorage.setItem("candidate_uan_step", "input");
      sessionStorage.setItem("candidate_uan_number", uanNumber);
      sessionStorage.setItem("candidate_uan_saved", "true");

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
        <div>
          <h2 className="text-[#05058D] text-2xl font-bold">
            Universal Account Number (UAN)
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Provident Fund verification & tracking
          </p>
        </div>
      </div>

      {loadingExisting ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">Checking UAN details...</p>
        </div>
      ) : (
        <>
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
                  onClick={() => {
                    setStep("input");
                    sessionStorage.setItem("candidate_uan_step", "input");
                  }}
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

          {step === "skipped" && (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                <Hash className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No UAN Number Provided</h3>
              <p className="text-gray-500 mb-6 text-sm text-center max-w-md">
                You previously skipped UAN verification. If you have a 12-digit Universal Account Number to provide, click below.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep("input");
                    sessionStorage.setItem("candidate_uan_step", "input");
                  }}
                  className="px-6 py-2.5 bg-[#05058D] text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition shadow-sm"
                >
                  + Add UAN Number
                </button>
                <button
                  onClick={onNext}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Continue →
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
                <div className="relative">
                  <input
                    type="text"
                    value={uanNumber}
                    maxLength={12}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setUanNumber(val);
                      if (error) setError(false);
                      if (val.length !== 12) {
                        setIsUploaded(false);
                        sessionStorage.removeItem("candidate_uan_saved");
                      }
                    }}
                    placeholder="Enter 12-digit UAN"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm tracking-wider font-mono ${
                      isUploaded ? "border-emerald-500 bg-emerald-50/20" : "border-gray-200"
                    }`}
                  />
                  {isUploaded && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                </div>

                {/* Status indicator below the field */}
                {isUploaded ? (
                  <p className="text-emerald-600 text-xs font-semibold mt-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Uploaded successfully
                  </p>
                ) : error ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> Please enter exactly 12 digits.
                  </p>
                ) : (
                  <p className="text-gray-400 text-xs mt-1.5">
                    Universal Account Number must be exactly 12 numeric digits
                  </p>
                )}
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#05058D] text-white px-10 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 text-sm flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : isUploaded ? (
                    "Save & Continue"
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  onClick={() => {
                    setStep("question");
                    sessionStorage.setItem("candidate_uan_step", "question");
                  }}
                  className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UANStep;
