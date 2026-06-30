import React, { useRef, useState } from "react";
import { Check, X } from "lucide-react";

function EmploymentForm({ onSubmit, isInternship }) {
  const fileInputRef = useRef(null);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    companyName: "",
    firstName: "",
    lastName: "",
    fromDate: "",
    toDate: "",
    designation: "",
    drawnCTC: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setUploaded(true);

    // Example auto-filled data
    setFormData({
      employeeId: "DAQ52014E",
      companyName: "DQnex Consultant",
      firstName: "Ramesh",
      lastName: "Mishra",
      fromDate: "2024-05-01",
      toDate: "2026-08-01",
      designation: "UI/UX Designer",
      drawnCTC: "9 LPA",
    });
  };

  const InputBox = ({ label, value, verified = false, type = "text" }) => (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          readOnly
          className="w-full border rounded-md px-3 py-2 pr-16 text-sm bg-white"
        />
        {verified && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-xs font-medium">
            Verified
          </span>
        )}
      </div>
    </div>
  );

  return (
    <>
      <p className="text-gray-600 mt-2 text-sm">
        {isInternship 
          ? "Include Your Internship To Create A Stronger Profile" 
          : "Include Your Employment To Create A Stronger Profile"}
      </p>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-blue-400 rounded-xl mt-8 p-10 text-center">
        {!uploaded ? (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 flex items-center justify-center text-4xl">
              📤
            </div>
            <p className="mt-6 text-lg">
              <span
                onClick={() => fileInputRef.current.click()}
                className="text-blue-800 font-semibold cursor-pointer"
              >
                Click Here
              </span>{" "}
              to upload your File or Drag
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported format PDF, JPG, PNG, up to 5MB
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 flex items-center justify-center">
              <Check className="text-cyan-600" size={32} />
            </div>
            <h3 className="text-blue-800 font-semibold mt-5">
              Document Upload Successfully
            </h3>
            <p className="text-sm text-gray-500 mt-2">{fileName}</p>
            <button
              onClick={() => setUploaded(false)}
              className="mt-5 flex items-center gap-2 mx-auto border border-blue-600 text-blue-700 px-4 py-2 rounded-lg"
            >
              <X size={14} />
              Upload Different Document
            </button>
          </>
        )}
      </div>

      {uploaded && (
        <>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-6 mb-6">
          <InputBox label="Employee ID" value={formData.employeeId} />
          <InputBox label={isInternship ? "Company/Organization Name" : "Company Name"} value={formData.companyName} verified />
          <InputBox label="First Name" value={formData.firstName} verified />
          <InputBox label="Last Name" value={formData.lastName} verified />
          <InputBox label="From Date" value={formData.fromDate} verified type="date" />
          <InputBox label="To Date" value={formData.toDate} verified type="date" />
          <InputBox label={isInternship ? "Internship Role" : "Designation"} value={formData.designation} verified />
          <InputBox label={isInternship ? "Stipend (Optional)" : "Drawn CTC"} value={formData.drawnCTC} />
        </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => onSubmit(formData)}
              className="bg-blue-900 text-white px-8 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default EmploymentForm;
