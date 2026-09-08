// src/pages/clientAdmin/EditHr.jsx

import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import HRForm from "../../components/clientAdmin/hr/HRForm";

function EditHr() {

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
          Edit HR Details
        </h1>

        <p className="text-gray-600 mt-1">
          Update information, roles, and permissions for this HR profile
        </p>

      </div>

      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

        <span>Home</span>

        <span>{">"}</span>

        <span className="text-black font-medium">
          Edit HR Details
        </span>

      </div>

      {/* FORM */}
      <HRForm mode="edit" />

    </div>
  );
}

export default EditHr;