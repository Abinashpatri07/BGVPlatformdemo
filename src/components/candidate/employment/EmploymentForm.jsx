import React, { useState } from "react";
import { Upload, X, FileText } from "lucide-react";

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

const FileUploadBox = ({ label, optional = true, fieldKey, file, onChange }) => {
  const handleChange = (e) => {
    onChange(fieldKey, e.target.files[0] || null);
  };
  const handleRemove = () => {
    onChange(fieldKey, null);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}{" "}
        {optional ? (
          <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        ) : (
          <span className="text-red-500">*</span>
        )}
      </label>

      {file ? (
        <div className="flex items-center gap-2 border border-blue-200 bg-blue-50 rounded-md px-3 py-2 text-sm">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate text-blue-800 text-xs flex-1">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-400 hover:text-red-600 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-200 rounded-md px-3 py-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Click to upload PDF / JPG / PNG</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
};

function EmploymentForm({ onSubmit, isInternship, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    employeeId: "",
    companyName: "",
    firstName: "",
    lastName: "",
    fromDate: "",
    toDate: "",
    designation: "",
    certificateFile: null,
    joiningLetterFile: null,
    relievingLetterFile: null,
    serviceLetterFile: null,
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, certificateFile: e.target.files[0] });
  };

  const handleDocChange = (fieldKey, file) => {
    setFormData({ ...formData, [fieldKey]: file });
  };

  return (
    <>
      <p className="text-gray-600 mt-2 text-sm mb-6">
        {isInternship
          ? "Include Your Internship To Create A Stronger Profile"
          : "Include Your Employment To Create A Stronger Profile"}
      </p>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 mb-6">
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

      {/* Document uploads for experienced candidates */}
      {!isInternship && (
        <div className="px-6 mb-6">
          <div className="border-t pt-5 mt-2">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Employment Documents</h3>
            <p className="text-xs text-gray-500 mb-4">
              Upload relevant employment documents. All documents are optional but help speed up verification.
            </p>
            <div className="grid grid-cols-3 gap-5">
              <FileUploadBox
                label="Joining Letter"
                fieldKey="joiningLetterFile"
                file={formData.joiningLetterFile}
                onChange={handleDocChange}
              />
              <FileUploadBox
                label="Relieving Letter"
                fieldKey="relievingLetterFile"
                file={formData.relievingLetterFile}
                onChange={handleDocChange}
              />
              <FileUploadBox
                label="Service Letter"
                fieldKey="serviceLetterFile"
                file={formData.serviceLetterFile}
                onChange={handleDocChange}
              />
            </div>
          </div>
        </div>
      )}

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

