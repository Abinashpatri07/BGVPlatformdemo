import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/common/Header";
import SidebarStepper from "../../components/candidate/candsidebar/SidebarStepper";
import VerificationList from "../../components/candidate/concent/VerificationList";
import ActionButtons from "../../components/candidate/concent/ActionButtons";
import AddressStep from "../../components/candidate/address/AddressStep";
import IdDetails from "../../components/candidate/id/IdDetails";
import Employment from "../../components/candidate/employment/Employment";
import UANStep from "../../components/candidate/uan/UANStep";
import Education from "../../components/candidate/education/Education";
import DrugTestStep from "../../components/candidate/drug/DrugTestStep";
import CriminalCheck from "../../components/candidate/criminal/CriminalCheck";
import ReferenceCheck from "../../components/candidate/reference/ReferenceCheck";
import ReviewSubmit from "../../components/candidate/review/ReviewSubmit";
import ReviewContent from "../../components/candidate/review/ReviewContent";
import { useLocation } from "react-router-dom";

export default function VerificationPage() {
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem("candidate_currentStep");
    if (saved !== null) return parseInt(saved, 10);
    return location.state?.step ?? 0;
  });

  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = sessionStorage.getItem("candidate_completedSteps");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        if (response.data) {
          setSubmittedData(response.data);
          if (response.data.basicInfo && response.data.basicInfo.verification_status === 2) {
            setIsSubmitted(true);
          }
        }
      } catch (err) {
        console.error("Error checking submission status", err);
      } finally {
        setLoadingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const handleFinalSubmit = async () => {
    setIsSubmitted(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
      if (response.data) {
        setSubmittedData(response.data);
      }
    } catch (err) {
      console.error("Error refreshing submission review data", err);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("candidate_currentStep", currentStep);
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem("candidate_completedSteps", JSON.stringify(completedSteps));
  }, [completedSteps]);

  const handleNext = () => {
    if (currentStep < 9) {
      setCompletedSteps((prev) => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-[#f4f4ff] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f4f4ff] flex flex-col">
        <Header />
        
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
          {/* Status Header Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold shrink-0">
                ✓
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-bold text-gray-900">Application Submitted Successfully</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Under Verification
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  You have successfully submitted your background verification details. All information below is locked in <strong className="text-gray-700 font-semibold">View-Only mode</strong> and cannot be edited.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Form Content - Read Only */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#05058D]">Submitted Application Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">Below is the complete record of the information and documents you submitted.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                <span>🔒</span>
                <span>Editing Disabled (Read-Only)</span>
              </div>
            </div>

            {submittedData ? (
              <ReviewContent candidateData={submittedData} />
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Loading your submitted details...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4ff]">
      <Header />

      <div className="grid grid-cols-[230px_1fr] gap-8 p-6">
        
        {/* Sidebar */}
        <SidebarStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepBack={handleBack}
          onStepClick={setCurrentStep}
        />

        {/* Content */}
        <div className="ml-36">

          {/* STEP 1 */}
          {currentStep === 0 && (
            <main className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl">
              
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl mx-auto">
                ✓
              </div>

              <h1 className="text-center text-xl font-bold text-indigo-700 mt-3">
                Consent for Background Verification
              </h1>

              <p className="text-center text-xs text-gray-700 mt-1 mb-2">
                Please review and provide consent
              </p>

              <VerificationList />

              <ActionButtons
                onNext={handleNext}
                onBack={handleBack}
              />
            </main>
          )}

          {currentStep === 1 && <AddressStep onNext={handleNext} />}
          {currentStep === 2 && <IdDetails onNext={handleNext} />}
          {currentStep === 3 && <Employment onNext={handleNext} />}
          {currentStep === 4 && <UANStep onNext={handleNext} />}
          {currentStep === 5 && <Education onNext={handleNext} />}
          {currentStep === 6 && <DrugTestStep onNext={handleNext} />}
          {currentStep === 7 && <CriminalCheck onNext={handleNext} />}
          {currentStep === 8 && <ReferenceCheck onNext={handleNext} />}
          {currentStep === 9 && (
            <ReviewSubmit 
              onNext={handleNext} 
              onSubmit={handleFinalSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}