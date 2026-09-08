// src/pages/clientAdmin/CreateHR.jsx

import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import CreateHRForm from "../../components/clientAdmin/hr/CreateHRForm";

function CreateHR() {

  const navigate = useNavigate();

  return (
    <div className="">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-2"
      >

        <ArrowLeft size={18} />

        Back
      </button>

      {/* TITLE */}
      <div className="mb-3">

        <h1 className="text-3xl font-bold text-[#02027A]">
          Create New Human Resources Officer
        </h1>

        <p className="text-gray-600 mt-2">
          Add A New HR Member To The Platform
        </p>

      </div>

      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">

        <span>Home</span>

        <span>{">"}</span>

        <span className="text-black font-medium">
          Create HR
        </span>

      </div>

      {/* FORM COMPONENT */}
      <CreateHRForm />

    </div>
  );
}

export default CreateHR;