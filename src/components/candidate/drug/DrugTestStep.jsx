import React, { useRef, useState } from "react";
import { AlertCircle, Upload, CheckCircle } from "lucide-react";
import DrugHeader from "./DrugHeader";
import DrugQuestion from "./DrugQuestion";

function DrugTestStep({ onNext }) {
  const [selected, setSelected] = useState("");
  const [testDate, setTestDate] = useState("");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);

  const fileRef = useRef(null);

  const questionData = {
    question: "Have You Taken The Drug Test?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  };

  const handleSelect = (value) => {
    setSelected(value);
    setTestDate("");
    setDetails("");
    setFile(null);
    setError(false);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowed.includes(selectedFile.type)) {
      setError(true);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(true);
      return;
    }

    setFile(selectedFile);
    setError(false);
  };

  const handleSubmit = () => {
    if (!selected) {
      setError(true);
      return;
    }

    if (selected === "yes") {
      if (!testDate) {
        setError(true);
        return;
      }

      if (!details.trim()) {
        setError(true);
        return;
      }

      if (!file) {
        setError(true);
        return;
      }
    }

    setError(false);
    onNext && onNext();
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 min-h-screen">
      <DrugHeader />

      <DrugQuestion
        question={questionData.question}
        options={questionData.options}
        selected={selected}
        onSelect={handleSelect}
      />

      {/* YES Selected */}
      {selected === "yes" && (
        <>
          {/* Date and Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Test <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => {
                  setTestDate(e.target.value);
                  setError(false);
                }}
                className="w-full h-11 border border-gray-300 rounded-lg px-4 text-sm outline-none focus:ring-2 focus:ring-[#05058D]"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please Provide Test Details{" "}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              rows="5"
              value={details}
              placeholder="Please provide brief details about the drug test report"
              onChange={(e) => {
                setDetails(e.target.value);
                setError(false);
              }}
              className="w-full border border-[#d7dcff] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#05058D]"
            />
          </div>

          {/* Upload Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-medium text-[#05058D] mb-4">
              Please upload your drug test report
            </h3>

            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-[#C3C6F5] rounded-2xl bg-[#F4F7FE] hover:bg-[#eef0fc] h-64 flex flex-col items-center justify-center cursor-pointer transition"
            >
              {file ? (
                <>
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                    <CheckCircle size={36} className="text-blue-600" />
                  </div>
                  <p className="text-[#01026E] font-semibold text-sm">
                    Document uploaded successfully
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {file.name}
                  </p>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            <input
              type="file"
              hidden
              ref={fileRef}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-500 text-sm flex items-center gap-2">
          <AlertCircle size={14} />
          Please complete all required fields correctly.
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-center mt-12">
        <button
          onClick={handleSubmit}
          className="bg-[#05058D] text-white px-14 py-3 rounded-xl hover:bg-blue-900 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default DrugTestStep;