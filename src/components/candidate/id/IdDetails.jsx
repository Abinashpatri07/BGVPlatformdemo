import React, { useState } from "react";
import UploadCard from "./UploadCard";
import DocumentFields from "./DocumentFields";
import { uploadOCR, verifyPanSource, verifyDlSource, verifyVoterSource, verifyPassportSource, pollTaskStatus } from "../../../API/ocrApi";

const docs = [
  "Passport",
  "PAN card",
  "Driving license",
  "Voter ID",
];

const docFields = {
  Passport: {
    passport_number: "LYA52014IE",
    date_of_birth: "25/05/1997",
    first_name: "Ramesh Kumar",
    last_name: "Mishra",
    place_of_birth: "Odisha",
    date_of_issue: "21/06/2020",
    date_of_expiry: "04/10/2030",
    nationality: "INDIAN",
    gender: "Male",
  },

  "PAN card": {
    pan_number: "ABCDE1234F",
    date_of_birth: "25/05/1997",
    full_name: "Ramesh Mishra",
    father_name: "Narayan Mishra",
  },

  "Driving license": {
    driving_licence_number: "OD05201254895545",
    full_name: "Ramesh Kumar Mishra",
    date_of_birth: "25/05/1997",
    address: "Bhubaneswar",
    issued_date: "20/06/2017",
    expire_date: "04/12/2034",
    vehicle_class: "HUTF",
    blood_group: "O+VE",
  },

  "Voter ID": {
    voter_id_number: "LYA52014IE",
    full_name: "Ramesh Kumar Mishra",
    date_of_birth: "25/05/1997",
    date_of_issue: "20/04/2020",
    nationality: "INDIAN",
    gender: "Male",
  },
};

