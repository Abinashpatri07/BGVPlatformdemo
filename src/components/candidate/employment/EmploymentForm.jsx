import React, { useState } from "react";

const InputBox = ({ label, value, type = "text", onChange, required = true }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      required={required}
    />
  </div>
);

function EmploymentForm({ onSubmit, isInternship }) {
  const [formData, setFormData] = useState({
    employeeId: "",
    companyName: "",
    firstName: "",
    lastName: "",
    fromDate: "",
    toDate: "",
    designation: "",
    certificateFile: null,
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, certificateFile: e.target.files[0] });
  };

  return (
    <>
      <p className="text-gray-600 mt-2 text-sm mb-6">
        {isInternship 
          ? "Include Your Internship To Create A Stronger Profile" 
          : "Include Your Employment To Create A Stronger Profile"}
      </p>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 mb-8">
        <InputBox label={isInternship ? "Company/Organization Name" : "Company Name"} value={formData.companyName} onChange={(e) => handleChange(e, 'companyName')} />
        <InputBox label="Employee ID" value={formData.employeeId} onChange={(e) => handleChange(e, 'employeeId')} />
        <InputBox label="First Name" value={formData.firstName} onChange={(e) => handleChange(e, 'firstName')} />
        <InputBox label="Last Name" value={formData.lastName} onChange={(e) => handleChange(e, 'lastName')} />
        <InputBox label="From Date" value={formData.fromDate} type="date" onChange={(e) => handleChange(e, 'fromDate')} />
        <InputBox label="To Date" value={formData.toDate} type="date" onChange={(e) => handleChange(e, 'toDate')} />
        <InputBox label={isInternship ? "Internship Role" : "Designation"} value={formData.designation} onChange={(e) => handleChange(e, 'designation')} />
        
        {isInternship && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Internship Certificate <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full border rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => onSubmit(formData)}
          className="bg-blue-900 text-white px-10 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default EmploymentForm;
