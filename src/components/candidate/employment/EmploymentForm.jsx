import React, { useRef, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { uploadOCR } from "../../../API/ocrApi";

function EmploymentForm({ onSubmit, isInternship }) {
  const mainFileRef = useRef(null);
  const [mainUploaded, setMainUploaded] = useState(false);
  const [mainFileName, setMainFileName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [rawOcrData, setRawOcrData] = useState(null);
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

  const handleMainFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainFileName(file.name);
    
    if (isInternship) {
      setMainUploaded(true);
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
      return;
    }

    // Call OCR for Salary Slip
    setIsExtracting(true);
    try {
      const response = await uploadOCR(file, "Salary Slip");
      if (response.error || response.message) {
        alert("OCR API Error: " + (response.message || response.error) + ".\nFalling back to dummy data.");
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
      } else {
        let ocrData = {};
        if (Array.isArray(response) && response.length > 0) {
          ocrData = response[0]?.result?.extraction_output || {};
        } else if (response?.result?.extraction_output) {
          ocrData = response.result.extraction_output;
        } else {
          ocrData = response;
        }

        const safeExtract = (val) => {
          if (!val) return "";
          if (typeof val === "object") return Object.values(val)[0] || JSON.stringify(val);
          return String(val);
        };

        const keysStr = Object.keys(ocrData).join(", ");
        setRawOcrData(ocrData); // Store raw data for debugging
        
        const fullName = safeExtract(ocrData.name) || safeExtract(ocrData.employee_name) || "";
        let first = fullName;
        let last = "";
        if (fullName.includes(" ")) {
          const parts = fullName.split(" ");
          last = parts.pop();
          first = parts.join(" ");
        }

        const parseMonthYearToDate = (str) => {
          if (!str) return "";
          if (str.match(/^\d{4}-\d{2}-\d{2}$/)) return str; // Already yyyy-mm-dd
          const parts = str.trim().split(" ");
          if (parts.length === 2) {
            const months = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };
            const m = months[parts[0].toUpperCase().substring(0,3)];
            const y = parts[1];
            if (m && y) return `${y}-${m}-01`; // Default to 1st of the month
          }
          return str;
        };

        const rawToDate = safeExtract(ocrData.last_working_day) || safeExtract(ocrData.salary_month) || safeExtract(ocrData.pay_period) || safeExtract(ocrData.date) || "";

        setFormData({
          employeeId: safeExtract(ocrData.employee_code) || safeExtract(ocrData.employee_id) || safeExtract(ocrData.id_number) || "",
          companyName: safeExtract(ocrData.company) || safeExtract(ocrData.company_name) || safeExtract(ocrData.employer) || "",
          firstName: first,
          lastName: last,
          fromDate: safeExtract(ocrData.date_of_joining) || safeExtract(ocrData.doj) || "",
          toDate: parseMonthYearToDate(rawToDate),
          designation: safeExtract(ocrData.designation) || safeExtract(ocrData.role) || "",
          drawnCTC: safeExtract(ocrData.net_pay) || safeExtract(ocrData.gross_salary) || safeExtract(ocrData.gross_pay) || safeExtract(ocrData.amount) || "",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process OCR");
    } finally {
      setIsExtracting(false);
      setMainUploaded(true);
    }
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

  const UploadBox = ({ title, inputRef, onFileChange, isUploaded, filename, onReset }) => (
    <div className="mb-8 max-w-xl mx-auto">
      <h3 className="text-2xl font-medium text-[#05058D] mb-4 text-center">
        {title}
      </h3>
      <div
        className="border-2 border-dashed border-[#C3C6F5] rounded-2xl bg-[#F4F7FE] hover:bg-[#eef0fc] h-64 flex flex-col items-center justify-center cursor-pointer transition relative"
      >
        {!isUploaded ? (
          isExtracting ? (
            <div className="flex flex-col items-center w-full h-full justify-center">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-[#01026E] font-semibold text-lg">
                Extracting Data...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please wait while we scan your document
              </p>
            </div>
          ) : (
            <div onClick={() => inputRef.current.click()} className="flex flex-col items-center w-full h-full justify-center">
              <div className="w-20 h-20 rounded-full bg-[#E0EEFF] flex items-center justify-center mb-5">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 14C6 11.8 7.8 10 10 10H18L21 14H34C36.2 14 38 15.8 38 18V32C38 34.2 36.2 36 34 36H10C7.8 36 6 34.2 6 32V14Z"
                    fill="url(#folderGrad)"
                  />
                  <path
                    d="M22 29V21M22 21L19 24M22 21L25 24"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="folderGrad" x1="6" y1="10" x2="38" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#5BB8F5" />
                      <stop offset="1" stopColor="#1A56DB" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                <span className="text-[#01026E] font-bold">Click Here</span>{" "}
                to upload your File or Drag
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Supported format PDF, JPG, PNG, up to 5MB
              </p>
              <input type="file" ref={inputRef} className="hidden" onChange={onFileChange} />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center w-full h-full justify-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              <Check className="text-blue-600" size={36} />
            </div>
            <p className="text-[#01026E] font-semibold text-sm">
              Document uploaded successfully
            </p>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{filename}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="mt-4 flex items-center gap-2 border border-blue-600 text-blue-700 px-3 py-1.5 rounded-lg text-sm bg-white hover:bg-gray-50 transition"
            >
              <X size={14} /> Remove
            </button>
          </div>
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

      {/* Form Fields */}
      <div className="mt-8 mb-8">
        <UploadBox 
          title={isInternship ? "Upload Internship Certificate" : "Upload Latest Salary Slip"}
          inputRef={mainFileRef}
          onFileChange={handleMainFileChange}
          isUploaded={mainUploaded}
          filename={mainFileName}
          onReset={() => setMainUploaded(false)}
        />
      </div>

      {mainUploaded && (
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
