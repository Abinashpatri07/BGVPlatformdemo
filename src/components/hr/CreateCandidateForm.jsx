import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import PageHeader from "./PageHeader";

function CreateCandidateForm() {
  const navigate = useNavigate();

  const [phoneMessage, setPhoneMessage] = useState("");

  const [emailMessage, setEmailMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // SUBMIT
  const onSubmit = async (data) => {
    setLoading(true);
    setPhoneMessage("");
    setEmailMessage("");
    setSuccessMessage("");

    try {
      // TODO: createdById ko auth/session se lo — abhi hardcoded
      const createdById = 1; // logged-in HR ka users_id

      const response = await axios.post(
        "http://localhost:5000/api/candidates/single_candidate_add",
        {
          ...data,
          createdByRole: "hr",   // ← HR create kar raha hai
          createdById,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Candidate Created Successfully! ✅");
        reset();
        // 2 second baad HR home pe navigate karo
        setTimeout(() => {
          navigate("/hr/home");
        }, 2000);
      }

    } catch (error) {
      const errData = error.response?.data;

      // Duplicate phone ya email — field ke neeche dikhao
      if (errData?.field === "phone") {
        setPhoneMessage(errData.message);
      } else if (errData?.field === "email") {
        setEmailMessage(errData.message);
      } else {
        setEmailMessage(errData?.message || "Something went wrong. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader />

      <div className="bg-white p-6 rounded-xl shadow max-w-xl ml-28">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          {/* SUCCESS BANNER */}
          {successMessage && (
            <div className="bg-green-50 border border-green-300 text-green-700 text-sm p-3 rounded-lg flex items-center gap-2">
              {successMessage}
            </div>
          )}

          {/* FIRST / LAST NAME */}

          <div className="flex gap-4">
            {/* FIRST NAME */}
            <div className="w-1/2">
              <label className="block text-sm font-medium">
                First/Middle Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                {...register("firstName", {
                  required: "First name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets allowed",
                  },
                })}
              />

              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* LAST NAME */}
            <div className="w-1/2">
              <label className="block text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                {...register("lastName", {
                  required: "Last name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only alphabets allowed",
                  },
                })}
              />

              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center mt-1">
              <span className="px-3 py-2 bg-gray-100 border rounded-l-lg text-sm">
                +91
              </span>

              <input
                type="text"
                placeholder="9876543210"
                maxLength={10}
                className="w-full p-2 border-t border-b border-r rounded-r-lg outline-none focus:ring-2 focus:ring-blue-500"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}

            {phoneMessage && (
              <p className="text-red-500 text-xs mt-1">{phoneMessage}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="abc@example.com"
              className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}

            {emailMessage && (
              <p className="text-red-500 text-xs mt-1">{emailMessage}</p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              Candidate will receive login credentials at this email
            </p>
          </div>

          {/* FUNCTION + TAG */}
          <div className="flex gap-4">
            {/* FUNCTION */}
            <div className="w-1/2">
              <label className="block text-sm font-medium">
                Function <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="IT"
                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
               {...register("jobFunction", {
  required: "Function is required",
})}
              />

              {errors.function && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.function.message}
                </p>
              )}
            </div>

            {/* TAG */}
            <div className="w-1/2">
              <label className="block text-sm font-medium">
                Tag <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="May Batch"
                className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                {...register("tag", {
                  required: "Tag is required",
                })}
              />

              {errors.tag && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tag.message}
                </p>
              )}
            </div>
          </div>

          {/* NOTE */}
          <div className="bg-indigo-50 border border-indigo-200 text-sm p-3 rounded-lg text-gray-600">
            <strong>Note:</strong> A Default Password Will Be Sent To The
            Candidate's Email. The Candidate Can Use These Credentials To Login
            And Complete Their Verification Profile.
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#01026E] text-white py-2 rounded-lg hover:bg-indigo-800 disabled:opacity-60 transition"
            >
              {loading ? "Creating..." : "Create Candidate"}
            </button>

            {/* CANCEL */}
            <button
              type="button"
              className="flex-1 border border-indigo-200 text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition"
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
