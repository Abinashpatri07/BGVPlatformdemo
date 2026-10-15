import React, { useState } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";

const InputBox = ({ label, value, type = "text", onChange, required = true, error }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none transition ${
        error
          ? "border-red-400 focus:ring-1 focus:ring-red-400 bg-red-50/20"
          : "border-gray-300 focus:ring-1 focus:ring-blue-500"
      }`}
      required={required}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const FileUploadBox = ({ label, required = true, fieldKey, file, onChange, error }) => {
  const handleChange = (e) => {
    onChange(fieldKey, e.target.files[0] || null);
  };
  const handleRemove = () => {
    onChange(fieldKey, null);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {file ? (
        <div className="flex items-center gap-2 border border-blue-200 bg-blue-50 rounded-md px-3 py-2 text-sm">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate text-blue-800 text-xs flex-1 font-medium">
            {file.name || (typeof file === "string" ? file : "Document Uploaded")}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-400 hover:text-red-600 transition shrink-0"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-md px-3 py-4 cursor-pointer transition ${
          error
            ? "border-red-400 bg-red-50/40 hover:bg-red-50"
            : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
        }`}>
          <Upload className={`w-5 h-5 ${error ? "text-red-400" : "text-gray-400"}`} />
          <span className="text-xs text-gray-500">Click to upload PDF / JPG / PNG</span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
        </label>
      )}
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
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

  const [errors, setErrors] = useState({});

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u[field];
        return u;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData({ ...formData, certificateFile: file });
    if (file && errors.certificateFile) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u.certificateFile;
        return u;
      });
    }
  };

  const handleDocChange = (fieldKey, file) => {
    setFormData({ ...formData, [fieldKey]: file });
    if (file && errors[fieldKey]) {
      setErrors((prev) => {
        const u = { ...prev };
        delete u[fieldKey];
        return u;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = isInternship ? "Company/Organization Name is required" : "Company Name is required";
    }
    if (!formData.employeeId?.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.fromDate) {
      newErrors.fromDate = "From Date is required";
    }
    if (!formData.toDate) {
      newErrors.toDate = "To Date is required";
    }
    if (formData.fromDate && formData.toDate && new Date(formData.fromDate) > new Date(formData.toDate)) {
      newErrors.toDate = "To Date cannot be before From Date";
    }
    if (!formData.designation?.trim()) {
      newErrors.designation = isInternship ? "Internship Role is required" : "Designation is required";
    }

    if (isInternship) {
      if (!formData.certificateFile) {
        newErrors.certificateFile = "Internship Certificate is mandatory";
      }
    } else {
      if (!formData.joiningLetterFile) {
        newErrors.joiningLetterFile = "Joining Letter is mandatory";
      }
      if (!formData.relievingLetterFile) {
        newErrors.relievingLetterFile = "Relieving Letter is mandatory";
      }
      if (!formData.serviceLetterFile) {
        newErrors.serviceLetterFile = "Service Letter is mandatory";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (!validate()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      <p className="text-gray-600 mt-2 text-sm mb-6">
        {isInternship
          ? "Include Your Internship To Create A Stronger Profile"
          : "Include Your Employment To Create A Stronger Profile"}
      </p>

      {Object.keys(errors).length > 0 && (
        <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-sm">Please complete all mandatory fields & documents:</p>
            <ul className="list-disc list-inside">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 mb-6">
        <InputBox
          label={isInternship ? "Company/Organization Name" : "Company Name"}
          value={formData.companyName}
          error={errors.companyName}
          onChange={(e) => handleChange(e, 'companyName')}
        />
        <InputBox
          label="Employee ID"
          value={formData.employeeId}
          error={errors.employeeId}
          onChange={(e) => handleChange(e, 'employeeId')}
        />
        <InputBox
          label="First Name"
          value={formData.firstName}
          error={errors.firstName}
          onChange={(e) => handleChange(e, 'firstName')}
        />
        <InputBox
          label="Last Name"
          value={formData.lastName}
          error={errors.lastName}
          onChange={(e) => handleChange(e, 'lastName')}
        />
        <InputBox
          label="From Date"
          value={formData.fromDate}
          type="date"
          error={errors.fromDate}
          onChange={(e) => handleChange(e, 'fromDate')}
        />
        <InputBox
          label="To Date"
          value={formData.toDate}
          type="date"
          error={errors.toDate}
          onChange={(e) => handleChange(e, 'toDate')}
        />
        <InputBox
          label={isInternship ? "Internship Role" : "Designation"}
          value={formData.designation}
          error={errors.designation}
          onChange={(e) => handleChange(e, 'designation')}
        />

        {isInternship && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Internship Certificate <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className={`w-full border rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                errors.certificateFile ? "border-red-400 bg-red-50/20" : "border-gray-300"
              }`}
              required
            />
            {errors.certificateFile && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.certificateFile}</p>
            )}
          </div>
        )}
      </div>

      {/* Document uploads for experienced candidates */}
      {!isInternship && (
        <div className="px-6 mb-6">
          <div className="border-t pt-5 mt-2">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Employment Documents <span className="text-red-500 text-xs font-normal">(All Mandatory)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Please upload all required employment documents for background verification. All documents are mandatory.
            </p>
            <div className="grid grid-cols-3 gap-5">
              <FileUploadBox
                label="Joining Letter"
                required={true}
                fieldKey="joiningLetterFile"
                file={formData.joiningLetterFile}
                error={errors.joiningLetterFile}
                onChange={handleDocChange}
              />
              <FileUploadBox
                label="Relieving Letter"
                required={true}
                fieldKey="relievingLetterFile"
                file={formData.relievingLetterFile}
                error={errors.relievingLetterFile}
                onChange={handleDocChange}
              />
              <FileUploadBox
                label="Service Letter"
                required={true}
                fieldKey="serviceLetterFile"
                file={formData.serviceLetterFile}
                error={errors.serviceLetterFile}
                onChange={handleDocChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={handleFormSubmit}
          className="bg-blue-900 text-white px-10 py-3 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm"
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default EmploymentForm;