export default function IdDetails({ onNext }) {
  const [data, setData] = useState({});
  const [openCard, setOpenCard] = useState(null);
  const [panVerification, setPanVerification] = useState({ status: "idle", registeredName: null });
  const [dlVerification, setDlVerification] = useState({ status: "idle", registeredName: null });
  const [voterVerification, setVoterVerification] = useState({ status: "idle", registeredName: null });
  const [passportVerification, setPassportVerification] = useState({ status: "idle", registeredName: null });
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleUpload = async (e, docType) => {
  const file = e.target.files[0];

  if (!file) return;

  setUploadingDoc(docType);

  const allowed = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  if (!allowed.includes(file.type)) {
    alert("Only PDF / JPG / PNG allowed");
    setUploadingDoc(null);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Max file size is 5MB");
    setUploadingDoc(null);
    return;
  }

  try {
    let extractedFields = {};

    const response = await uploadOCR(file, docType);
    
    if (response.message || response.error) {
      alert("OCR API Error: " + (response.message || response.error) + ".\nFalling back to dummy data.");
      extractedFields = docFields[docType];
    } else {
      let ocrData = {};
      if (Array.isArray(response) && response.length > 0) {
        ocrData = response[0]?.result?.extraction_output || {};
      } else if (response?.result?.extraction_output) {
        ocrData = response.result.extraction_output;
      } else {
        ocrData = response;
      }

      if (docType === "PAN card") {
        extractedFields = {
          pan_number: ocrData.id_number || "",
          date_of_birth: ocrData.date_of_birth || "",
          full_name: ocrData.name_on_card || "",
          father_name: ocrData.fathers_name || "",
        };
      } else if (docType === "Voter ID") {
        extractedFields = {
          voter_id_number: ocrData.id_number || "",
          full_name: ocrData.name_on_card || "",
          date_of_birth: ocrData.date_of_birth || "",
          date_of_issue: ocrData.date_of_issue || "",
          nationality: "INDIAN",
          gender: ocrData.gender || "Male",
        };
      } else if (docType === "Driving license") {
        const safeExtractDate = (val) => {
          if (!val) return "";
          if (Array.isArray(val)) return val[0] || "";
          if (typeof val === "object") return val.NT || val.T || Object.values(val)[0] || "";
          return String(val);
        };
        const safeStr = (val) => typeof val === "object" ? JSON.stringify(val) : String(val || "");
        
        extractedFields = {
          driving_licence_number: ocrData.id_number || "",
          full_name: ocrData.name_on_card || ocrData.name || "",
          date_of_birth: ocrData.date_of_birth || ocrData.dob || "",
          address: ocrData.address || "",
          issued_date: safeExtractDate(ocrData.issue_dates) || safeExtractDate(ocrData.date_of_issue) || safeExtractDate(ocrData.issue_date) || safeExtractDate(ocrData.issued_date) || safeExtractDate(ocrData.doi) || "",
          expire_date: safeExtractDate(ocrData.date_of_expiry) || safeExtractDate(ocrData.expiry_date) || safeExtractDate(ocrData.nt_validity_to) || safeExtractDate(ocrData.valid_till) || safeExtractDate(ocrData.doe) || safeExtractDate(ocrData.validity) || "",
          vehicle_class: "LMV",
          blood_group: ocrData.blood_group || "O+",
        };
      } else if (docType === "Passport") {
        const passportFullName = ocrData.name_on_card || ocrData.name || "";
        const nameParts = passportFullName.trim().split(" ");
        const fName = nameParts.length > 0 ? nameParts[0] : "";
        const lName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        extractedFields = {
          passport_number: ocrData.id_number || "",
          date_of_birth: ocrData.date_of_birth || "",
          first_name: fName,
          last_name: lName,
          place_of_birth: ocrData.place_of_birth || "",
          date_of_issue: ocrData.date_of_issue || "",
          date_of_expiry: ocrData.date_of_expiry || "",
          nationality: "INDIAN",
          gender: ocrData.gender || "Male",
        };
      } else {
        extractedFields = docFields[docType];
      }
    }

    setData((prev) => ({
      ...prev,
      [docType]: {
        fileName: file.name,
        size: (file.size / 1024 / 1024).toFixed(1),
        fields: extractedFields,
      },
    }));

    setOpenCard(docType);

    // Auto-verify documents if they have the required fields
    if (docType === "PAN card" && extractedFields.pan_number) {
      triggerPanVerification(extractedFields.pan_number, extractedFields.full_name, extractedFields.date_of_birth);
    } else if (docType === "Driving license" && extractedFields.driving_licence_number) {
      triggerDlVerification(extractedFields.driving_licence_number, extractedFields.date_of_birth);
    } else if (docType === "Voter ID" && extractedFields.voter_id_number) {
      triggerVoterVerification(extractedFields.voter_id_number);
    } else if (docType === "Passport" && extractedFields.passport_number) {
      triggerPassportVerification(extractedFields.passport_number, extractedFields.date_of_birth, extractedFields.first_name);
    }

  } catch (error) {
    console.error("OCR API error:", error);
    // Even if real API fails, keep the dummy data for UI testing
  } finally {
    setUploadingDoc(null);
  }
};

  const formatDob = (dob) => {
    if (dob && dob.includes('/')) {
      const parts = dob.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
      }
    }
    return dob;
  };

  const executeVerify = async (initApiCall, setStatusFunc) => {
    setStatusFunc({ status: "verifying", registeredName: null });
    try {
      const initRes = await initApiCall();
      if (initRes.error || !initRes.request_id) {
        setStatusFunc({ status: "failed", registeredName: null });
        return;
      }
      
      const reqId = initRes.request_id;
      let isCompleted = false;
      let pollData = null;

      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const statusRes = await pollTaskStatus(reqId);
        const taskInfo = statusRes[0];
        
        if (taskInfo && taskInfo.status === "completed") {
          isCompleted = true;
          pollData = taskInfo.result?.source_output || {};
          break;
        } else if (taskInfo && taskInfo.status === "failed") {
          setStatusFunc({ status: "failed", registeredName: null });
          return;
        }
      }

      if (isCompleted && pollData) {
        if (pollData.status === "id_found") {
          setStatusFunc({ 
            status: "success", 
            registeredName: pollData.name_on_card || null 
          });
        } else {
          setStatusFunc({ status: "failed", registeredName: null });
        }
      } else {
        setStatusFunc({ status: "failed", registeredName: null });
      }
    } catch (err) {
      console.error(err);
      setStatusFunc({ status: "failed", registeredName: null });
    }
  };

  const triggerPanVerification = async (panNumber, fullName, dob) => {
    executeVerify(() => verifyPanSource(panNumber, fullName, formatDob(dob)), setPanVerification);
  };

  const triggerDlVerification = async (dlNumber, dob) => {
    executeVerify(() => verifyDlSource(dlNumber, formatDob(dob)), setDlVerification);
  };

  const triggerVoterVerification = async (epicNumber) => {
    executeVerify(() => verifyVoterSource(epicNumber), setVoterVerification);
  };

  const triggerPassportVerification = async (fileNumber, dob, name) => {
    executeVerify(() => verifyPassportSource(fileNumber, formatDob(dob), name), setPassportVerification);
  };

  const removeFile = (docType) => {
    setData((prev) => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });

    setOpenCard(null);
    if (docType === "PAN card") setPanVerification({ status: "idle", registeredName: null });
    if (docType === "Driving license") setDlVerification({ status: "idle", registeredName: null });
    if (docType === "Voter ID") setVoterVerification({ status: "idle", registeredName: null });
    if (docType === "Passport") setPassportVerification({ status: "idle", registeredName: null });
  };

  const visibleDocs =
    openCard !== null
      ? docs.filter((doc) => doc === openCard)
      : docs;

  return (
    <main className="bg-white rounded-2xl shadow-sm w-215 px-8 py-6">
      {/* Title */}
      <h1 className="text-[32px] font-bold text-[#05058D] mb-6">
        ID Details
      </h1>

      {/* Hide this when details open */}
      {!openCard && (
        <>
          {/* How It Works */}
          <div className="rounded-2xl border border-[#6E72E8] bg-[#EEF0FF] px-6 py-5 mb-8">
            <p className="text-sm leading-7">
              <span className="font-bold">How It Works:</span>
              Upload Your Identity Documents (Passport, PAN,
              Driving License, Or Voter ID) In JPG, PNG, Or PDF Format.
              Our OCR System Will Automatically Extract The
              Information From Your Document. Review The Extracted
              Data And Make Any Necessary Corrections Before Saving.
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-[22px] font-semibold text-[#05058D] mb-5">
            Document Upload & Verification
          </h2>
        </>
      )}

      {/* Cards */}
      {visibleDocs.map((doc) => (
        <div key={doc} className="mb-5">
          <UploadCard
            doc={doc}
            uploaded={!!data[doc]}
            isUploading={uploadingDoc === doc}
            open={openCard === doc}
            verificationState={
              doc === "PAN card" ? panVerification :
              doc === "Driving license" ? dlVerification :
              doc === "Voter ID" ? voterVerification :
              doc === "Passport" ? passportVerification : null
            }
            onUpload={(e) => handleUpload(e, doc)}
            onToggle={() =>
              setOpenCard((prev) => (prev === doc ? null : doc))
            }
          />

          {/* Details */}
          {openCard === doc && data[doc] && (
            <DocumentFields
              docType={doc}
              fileName={data[doc].fileName}
              size={data[doc].size}
              fields={data[doc].fields}
              verificationState={
                doc === "PAN card" ? panVerification :
                doc === "Driving license" ? dlVerification :
                doc === "Voter ID" ? voterVerification :
                doc === "Passport" ? passportVerification : null
              }
              onRemove={() => removeFile(doc)}
              onOk={() => setOpenCard(null)}
            />
          )}
        </div>
      ))}

      {/* Submit Button */}
      {!openCard && Object.keys(data).length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onNext}
            className="w-28 h-10 rounded-xl bg-[#05058D] text-white text-sm"
          >
            Submit
          </button>
        </div>
      )}
    </main>
  );
}