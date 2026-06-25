import React, { useState } from "react";
import UploadCard from "./UploadCard";
import DocumentFields from "./DocumentFields";
import { uploadPanCardOCR } from "../../../API/ocrApi";

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

  // "PAN card": {
  //   pan_number: "ABCDE1234F",
  //   date_of_birth: "25/05/1997",
  //   full_name: "Ramesh Mishra",
  //   father_name: "Narayan Mishra",
  // },

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

 const handleUpload = async (e, docType) => {
  const file = e.target.files[0];

  if (!file) return;

  const allowed = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  if (!allowed.includes(file.type)) {
    alert("Only PDF / JPG / PNG allowed");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Max file size is 5MB");
    return;
  }

  try {

    let extractedFields = {};

    // OCR for PAN card
    if (docType === "PAN card") {

      const response = await uploadPanCardOCR(file);

      extractedFields = response;

    } else {

      // static data for other docs
      extractedFields = docFields[docType];
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

  } catch (error) {

    console.error(error);

    alert("OCR extraction failed");
  }
};

  const removeFile = (docType) => {
    setData((prev) => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });

    setOpenCard(null);
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
            open={openCard === doc}
            onUpload={(e) => handleUpload(e, doc)}
            onToggle={() =>
              setOpenCard(openCard === doc ? null : doc)
            }
          />

          {/* Details */}
          {openCard === doc && data[doc] && (
            <DocumentFields
              fileName={data[doc].fileName}
              size={data[doc].size}
              fields={data[doc].fields}
              onRemove={() => removeFile(doc)}
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