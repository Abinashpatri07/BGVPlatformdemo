import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const Input = ({ label, field, index, value, type = "text", placeholder = "", onChange, error }) => (
  <div>
    <label htmlFor={`${field}-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      id={`${field}-${index}`}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(index, field, e.target.value)}
      className={`w-full h-10 border rounded-lg px-3 text-sm outline-none focus:ring-2 transition
        ${error
          ? "border-red-400 focus:ring-red-300 focus:border-red-400"
          : "border-gray-300 focus:ring-[#05058D] focus:border-[#05058D]"
        }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, field, index, value, options, onChange, error }) => (
  <div>
    <label htmlFor={`${field}-${index}`} className="block text-xs font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      id={`${field}-${index}`}
      value={value}
      onChange={(e) => onChange(index, field, e.target.value)}
      className={`w-full h-10 border rounded-lg px-3 text-sm outline-none focus:ring-2 bg-white transition
        ${error
          ? "border-red-400 focus:ring-red-300 focus:border-red-400"
          : "border-gray-300 focus:ring-[#05058D] focus:border-[#05058D]"
        }`}
    >
      <option value="">Select</option>
      {options.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Validate a single field and return error message or ""
const validateField = (field, value) => {
  const val = String(value).trim();

  switch (field) {
    case "name":
      if (!val) return "Name is required";
      if (val.length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s]+$/.test(val)) return "Name can only contain letters";
      return "";

    case "phone":
      if (!val) return "Phone number is required";
      if (!/^\d{10}$/.test(val)) return "Enter a valid 10-digit phone number";
      return "";

    case "email":
      if (!val) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
      return "";

    case "relationship":
      if (!val) return "Please select a relationship";
      return "";

    case "organization":
      if (!val) return "Organization/College name is required";
      if (val.length < 2) return "Must be at least 2 characters";
      return "";

    default:
      return "";
  }
};

function ReferenceForm({ index, data, type, onChange }) {
  // Track which fields have been touched (blurred)
  const [touched, setTouched] = useState({});

  const handleChange = (i, field, value) => {
    // Phone: only digits, max 10
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    onChange(i, field, value);
    // Re-validate on change if already touched
    if (touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Get error only if field was touched
  const getError = (field) =>
    touched[field] ? validateField(field, data[field]) : "";

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold tracking-tight text-[#05058D]">
          {type === "professional" ? "1. Professional / Academic Reference" : "2. Personal / Family Reference"}
        </h3>
      </div>


      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onBlur={() => handleBlur("name")}>
          <Input
            label="Name"
            field="name"
            index={index}
            value={data.name}
            placeholder="Enter full name"
            onChange={handleChange}
            error={getError("name")}
          />
        </div>

        <div onBlur={() => handleBlur("relationship")}>
          <Select
            label="Relationship"
            field="relationship"
            index={index}
            value={data.relationship}
            options={type === "professional" 
              ? ["Manager", "Supervisor", "HR", "Professor", "HOD", "Principal", "Other"]
              : ["Friend", "Relative", "Neighbor", "Other"]
            }
            onChange={handleChange}
            error={getError("relationship")}
          />
        </div>

        {type === "professional" && (
          <div onBlur={() => handleBlur("organization")}>
            <Input
              label="Organization / College Name"
              field="organization"
              index={index}
              value={data.organization}
              placeholder="Enter name"
              onChange={handleChange}
              error={getError("organization")}
            />
          </div>
        )}

        <div onBlur={() => handleBlur("phone")}>
          <Input
            label="Contact Number"
            field="phone"
            index={index}
            value={data.phone}
            type="tel"
            placeholder="Enter 10-digit number"
            onChange={handleChange}
            error={getError("phone")}
          />
        </div>

        <div onBlur={() => handleBlur("email")}>
          <Input
            label={type === "professional" ? "Email Address" : "Email Address (Optional)"}
            field="email"
            index={index}
            value={data.email}
            type="email"
            placeholder="Enter email address"
            onChange={handleChange}
            error={type === "professional" ? getError("email") : (data.email && getError("email"))}
          />
        </div>
      </div>
    </div>
  );
}

export default ReferenceForm;