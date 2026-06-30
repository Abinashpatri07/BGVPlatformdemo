import React, { useState } from "react";
import { Plus } from "lucide-react";
import EmploymentForm from "./EmploymentForm";
import EmploymentCard from "./EmploymentCard";

function Employment({ onNext }) {
  const [step, setStep] = useState("initial");
  const [formData, setFormData] = useState(null);

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-72">
      <h2 className="text-blue-900 text-2xl font-bold">
        Employment Details
      </h2>

      {step === "initial" && (
        <div className="flex flex-col items-center justify-center mt-14">
          <h1 className="text-3xl font-medium text-[#101A78] mb-10">
            Are you a Fresher or Experienced?
          </h1>

          <div className="flex gap-8">
            <button
              onClick={() => setStep("fresher_check")}
              className="px-10 py-4 border-2 border-[#6E72E8] rounded-xl hover:bg-[#EEF0FF] transition font-medium text-lg text-[#101A78] w-48"
            >
              Fresher
            </button>
            <button
              onClick={() => setStep("form")}
              className="px-10 py-4 bg-[#05058D] text-white rounded-xl hover:bg-blue-900 transition font-medium text-lg w-48"
            >
              Experienced
            </button>
          </div>
        </div>
      )}

      {step === "fresher_check" && (
        <div className="flex flex-col items-center justify-center mt-14">
          <h1 className="text-3xl font-medium text-[#101A78] mb-10 text-center">
            Do you have any Internship experience?
          </h1>

          <div className="flex gap-8">
            <button
              onClick={() => setStep("internship_form")}
              className="px-10 py-4 border-2 border-[#6E72E8] text-[#101A78] rounded-xl hover:bg-[#EEF0FF] transition font-medium text-lg"
            >
              Yes, I have
            </button>
            <button
              onClick={onNext}
              className="px-10 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-medium text-lg"
            >
              No, skip this step
            </button>
          </div>
        </div>
      )}

      {(step === "form" || step === "internship_form") && (
        <EmploymentForm
          isInternship={step === "internship_form"}
          onSubmit={(data) => {
            setFormData(data);
            setStep("submitted");
          }}
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
