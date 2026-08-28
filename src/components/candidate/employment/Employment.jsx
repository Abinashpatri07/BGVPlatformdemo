import React, { useState } from "react";
import { Briefcase, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import EmploymentForm from "./EmploymentForm";
import EmploymentCard from "./EmploymentCard";

function Employment({ onNext }) {
  const [step, setStep] = useState("question");
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append("isInternship", "true");
      
      // Append text fields
      Object.keys(data).forEach(key => {
        if (key !== "certificateFile") {
          formPayload.append(key, data[key]);
        }
      });
      
      // Append file if exists
      if (data.certificateFile) {
        formPayload.append("certificateFile", data.certificateFile);
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/employment`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setFormData(data);
      setStep("submitted");
    } catch (err) {
      console.error("Failed to submit employment", err);
      alert(err.response?.data?.error || "Failed to save employment details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-72 flex flex-col relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-blue-700 mb-2" />
          <p className="text-blue-900 font-medium">Saving Employment Details...</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-blue-900 text-2xl font-bold">
          Employment Details
        </h2>
      </div>

      {step === "question" && (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-blue-100/50 shadow-inner">
             <Briefcase className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-2xl font-semibold text-[#05058D] mb-2 text-center">
            Do you have any Internship experience?
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-md text-sm leading-relaxed">
            Including your internship experience helps create a much stronger verification profile for your background check.
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => setStep("form")}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-[#05058D] text-white rounded-xl hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 font-medium text-sm"
            >
              Yes, I have
            </button>
            <button
              onClick={onNext}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 font-medium text-sm"
            >
              No, skip <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === "form" && (
        <EmploymentForm
          isInternship={true}
          onSubmit={handleSubmit}
        />
      )}

      {step === "submitted" && formData && (
        <EmploymentCard
          data={formData}
          onAddNew={() => setStep("form")}
          onNext={onNext}
        />
      )}
    </div>
  );
}

export default Employment;
