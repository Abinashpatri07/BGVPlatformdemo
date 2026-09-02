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

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        if (response.data && response.data.basicInfo) {
          if (response.data.basicInfo.verification_status === 2) {
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
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-sm p-10 max-w-xl w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-8">
              You have already submitted your background verification details successfully. You can no longer edit this information.
            </p>
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
              onSubmit={() => setIsSubmitted(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}