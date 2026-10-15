import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import EducationCard from "./EducationCard";

const SESSION_KEY = "candidate_education_files";

function Education({ onNext }) {
  const docs = [
    "Matriculation",
    "Intermediate",
    "Graduate",
    "Post Graduate",
  ];

  const fileRefs = useRef({});
  const [loading, setLoading] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(() => {
    return !sessionStorage.getItem(SESSION_KEY);
  });

  // ── Initialize files from sessionStorage first ──────────────────────────
  const [files, setFiles] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Re-attach fileObjects as null (can't serialize File objects)
        Object.keys(parsed).forEach((k) => {
          if (parsed[k]) parsed[k].fileObject = null;
        });
        return parsed;
      }
    } catch (_) {}
    return {};
  });

  // ── Persist to sessionStorage whenever files changes ────────────────────
  useEffect(() => {
    try {
      // Strip fileObject (not serializable) before storing
      const toStore = {};
      Object.keys(files).forEach((k) => {
        const { fileObject, ...rest } = files[k] || {};
        toStore[k] = rest;
      });
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(toStore));
    } catch (_) {}
  }, [files]);

  // ── Fetch existing education data from API (only when no session data) ──
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const candId = user.cand_id || 1;
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(
          `${API_BASE}/api/candidate/submit/review/${candId}`
        );
        if (
          response.data &&
          response.data.education &&
          response.data.education.length > 0
        ) {
          const loadedFiles = {};
          response.data.education.forEach((edu) => {
            const docName = edu.cand_edu_dgree || edu.cand_edu_type;
            if (docName) {
              loadedFiles[docName] = {
                success: true,
                fileName: edu.cand_edu_certificate
                  ? "Existing Certificate"
                  : "",
                existingFileUrl: edu.cand_edu_certificate || null,
                fields: {
                  institute: edu.cand_edu_institute || "",
                  degree: docName,
                  startDate: edu.cand_edu_from_date
                    ? new Date(edu.cand_edu_from_date)
                        .toISOString()
                        .split("T")[0]
                    : "",
                  endDate: edu.cand_edu_to_date
                    ? new Date(edu.cand_edu_to_date)
                        .toISOString()
                        .split("T")[0]
                    : "",
                  course: edu.cand_specialization || "",
                  percentage: edu.cand_edu_grade || "",
                },
              };
            }
          });
          setFiles(loadedFiles);
        }
      } catch (err) {
        console.error("Error fetching existing education:", err);
      } finally {
        setLoadingExisting(false);
      }
    };

    // Only hit the API if sessionStorage had nothing
    if (loadingExisting) {
      fetchExistingData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── File upload handler ──────────────────────────────────────────────────
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
        [docName]: { ...prev[docName], error: "Only PDF / JPG / PNG allowed" },
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFiles((prev) => ({
        ...prev,
        [docName]: {
          ...prev[docName],
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
        error: null,
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
  };

  // ── Field change handler ─────────────────────────────────────────────────
  const handleFieldChange = (docName, field, value) => {
    setFiles((prev) => ({
      ...prev,
      [docName]: {
        ...prev[docName],
        fields: {
          ...prev[docName]?.fields,
          degree: docName,
          [field]: value,
        },
      },
    }));
  };

  const visibleDocs = openCard
    ? docs.filter((doc) => doc === openCard)
    : docs;

  // ── Submit handler ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitError("");

    // ── Validation: at least one doc must be filled ──────────────────────
    const filledDocs = Object.entries(files).filter(
      ([, item]) =>
        item?.fields && (item.fields.institute || item.fields.course)
    );

    if (filledDocs.length === 0) {
      setSubmitError(
        "Please add at least one education record before submitting."
      );
      return;
    }

    // ── Validation: every filled doc must have a certificate ─────────────
    const missingCert = filledDocs.find(
      ([, item]) => !item?.fileObject && !item?.existingFileUrl
    );
    if (missingCert) {
      setSubmitError(
        `Please upload the certificate for "${missingCert[0]}" before submitting.`
      );
      return;
    }

    // ── Validation: mandatory fields inside each filled doc ───────────────
    for (const [docName, item] of filledDocs) {
      const f = item.fields || {};
      if (!f.institute?.trim()) {
        setSubmitError(`Institute name is required for "${docName}".`);
        return;
      }
      if (!f.startDate) {
        setSubmitError(`Start date is required for "${docName}".`);
        return;
      }
      if (!f.endDate) {
        setSubmitError(`End date is required for "${docName}".`);
        return;
      }
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const candId = user.cand_id || 1;
      const formData = new FormData();
      formData.append("cand_id", candId);

      const educationData = [];

      filledDocs.forEach(([docName, item]) => {
        educationData.push({
          ...item.fields,
          degree: item.fields.degree || docName,
        });

        if (item.fileObject) {
          formData.append(`file_${docName}`, item.fileObject);
        }
        if (item.existingFileUrl) {
          formData.append(
            `existingFileUrl_${docName}`,
            item.existingFileUrl
          );
        }
      });

      formData.append("educationData", JSON.stringify(educationData));

      const API_BASE =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(
        `${API_BASE}/api/candidate/submit/education`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Persist submitted state to sessionStorage
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(
        Object.fromEntries(
          filledDocs.map(([k, item]) => {
            const { fileObject, ...rest } = item;
            return [k, { ...rest, submitted: true }];
          })
        )
      ));

      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.error || "Failed to save Education details."
      );
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

      {/* Loading state */}
      {loadingExisting ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">
            Loading education details...
          </p>
        </div>
      ) : (
        <>
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
                onChangeField={(field, val) =>
                  handleFieldChange(doc, field, val)
                }
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

          {/* Submit error */}
          {submitError && !openCard && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {submitError}
            </div>
          )}

          {/* Submit button — always visible when not expanded */}
          {!openCard && (
            <div className="flex justify-center mt-6 pb-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#05058D] text-white px-10 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Education;