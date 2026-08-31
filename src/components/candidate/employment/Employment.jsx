import React, { useState } from "react";
import { Briefcase, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import EmploymentForm from "./EmploymentForm";
import EmploymentCard from "./EmploymentCard";

function Employment({ onNext }) {
  const [step, setStep] = useState("question");
  const [employments, setEmployments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  React.useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/1`);
        if (response.data && response.data.employment && response.data.employment.length > 0) {
          const mappedEmployments = response.data.employment.map(emp => ({
            companyName: emp.cand_emp_company || "",
            employeeId: emp.cand_emp_empid || "",
            designation: emp.cand_emp_designation || "",
            fromDate: emp.cand_emp_from_date ? new Date(emp.cand_emp_from_date).toISOString().split('T')[0] : "",
            toDate: emp.cand_emp_to_date ? new Date(emp.cand_emp_to_date).toISOString().split('T')[0] : "",
            isInternship: emp.cand_emp_type === "Internship",
            // Note: certificateFile path exists in DB, but we don't load the actual File object back.
            // The backend handles NULL path updates gracefully.
          }));
          setEmployments(mappedEmployments);
          setStep("submitted");
        }
      } catch (err) {
        console.error("Error fetching existing employment:", err);
      }
    };
    fetchExistingData();
  }, []);

  const handleAddEmployment = (data) => {
    if (editingIndex !== null) {
      const updated = [...employments];
      updated[editingIndex] = data;
      setEmployments(updated);
      setEditingIndex(null);
    } else {
      setEmployments([...employments, data]);
    }
    setStep("submitted");
  };

  const handleEditEmployment = (index) => {
    setEditingIndex(index);
    setStep("form");
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append("cand_id", 1);
      formPayload.append("isInternship", "false");
      
      const employmentData = [];
      
      employments.forEach((emp, index) => {
        // Clone without the file for JSON payload
        const empDetails = { ...emp };
        delete empDetails.certificateFile;
        employmentData.push(empDetails);
        
        if (emp.certificateFile) {
          formPayload.append(`certificateFile_${index}`, emp.certificateFile);
        }
      });
      
      formPayload.append("employmentData", JSON.stringify(employmentData));

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/employment`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (onNext) onNext();
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

      {step === "question" && employments.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-blue-100/50 shadow-inner">
             <Briefcase className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-2xl font-semibold text-[#05058D] mb-2 text-center">
            Do you have any Employment experience?
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-md text-sm leading-relaxed">
            Including your employment experience helps create a much stronger verification profile for your background check.
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => setStep("form")}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-[#05058D] text-white rounded-xl hover:bg-blue-800 transition-all duration-300 font-medium text-sm"
            >
              Yes, I have
            </button>
            <button
              onClick={onNext}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium text-sm"
            >
              No, skip <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {step === "form" && (
        <EmploymentForm
          isInternship={false}
          initialData={editingIndex !== null ? employments[editingIndex] : null}
          onSubmit={handleAddEmployment}
        />
      )}

      {step === "submitted" && employments.length > 0 && (
        <EmploymentCard
          employments={employments}
          onAddNew={() => {
            setEditingIndex(null);
            setStep("form");
          }}
          onEdit={handleEditEmployment}
          onFinalSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}

export default Employment;
