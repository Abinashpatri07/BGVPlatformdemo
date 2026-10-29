import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Eye,
  CheckCircle2,
  FileBadge,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  X,
  ExternalLink
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const API_BASE = API_BASE_URL;

const getStatusName = (status) => {
  switch (parseInt(status)) {
    case 1: return "Pending";
    case 2: return "Assigned";
    case 3: return "In Progress";
    case 4: return "Verified";
    case 5: return "Refute / Rejected";
    case 6: return "Hold";
    default: return "Unverified";
  }
};

const getStatusBadge = (status) => {
  const s = getStatusName(status);
  switch (parseInt(status)) {
    case 4:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
          {s}
        </span>
      );
    case 5:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C]">
          {s}
        </span>
      );
    case 6:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          {s}
        </span>
      );
    case 2:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#7E22CE]">
          {s}
        </span>
      );
    case 3:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          {s}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {s}
        </span>
      );
  }
};

const fmtDate = (d) => {
  if (!d) return "—";
  if (typeof d === "number" || (/^\d{4}$/).test(String(d).trim())) return String(d).trim();
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(d);
  }
};

const fmtYear = (d) => {
  if (!d) return "—";
  if (typeof d === "number" || (/^\d{4}$/).test(String(d).trim())) return String(d).trim();
  try {
    const dt = new Date(d);
    if (!isNaN(dt.getTime())) return String(dt.getFullYear());
    return String(d);
  } catch {
    return String(d);
  }
};

const getDocUrl = (path) => {
  if (!path) return null;
  let clean = path.replace(/\\/g, "/");
  if (clean.includes("bgvplatform-backend.onrender.com")) {
    clean = clean.replace("https://bgvplatform-backend.onrender.com", API_BASE)
                 .replace("http://bgvplatform-backend.onrender.com", API_BASE);
  }
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `${API_BASE}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function SuperAdminEducationDetails() {
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isView = searchParams.get("mode") === "view";
  const caseIdParam = searchParams.get("caseId");

  useEffect(() => {
    if (!caseIdParam) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${API_BASE}/api/superadmin/cases/details/${caseIdParam}`);
        if (res.data.success) {
          setCaseData(res.data.case);
          setCandidate(res.data.candidate);
          setRecords(res.data.records || []);
        }
      } catch (err) {
        console.error("Error fetching education case details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [caseIdParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10 px-4 mt-4">
      {/* Personal / Case Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
              <User size={20} />
            </div>
            <h2 className="text-xl font-semibold text-indigo-900">
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Education Details")}
            </h2>
          </div>
          {caseData?.vendorName && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Assigned Vendor: {caseData.vendorName}
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-10 lg:gap-14 items-start ml-2">
          <Field label="First Name" value={candidate?.firstName} />
          <Field label="Last Name" value={candidate?.lastName} />
          <Field label="Phone Number" value={candidate?.phone ? `+91 ${candidate.phone}` : null} />
          <Field label="Email Id" value={candidate?.email} />
          <Field label="Tag / Function" value={candidate?.department} />
          {candidate?.experience && <Field label="Experience" value={`${candidate.experience} yrs`} />}
        </div>
      </div>

      {/* Education Header */}
      <div className="flex items-center gap-3 ml-2">
        <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
          <GraduationCap size={20} />
        </div>
        <h2 className="text-xl font-semibold text-indigo-900">
          Education Details
          {records.length > 0 && (
            <span className="ml-2 text-sm font-medium text-indigo-400">
              ({records.length} record{records.length > 1 ? "s" : ""})
            </span>
          )}
        </h2>
      </div>

      {/* EDUCATION RECORDS LIST */}
      <div className="space-y-6 ml-2">
        {records.length > 0 ? (
          records.map((edu, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {edu.cand_edu_type || edu.cand_edu_dgree || `Education Qualification ${index + 1}`}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                    <div className="col-span-2 md:col-span-1">
                      <Field label="Institute Name" value={edu.cand_edu_institute} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Field label="Degree / Course" value={edu.cand_edu_dgree} />
                    </div>
                    <Field label="Start Date" value={fmtDate(edu.cand_edu_from_date)} />
                    <Field label="End Date / Passing Year" value={fmtYear(edu.cand_edu_to_date) !== "—" ? `${fmtDate(edu.cand_edu_to_date)} (Year: ${fmtYear(edu.cand_edu_to_date)})` : fmtDate(edu.cand_edu_to_date)} />
                    <Field label="Specialization" value={edu.cand_specialization} />
                    <Field label="Percentage / CGPA" value={edu.cand_edu_grade} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Supporting Documents</h3>
                  <div className="space-y-4">
                    {edu.cand_edu_certificate ? (
                      <div className="flex items-center gap-4">
                        <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                        <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Degree Certificate / Mark Sheet</p>
                            <p className="text-xs text-gray-400">Attached</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setPreviewUrl(getDocUrl(edu.cand_edu_certificate))}
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition"
                            title="Preview Document"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                          <FileBadge size={16} />
                        </div>
                        <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Certificate</p>
                            <p className="text-xs text-gray-400">No document attached</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {edu.cand_edu_marksheet ? (
                      <div className="flex items-center gap-4">
                        <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                        <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Final Marksheet</p>
                            <p className="text-xs text-gray-400">Attached</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setPreviewUrl(getDocUrl(edu.cand_edu_marksheet))}
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition"
                            title="Preview Marksheet"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                          <FileBadge size={16} />
                        </div>
                        <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Marksheet</p>
                            <p className="text-xs text-gray-400">No document attached</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm text-gray-500">
            <GraduationCap size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700">No Education Records Found</p>
            <p className="text-xs text-gray-400 mt-1">This candidate has not submitted education records yet.</p>
          </div>
        )}

        {/* VERIFICATION DETAILS / STATUS INDICATOR SECTION */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm ml-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-700">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Verification Details &amp; Status
              </h2>
            </div>
            {getStatusBadge(caseData?.verificationStatus)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Verification Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  parseInt(caseData?.verificationStatus) === 4 ? "bg-emerald-500" :
                  parseInt(caseData?.verificationStatus) === 5 ? "bg-rose-500" :
                  parseInt(caseData?.verificationStatus) === 6 ? "bg-amber-500" :
                  parseInt(caseData?.verificationStatus) === 2 ? "bg-purple-500" :
                  parseInt(caseData?.verificationStatus) === 3 ? "bg-blue-500" : "bg-gray-400"
                }`} />
                <span className="text-sm font-semibold text-gray-800">
                  {getStatusName(caseData?.verificationStatus)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Assigned Vendor</p>
              <p className="text-sm font-semibold text-gray-900">
                {caseData?.vendorName || "Not Assigned"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Assigned Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {fmtDate(caseData?.assignedDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Verification Completed Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {fmtDate(caseData?.completedDate)}
              </p>
            </div>
          </div>

          {caseData?.verificationComment && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1.5">Verification Remarks / Notes</p>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
                {caseData.verificationComment}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#05058D] hover:bg-blue-800 rounded-xl transition shadow-sm"
            >
              Back to Cases
            </button>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">Document Preview</h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold border border-indigo-100"
                  title="Open in new tab"
                >
                  <ExternalLink size={15} />
                  <span>Open in Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <div className="flex justify-center bg-gray-50 rounded-lg p-2">
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="max-h-[70vh] rounded-lg object-contain shadow-sm"
                />
              </div>
            ) : previewUrl.match(/\.pdf$/i) ? (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh] rounded-lg border border-gray-200"
                title="PDF Preview"
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-3">Preview not available directly in browser for this file type.</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#05058D] text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition inline-flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Download / View File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminEducationDetails;
