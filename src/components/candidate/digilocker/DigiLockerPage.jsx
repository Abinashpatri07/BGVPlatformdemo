import DigiLockerCard from "../digilocker/DigiLockerCard";
import ManualEntryCard from "../digilocker/ManualEntryCard";
import { useNavigate } from "react-router-dom";
import DigiLockerHeader from "../digilocker/DigiLockerHeader";

export default function DigiLockerPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#EEF0F8] flex flex-col items-center justify-center overflow-hidden px-6 py-12">

      {/* Background blob */}
      <div className="absolute -top-10 -left-10 w-52 h-52 bg-[#C8CCEB] rounded-full opacity-60" />

      {/* Header */}
      <DigiLockerHeader />

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-10">
        
        {/* DigiLocker option */}
        <DigiLockerCard
          onClick={() => {
            console.log("DigiLocker flow");
          }}
        />

        {/* Manual entry option */}
        <ManualEntryCard
          onStart={() => {
            sessionStorage.setItem("candidate_currentStep", "1");
            sessionStorage.setItem("candidate_highestStep", "1");
            navigate("/verification");
          }}
        />
      </div>

      {/* Bottom text */}
      <p className="relative z-10 text-xs text-gray-900 mt-10 text-center">
        Your Data Is{" "}
        <span className="underline">सुरक्षित (Safe)</span>{" "}
        And End-To-End Encrypted
      </p>
    </div>
  );
}