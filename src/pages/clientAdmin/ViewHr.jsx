// src/pages/clientAdmin/ViewHr.jsx

import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import HRForm from "../../components/clientAdmin/hr/HRForm";



function ViewHr() {

  const navigate = useNavigate();

  return (
    <div className="p-6">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-700"
      >

        <ArrowLeft size={18} />

        Back
      </button>

      {/* TITLE */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-[#02027A]">
          View HR Details
        </h1>

        <p className="text-gray-600 mt-1">
          View HR profile information and permissions
        </p>

      </div>

      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

        <span>Home</span>

        <span>{">"}</span>

        <span className="text-black font-medium">
          View HR Details
        </span>

      </div>

      {/* FORM */}
      <HRForm mode="view" />

    </div>
  );
}

export default ViewHr;