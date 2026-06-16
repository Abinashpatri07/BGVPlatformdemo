import React, { useState } from "react";
import { Building2, UserCircle, CreditCard, CheckCircle2 } from "lucide-react";
import axios from "axios";

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 bg-[#F8FAFF] border border-[#B3C9FF] rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 text-gray-700";

const PLANS = [
  { id: "starter", name: "Starter Identity", description: "100 Units • Basic Checks", popular: false },
  { id: "standard", name: "Standard Employment", description: "500 Units • Advanced Checks", popular: true },
  { id: "premium", name: "Premium Screen", description: "1000 Units • Comprehensive Checks", popular: false },
];

export default function CreateClientForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    companyName: "",
    cin: "",
    gst: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    plan: "standard",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePlan = (id) =>
    setForm((prev) => ({ ...prev, plan: id }));

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key]) {
        newErrors[key] = "This field is required";
      }
    });

    // Extra checks
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      newErrors.pinCode = "Pin Code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {

  if (!validate()) return;

  try {

    const response = await axios.post(
      "http://localhost:5000/api/client/create-client",
      form
    );

    setShowSuccessModal(true);

    console.log(response.data);

    // RESET FORM
    setForm({
      companyName: "",
      cin: "",
      gst: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      plan: "standard",
    });

    setErrors({});

  } catch (error) {

    console.log(error);

    if (error.response?.data?.errors) {

      setErrors(error.response.data.errors);

    } else {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  }
};

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col max-w-2xl h-150">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Company Information */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Company Information</h2>
          </div>
          <div className="flex flex-col gap-4">
            <Field label="Company Name" required error={errors.companyName}>
              <input className={inputCls} placeholder="DQNex Consultant"
                value={form.companyName} onChange={handle("companyName")} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CIN" required error={errors.cin}>
                <input className={inputCls} placeholder="U74999KA2026PTC123456"
                  value={form.cin} onChange={handle("cin")} />
              </Field>
              <Field label="GST Number" required error={errors.gst}>
                <input className={inputCls} placeholder="30QAZWS7788E1Z2"
                  value={form.gst} onChange={handle("gst")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address Line 1" required error={errors.address1}>
                <input className={inputCls} placeholder="#214, 5th Cross, 2nd Main Road"
                  value={form.address1} onChange={handle("address1")} />
              </Field>
              <Field label="Address Line 2" required error={errors.address2}>
                <input className={inputCls} placeholder="HSR Layout Sector 6"
                  value={form.address2} onChange={handle("address2")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" required error={errors.city}>
                <input className={inputCls} placeholder="Bengaluru"
                  value={form.city} onChange={handle("city")} />
              </Field>
              <Field label="State" required error={errors.state}>
                <input className={inputCls} placeholder="Karnataka"
                  value={form.state} onChange={handle("state")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pin Code" required error={errors.pinCode}>
                <input className={inputCls} placeholder="560102"
                  value={form.pinCode} onChange={handle("pinCode")} />
              </Field>
              <Field label="Country" required error={errors.country}>
                <input className={inputCls} placeholder="India"
                  value={form.country} onChange={handle("country")} />
              </Field>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Primary Contact Person */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <UserCircle size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Primary Contact Person</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" required error={errors.firstName}>
                <input className={inputCls} placeholder="Manav"
                  value={form.firstName} onChange={handle("firstName")} />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input className={inputCls} placeholder="Joshi"
                  value={form.lastName} onChange={handle("lastName")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact Email" required error={errors.email}>
                <input className={inputCls} placeholder="manav.joshi@example.com"
                  value={form.email} onChange={handle("email")} />
              </Field>
              <Field label="Phone Number" required error={errors.phone} hint="Must be a unique active number.">
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-[#F8FAFF] border border-[#B3C9FF] border-r-0 rounded-l-xl text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    className="w-full px-4 py-2.5 bg-[#F8FAFF] border border-[#B3C9FF] rounded-r-xl outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 text-gray-700"
                    placeholder="8485214690"
                    maxLength={10}
                    value={form.phone}
                    onChange={handle("phone")}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Verification Package Setup */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Verification Package Setup</h2>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Select Default Plan <span className="text-red-500">*</span>
          </p>
        <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => {
            const isSelected = form.plan === plan.id;

            return (
            <div
                key={plan.id}
                onClick={() => handlePlan(plan.id)}
                className={`
                relative flex items-start justify-between
                p-4 rounded-2xl border-2 cursor-pointer bg-white transition-all duration-200
                ${
                    isSelected
                    ? "border-indigo-600 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }
                `}
            >

                {/* Popular Badge */}
                {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-indigo-600 text-white text-[10px] font-semibold px-4 py-1 rounded-full tracking-wide">
                    POPULAR
                    </div>
                </div>
                )}

                {/* Left Content */}
                <div className="mt-1">
                <p className="text-sm font-semibold text-gray-900">
                    {plan.name}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                    {plan.description}
                </p>
                </div>

                {/* Radio Circle */}
                <div
                className={`
                    w-5 h-5 rounded-full border-[3px]
                    flex items-center justify-center shrink-0 ml-3 mt-1
                    ${
                    isSelected
                        ? "border-indigo-600"
                        : "border-gray-300"
                    }
                `}
                >
                {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                )}
                </div>

            </div>
            );
        })}
        </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-white">
        <button
          onClick={onCancel}
          className="border border-gray-300 text-gray-600 text-sm font-semibold px-8 py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-700 text-white text-sm font-semibold px-8 py-2.5 rounded-xl hover:bg-indigo-800 transition cursor-pointer shadow-sm"
        >
          Create Client
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-500 text-sm mb-8">
              The client has been successfully created.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                if (onSubmit) onSubmit();
              }}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
