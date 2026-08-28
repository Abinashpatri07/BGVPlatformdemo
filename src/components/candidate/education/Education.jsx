import React, { useRef, useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import EducationCard from "./EducationCard";

function Education({ onNext }) {
  const docs = [
    "Matriculation",
    "Intermediate",
    "Graduate",
    "Post Graduate",
  ];

  const fileRefs = useRef({});
  const [files, setFiles] = useState({});
  const [openCard, setOpenCard] = useState(null);

  const handleUpload = (e, docName) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowed.includes(file.type)) {
      setFiles((prev) => ({
        ...prev,
        [docName]: {
          error: "Only PDF / JPG / PNG allowed",
        },
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFiles((prev) => ({
        ...prev,
        [docName]: {
          error:
            "Upload Failed. Ensure Your File Is In The Correct Format And Size, Then Try Again.",
        },
      }));
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [docName]: {
        ...prev[docName],
        success: true,
        fileName: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
        fields: {
          institute: prev[docName]?.fields?.institute || "",
          degree: docName,
          startDate: prev[docName]?.fields?.startDate || "",
          endDate: prev[docName]?.fields?.endDate || "",
          course: prev[docName]?.fields?.course || "",
          percentage: prev[docName]?.fields?.percentage || "",
        },
      },
    }));

    setOpenCard(docName);
  };

  const handleFieldChange = (docName, field, value) => {
    setFiles((prev) => ({
      ...prev,
      [docName]: {
        ...prev[docName],
        fields: {
          ...prev[docName]?.fields,
          [field]: value
        }
      }
    }));
  };

  const visibleDocs = openCard
    ? docs.filter((doc) => doc === openCard)
    : docs;

  const hasUploaded = Object.values(files).some(
    (item) => item?.success
  );

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-[#05058D]">
            Education Details
          </h2>
          <p className="text-xs text-gray-700 mt-1">
            Include Your Education To Create A Stronger Profile
          </p>
        </div>
        {!openCard && (
        <button className="flex items-center gap-2 border border-[#05058D] text-[#05058D] px-4 py-2 rounded-lg text-sm">
          <Plus size={14} />
          Add Education
        </button>
        )}
      </div>

      {/* Cards */}
      <div className="mt-6 space-y-3">
        {visibleDocs.map((doc) => (
          <EducationCard
            key={doc}
            doc={doc}
            item={files[doc]}
            isOpen={openCard === doc}
            onToggle={() =>
              setOpenCard(openCard === doc ? null : doc)
            }
            onUpload={(e) => handleUpload(e, doc)}
            inputRef={(el) => (fileRefs.current[doc] = el)}
            onOpenFile={() => fileRefs.current[doc]?.click()}
            onChangeField={(field, val) => handleFieldChange(doc, field, val)}
            onOk={() => setOpenCard(null)}
          />
        ))}
      </div>

      {/* Guidelines */}
      {!openCard && (
        <div className="mt-8 bg-[#F8EFE7] rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 font-medium text-sm">
            <AlertCircle size={16} className="text-orange-500" />
            Upload Guidelines
          </div>

          <ul className="mt-2 space-y-1 text-xs list-disc list-inside text-gray-700">
            <li>File Formats: PDF, JPG, Or PNG Only</li>
            <li>Maximum File Size: 5MB Per Document</li>
            <li>Ensure All Text Is Clearly Readable</li>
            <li>Upload Original Documents Only</li>
          </ul>
        </div>
      )}

        {hasUploaded && !openCard && (
        <div className="flex justify-center mt-6 pb-4">
            <button
            onClick={onNext}
            className="bg-[#05058D] text-white px-8 py-2 rounded-lg text-sm hover:bg-blue-900 transition"
            >
            Submit
            </button>
        </div>
        )}
    </div>
  );
}

export default Education;