import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function CreateCandidateForm() {
  const navigate = useNavigate();

  const [phoneMessage, setPhoneMessage]     = useState("");
  const [emailMessage, setEmailMessage]     = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading]               = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ── SUBMIT ──────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setLoading(true);
    setPhoneMessage("");
    setEmailMessage("");
    setSuccessMessage("");

    try {
      // TODO: createdById ko auth/session se lo — abhi hardcoded
      const createdById = 2; // users_id = 2 = Test Client Admin (rm_id=2, cm_id=1)

      const response = await axios.post(
        "http://localhost:5000/api/candidates/single_candidate_add",
        {
          firstName:     data.firstName,
          lastName:      data.lastName,
          phone:         data.phone,
          email:         data.email,
          jobFunction:   data.jobFunction || "",
          tag:           data.tag || "",
          createdByRole: "client_admin",   // ← yahi decide karta hai DB mein kaunsa column set hoga
          createdById,
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          `Candidate Created Successfully! Case ID: ${response.data.caseId} ✅`
        );
        reset();
        setTimeout(() => {
          navigate("/admin/candidates");
        }, 2000);
      }

    } catch (error) {
      const errData = error.response?.data;

      if (errData?.errors?.phone) {
        setPhoneMessage(errData.errors.phone);
      } else if (errData?.errors?.email) {
        setEmailMessage(errData.errors.email);
      } else if (errData?.message) {
        setEmailMessage(errData.message);
      } else {
        setEmailMessage("Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6">

      {/* BACK BUTTON + HEADING */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/candidates")}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Candidate</h1>
          <p className="text-sm text-gray-500">Fill in the details to add a new candidate</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          {/* SUCCESS BANNER */}
          {successMessage && (
            <div className="bg-green-50 border border-green-300 text-green-700 text-sm p-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* FIRST NAME / LAST NAME */}
          <div className="flex gap-4">

            {/* FIRST NAME */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                First / Middle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Rahul"
                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#02027A]"
                {...register("firstName", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets allowed",
                  },
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            {/* LAST NAME */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Sharma"
                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#02027A]"
                {...register("lastName", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets allowed",
                  },
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>

          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center mt-1">
              <span className="px-3 py-2 bg-gray-100 border rounded-l-lg text-sm text-gray-600">
                +91
              </span>
              <input
                type="text"
                placeholder="9876543210"
                maxLength={10}
                className="w-full p-2 border-t border-b border-r rounded-r-lg outline-none focus:ring-2 focus:ring-[#02027A]"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone must be exactly 10 digits",
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
            {phoneMessage && (
              <p className="text-red-500 text-xs mt-1">{phoneMessage}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="rahul@example.com"
              className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#02027A]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
            {emailMessage && (
              <p className="text-red-500 text-xs mt-1">{emailMessage}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Candidate will receive login credentials at this email
            </p>
          </div>

          {/* NOTE */}
          <div className="bg-indigo-50 border border-indigo-200 text-sm p-3 rounded-lg text-gray-600">
            <strong>Note:</strong> A default password will be sent to the candidate's email.
            The candidate can use these credentials to login and complete their verification profile.
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#02027A] text-white py-2 rounded-lg hover:bg-indigo-900 disabled:opacity-60 transition font-medium"
            >
              {loading ? "Creating..." : "Create Candidate"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/candidates")}
              className="flex-1 border border-indigo-200 text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition font-medium"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateCandidateForm;
