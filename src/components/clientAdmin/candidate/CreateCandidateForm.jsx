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

  // ── SUBMIT ─────────────────────────────────────────────
  const onSubmit = async (data) => {
    setLoading(true);
    setPhoneMessage("");
    setEmailMessage("");
    setSuccessMessage("");

    try {
      const createdById = 2;

      const response = await axios.post(
        "http://localhost:5000/api/candidates/single_candidate_add",
        {
          firstName:     data.firstName,
          lastName:      data.lastName,
          phone:         data.phone,
          email:         data.email,
          jobFunction:   data.jobFunction || "",
          tag:           data.tag || "",
          createdByRole: "client_admin",
          createdById,
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          `Candidate Created Successfully! Case ID: ${response.data.caseId} ✅`
        );
        reset();
        setTimeout(() => navigate("/admin/candidates"), 2000);
      }

    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors?.phone)   setPhoneMessage(errData.errors.phone);
      else if (errData?.errors?.email) setEmailMessage(errData.errors.email);
      else if (errData?.message)    setEmailMessage(errData.message);
      else setEmailMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── INPUT CLASS ────────────────────────────────────────
  const inputCls = (err) =>
    `w-full border-2 rounded-xl px-4 py-3 outline-none text-sm transition focus:ring-2 focus:ring-indigo-100 ${
      err
        ? "border-red-300 bg-red-50"
        : "border-indigo-200 bg-[#F5F6FF] focus:border-indigo-400"
    }`;

  return (
    <div className="p-6">

      {/* BACK + HEADING */}
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

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* SUCCESS BANNER */}
          {successMessage && (
            <div className="bg-green-50 border border-green-300 text-green-700 text-sm p-3 rounded-xl">
              {successMessage}
            </div>
          )}

          {/* FIRST NAME + LAST NAME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First/Middle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Rahul"
                className={inputCls(errors.firstName)}
                {...register("firstName", {
                  required: "First name is required",
                  pattern: { value: /^[A-Za-z\s]+$/, message: "Only alphabets allowed" },
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Sharma"
                className={inputCls(errors.lastName)}
                {...register("lastName", {
                  required: "Last name is required",
                  pattern: { value: /^[A-Za-z\s]+$/, message: "Only alphabets allowed" },
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className={`flex items-center border-2 rounded-xl overflow-hidden transition ${
              errors.phone ? "border-red-300 bg-red-50" : "border-indigo-200 bg-[#F5F6FF]"
            }`}>
              <div className="px-4 py-3 bg-indigo-100 text-gray-600 text-sm border-r-2 border-indigo-200 shrink-0">
                +91
              </div>
              <input
                type="text"
                placeholder="9876543210"
                maxLength={10}
                className="w-full px-4 py-3 outline-none text-sm bg-transparent"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^\d{10}$/, message: "Phone must be exactly 10 digits" },
                })}
                onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); }}
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="abc@example.com"
              className={inputCls(errors.email)}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
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

          {/* FUNCTION + TAG */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Function <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="IT"
                className={inputCls(errors.jobFunction)}
                {...register("jobFunction", {
                  required: "Function is required",
                })}
              />
              {errors.jobFunction && (
                <p className="text-red-500 text-xs mt-1">{errors.jobFunction.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tag <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="May Batch"
                className={inputCls(errors.tag)}
                {...register("tag", {
                  required: "Tag is required",
                })}
              />
              {errors.tag && (
                <p className="text-red-500 text-xs mt-1">{errors.tag.message}</p>
              )}
            </div>
          </div>

          {/* NOTE */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-700 leading-5">
              <span className="font-semibold">Note:</span> A Default Password Will Be Sent To The
              Candidate's Email. The Candidate Can Use These Credentials To Login And Complete
              Their Verification Profile.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#02027A] text-white py-3 rounded-xl hover:bg-indigo-900 disabled:opacity-60 transition font-medium text-sm"
            >
              {loading ? "Creating..." : "Create Candidate"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/candidates")}
              className="border-2 border-indigo-200 text-indigo-700 py-3 rounded-xl hover:bg-indigo-50 transition font-medium text-sm"
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