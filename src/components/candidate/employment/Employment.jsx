import React, { useState } from "react";
import { Briefcase, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import EmploymentForm from "./EmploymentForm";
import EmploymentCard from "./EmploymentCard";

function Employment({ onNext }) {
  const [employments, setEmployments] = useState(() => {
    try {
      const saved = sessionStorage.getItem("candidate_employments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [step, setStep] = useState(() => {
    const savedStep = sessionStorage.getItem("candidate_employment_step");
    if (savedStep) return savedStep;
    try {
      const savedEmps = sessionStorage.getItem("candidate_employments");
      if (savedEmps && JSON.parse(savedEmps).length > 0) return "submitted";
    } catch {}
    return "question";
  });

  const [loadingExisting, setLoadingExisting] = useState(() => {
    return !sessionStorage.getItem("candidate_employment_step");
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isInternshipCandidate, setIsInternshipCandidate] = useState(false);

  React.useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        
        // Determine if candidate is fresher based on candidate_experience
        if (response.data && response.data.basicInfo) {
          const exp = response.data.basicInfo.candidate_experience;
          if (exp === 0 || exp === "0" || exp === 1 || exp === "1" || (typeof exp === 'string' && exp.toLowerCase() === 'fresher')) {
            setIsInternshipCandidate(true);
          }
        }

        if (response.data && response.data.employment && response.data.employment.length > 0) {
          const mappedEmployments = response.data.employment.map(emp => ({
            companyName: emp.cand_emp_company || "",
            employeeId: emp.cand_emp_empid || "",
            firstName: emp.cand_first_name || "",
            lastName: emp.cand_last_name || "",
            designation: emp.cand_emp_designation || "",
            fromDate: emp.cand_emp_from_date ? new Date(emp.cand_emp_from_date).toISOString().split('T')[0] : "",
            toDate: emp.cand_emp_to_date ? new Date(emp.cand_emp_to_date).toISOString().split('T')[0] : "",
            isInternship: emp.cand_emp_type === "Internship",
            joiningLetterFile: emp.cand_emp_joining ? { name: "Existing Joining Letter", url: emp.cand_emp_joining } : null,
            relievingLetterFile: emp.cand_emp_payslip ? { name: "Existing Relieving Letter", url: emp.cand_emp_payslip } : null,
            serviceLetterFile: emp.cand_emp_service ? { name: "Existing Service Letter", url: emp.cand_emp_service } : null,
            certificateFile: emp.cand_emp_joining ? { name: "Existing Internship Certificate", url: emp.cand_emp_joining } : null,
          }));
          setEmployments(mappedEmployments);
          setStep("submitted");
          sessionStorage.setItem("candidate_employments", JSON.stringify(mappedEmployments));
          sessionStorage.setItem("candidate_employment_step", "submitted");
        }
      } catch (err) {
        console.error("Error fetching existing employment:", err);
      } finally {
        setLoadingExisting(false);
      }
    };
    fetchExistingData();
  }, []);

  const handleAddEmployment = (data) => {
    let updated;
    if (editingIndex !== null) {
      updated = [...employments];
      updated[editingIndex] = data;
      setEditingIndex(null);
    } else {
      updated = [...employments, data];
    }
    setEmployments(updated);
    setStep("submitted");
    sessionStorage.setItem("candidate_employments", JSON.stringify(updated));
    sessionStorage.setItem("candidate_employment_step", "submitted");
  };

  const handleEditEmployment = (index) => {
    setEditingIndex(index);
    setStep("form");
  };

  const handleSkip = () => {
    setStep("skipped");
    sessionStorage.setItem("candidate_employment_step", "skipped");
    if (onNext) onNext();
  };

  const handleFinalSubmit = async () => {
    // Validate that all employment records have mandatory documents
    for (let i = 0; i < employments.length; i++) {
      const emp = employments[i];
      if (emp.isInternship) {
        if (!emp.certificateFile) {
          alert(`Internship Certificate is mandatory for ${emp.companyName || 'Record ' + (i + 1)}.`);
          return;
        }
      } else {
        if (!emp.joiningLetterFile) {
          alert(`Joining Letter is mandatory for ${emp.companyName || 'Record ' + (i + 1)}.`);
          return;
        }
        if (!emp.relievingLetterFile) {
          alert(`Relieving Letter is mandatory for ${emp.companyName || 'Record ' + (i + 1)}.`);
          return;
        }
        if (!emp.serviceLetterFile) {
          alert(`Service Letter is mandatory for ${emp.companyName || 'Record ' + (i + 1)}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const formPayload = new FormData();
      formPayload.append("cand_id", candId);
      formPayload.append("isInternship", isInternshipCandidate ? "true" : "false");
      
      const employmentData = [];
      
      employments.forEach((emp, index) => {
        // Clone without the file for JSON payload
        const empDetails = { ...emp };
        delete empDetails.certificateFile;
        delete empDetails.joiningLetterFile;
        delete empDetails.relievingLetterFile;
        delete empDetails.serviceLetterFile;
        employmentData.push(empDetails);
        
        if (emp.certificateFile instanceof File) {
          formPayload.append(`certificateFile_${index}`, emp.certificateFile);
        } else if (emp.certificateFile?.url) {
          formPayload.append(`existingCertificateUrl_${index}`, emp.certificateFile.url);
        }

        if (emp.joiningLetterFile instanceof File) {
          formPayload.append(`joiningLetterFile_${index}`, emp.joiningLetterFile);
        } else if (emp.joiningLetterFile?.url) {
          formPayload.append(`existingJoiningUrl_${index}`, emp.joiningLetterFile.url);
        }

        if (emp.relievingLetterFile instanceof File) {
          formPayload.append(`relievingLetterFile_${index}`, emp.relievingLetterFile);
        } else if (emp.relievingLetterFile?.url) {
          formPayload.append(`existingRelievingUrl_${index}`, emp.relievingLetterFile.url);
        }

        if (emp.serviceLetterFile instanceof File) {
          formPayload.append(`serviceLetterFile_${index}`, emp.serviceLetterFile);
        } else if (emp.serviceLetterFile?.url) {
          formPayload.append(`existingServiceUrl_${index}`, emp.serviceLetterFile.url);
        }
      });
      
      formPayload.append("employmentData", JSON.stringify(employmentData));

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/employment`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      sessionStorage.setItem("candidate_employments", JSON.stringify(employments));
      sessionStorage.setItem("candidate_employment_step", "submitted");

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

      {loadingExisting ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">Loading your employment details...</p>
        </div>
      ) : (
        <>
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
                  onClick={() => {
                    setStep("form");
                    sessionStorage.setItem("candidate_employment_step", "form");
                  }}
                  className="flex items-center justify-center gap-2 w-36 py-2.5 bg-[#05058D] text-white rounded-xl hover:bg-blue-800 transition-all duration-300 font-medium text-sm"
                >
                  Yes, I have
                </button>
                <button
                  onClick={handleSkip}
                  className="flex items-center justify-center gap-2 w-36 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium text-sm"
                >
                  No, skip <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === "skipped" && employments.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                <Briefcase className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Employment Details Added</h3>
              <p className="text-gray-500 mb-6 text-sm text-center max-w-md">
                You previously indicated that you are a Fresher without employment experience. If you would like to add work experience or internship details now, click below.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep("form");
                    sessionStorage.setItem("candidate_employment_step", "form");
                  }}
                  className="px-6 py-2.5 bg-[#05058D] text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition shadow-sm"
                >
                  + Add Employment / Internship
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

          {step === "form" && (
            <EmploymentForm
              isInternship={isInternshipCandidate}
              initialData={editingIndex !== null ? employments[editingIndex] : null}
              onSubmit={handleAddEmployment}
            />
          )}

          {(step === "submitted" || employments.length > 0) && step !== "form" && (
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
        </>
      )}
    </div>
  );
}

export default Employment;
