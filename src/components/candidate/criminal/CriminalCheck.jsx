import React, { useRef, useState } from "react";
import axios from "axios";
import { ArrowRight, ShieldAlert, CheckCircle, AlertCircle } from "lucide-react";

function CriminalCheck({ onNext }) {
  const [step, setStep] = useState("question");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingReportUrl, setExistingReportUrl] = useState(null);

  const fileRef = useRef(null);

  React.useEffect(() => {
    const fetchExisting = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/${candId}`);
        if (response.data && response.data.criminal) {
          const crim = response.data.criminal;
          if (crim.cand_crim_record === "Yes") {
            setStep("input");
            setDetails(crim.cand_crim_remarks || "");
            if (crim.cand_crim_report) {
              setExistingReportUrl(crim.cand_crim_report);
              // Mock a file object so the UI shows it as uploaded
              setFile({ name: "existing_criminal_document" });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching criminal records:", err);
      }
    };
    fetchExisting();
  }, []);

  const handleSkip = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/criminal`, { 
        cand_id: candId,
        has_record: false,
        criminalStatus: "No" 
      });
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert("Failed to save Criminal Check details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(selectedFile.type)) {
      setError("Only PDF, PNG, JPG files are allowed");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be 5MB or less");
      return;
    }

    setFile(selectedFile);
    setError(false);
  };

  const handleSubmit = async () => {
    if (!details.trim() || !file) {
      setError("Please provide details and upload the document");
      return;
    }

    setError(false);
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const formData = new FormData();
      formData.append("cand_id", candId);
      formData.append("criminalStatus", "Yes");
      formData.append("remarks", details);
      
      if (file.name === "existing_criminal_document" && existingReportUrl) {
        formData.append("reportUrl", existingReportUrl);
      } else {
        formData.append("reportFile", file);
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/criminal`, formData);
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save Criminal Check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-blue-900 text-2xl font-bold">
          Criminal Background Check
        </h2>
      </div>

      {step === "question" && (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-blue-100/50 shadow-inner">
             <ShieldAlert className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-2xl font-semibold text-[#05058D] mb-2 text-center">
            Do You Have Any Criminal Record?
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-md text-sm leading-relaxed">
            This Information Is Required For Compliance Purposes. All Information Will Be Kept Confidential. Providing accurate information is mandatory for background verification.
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => setStep("input")}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-[#05058D] text-white rounded-xl hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 font-medium text-sm"
            >
              Yes, I have
            </button>
            <button
              onClick={handleSkip}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-36 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 font-medium text-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : <>No, I don't <ArrowRight className="w-4 h-4 ml-1" /></>}
            </button>
          </div>
        </div>
      )}

      {step === "input" && (
        <div className="mt-8 flex-1">
           <p className="text-gray-600 mb-6 text-sm">
             Please provide details about your criminal record and upload relevant documents below.
           </p>

           <div className="mt-6">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Please Provide Details <span className="text-red-500">*</span>
             </label>
             <textarea
               rows="4"
               value={details}
               placeholder="Please provide brief details about the criminal record"
               onChange={(e) => {
                 setDetails(e.target.value);
                 setError(false);
               }}
               className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
             />
           </div>

           <div className="mt-6">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Upload Document <span className="text-red-500">*</span>
             </label>

             <div
               onClick={() => fileRef.current.click()}
               className="border-2 border-dashed border-[#C3C6F5] rounded-xl bg-[#F4F7FE] hover:bg-[#eef0fc] h-36 flex flex-col items-center justify-center cursor-pointer transition"
             >
               {file ? (
                 <>
                   <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-2">
                     <CheckCircle size={24} className="text-blue-600" />
                   </div>
                   <p className="text-[#01026E] font-semibold text-xs">
                     Document uploaded successfully
                   </p>
                   <p className="text-[10px] text-gray-400 mt-1">
                     {file.name}
                   </p>
                 </>
               ) : (
                 <>
                   <div className="w-12 h-12 rounded-full bg-[#E0EEFF] flex items-center justify-center mb-3">
                     <svg width="28" height="28" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                   <p className="text-xs text-gray-600">
                     <span className="text-[#01026E] font-bold">Click Here</span>{" "}
                     to upload your File or Drag
                   </p>
                   <p className="text-[10px] text-gray-400 mt-1">
                     Supported format PDF, JPG, PNG, up to 5MB
                   </p>
                 </>
               )}
             </div>

             <input
               type="file"
               hidden
               ref={fileRef}
               accept=".pdf,.png,.jpg,.jpeg"
               onChange={handleUpload}
             />
           </div>

           {error && (
             <p className="mt-4 text-red-500 text-sm flex items-center gap-2">
               <AlertCircle size={14} />
               {typeof error === "string" && error !== "" ? error : "Please complete all required fields correctly."}
             </p>
           )}

           <div className="mt-10 flex gap-4">
             <button
               onClick={handleSubmit}
               disabled={loading}
               className="bg-[#05058D] text-white px-10 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 disabled:opacity-50 text-sm"
             >
               {loading ? "Saving..." : "Submit"}
             </button>
             <button
               onClick={() => setStep("question")}
               className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition text-sm"
             >
               Back
             </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default CriminalCheck;