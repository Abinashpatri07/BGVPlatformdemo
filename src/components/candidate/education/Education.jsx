import React, { useRef, useState } from "react";
import axios from "axios";
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
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${API_BASE}/api/candidate/submit/review/1`);
        if (response.data && response.data.education && response.data.education.length > 0) {
          const loadedFiles = {};
          response.data.education.forEach(edu => {
            const docName = edu.cand_edu_dgree || edu.cand_edu_type;
            if (docName) {
              loadedFiles[docName] = {
                success: true, // Mark as successful so it shows the edit/upload view properly
                fileName: edu.cand_edu_certificate ? "Existing Certificate" : "",
                existingFileUrl: edu.cand_edu_certificate || null,
                fields: {
                  institute: edu.cand_edu_institute || "",
                  degree: docName,
                  startDate: edu.cand_edu_from_date ? new Date(edu.cand_edu_from_date).toISOString().split('T')[0] : "",
                  endDate: edu.cand_edu_to_date ? new Date(edu.cand_edu_to_date).toISOString().split('T')[0] : "",
                  course: edu.cand_specialization || "",
                  percentage: edu.cand_edu_grade || ""
                }
              };
            }
          });
          setFiles(loadedFiles);
        }
      } catch (err) {
        console.error("Error fetching existing education:", err);
      }
    };
    fetchExistingData();
  }, []);

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
        fileObject: file,
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
          degree: docName, // Ensure degree name is always set
          [field]: value
        }
      }
    }));
  };

  const visibleDocs = openCard
    ? docs.filter((doc) => doc === openCard)
    : docs;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("cand_id", 1); // Mock candidate ID
      
      const educationData = [];
      
      Object.keys(files).forEach((docName) => {
        const item = files[docName];
        // Only push if there's actually some data filled in (e.g., institute name or course)
        if (item.fields && (item.fields.institute || item.fields.course)) {
          educationData.push({
            ...item.fields,
            degree: item.fields.degree || docName // Fallback just in case
          });
          
          if (item.fileObject) {
            formData.append(`file_${docName}`, item.fileObject);
          }
          if (item.existingFileUrl) {
            formData.append(`existingFileUrl_${docName}`, item.existingFileUrl);
          }
        }
      });
      
      formData.append("educationData", JSON.stringify(educationData));

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE}/api/candidate/submit/education`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save Education details.");
    } finally {
      setLoading(false);
    }
  };

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

        {Object.keys(files).length > 0 && !openCard && (
        <div className="flex justify-center mt-6 pb-4">
            <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#05058D] text-white px-8 py-2 rounded-lg text-sm hover:bg-blue-900 transition disabled:opacity-50"
            >
            {loading ? "Saving..." : "Submit"}
            </button>
        </div>
        )}
    </div>
  );
}

export default Education;