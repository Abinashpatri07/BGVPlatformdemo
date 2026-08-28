import { steps } from "../data/steps";
import { useNavigate } from "react-router-dom";

export default function SidebarStepper({
  currentStep,
  completedSteps = [],
  onStepBack,
  onStepClick,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (currentStep > 0) {
      onStepBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="pt-8 pl-20 flex flex-col h-[calc(100vh-110px)] sticky top-6">
      
      {/* Steps */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.map(Number).includes(index);
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              onClick={() => onStepClick(index)}
              className="flex gap-4 cursor-pointer hover:opacity-80 transition"
            >
              
              {/* Dot + Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    isCurrent
                      ? "bg-blue-600"
                      : isCompleted
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />

                {index !== steps.length - 1 && (
                  <div className={`w-px h-10 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
                )}
              </div>

              {/* Text */}
              <span
                className={`text-sm ${
                  isCurrent
                    ? "text-blue-700 font-medium"
                    : isCompleted
                    ? "text-green-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mt-4 ml-2 w-fit px-6 h-9 rounded-xl border border-indigo-400 text-indigo-700 text-sm hover:bg-white transition"
      >
        ← Back
      </button>
    </div>
  );
}