import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Eye,
  CheckCircle2,
  FileBadge,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return String(d); }
};

const getDocUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/\\/g, "/");
  return `${API_BASE}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function SuperAdminEducationDetails() {
  const [decision, setDecision] = useState("Verified");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isView = searchParams.get("mode") === "view";
  const caseIdParam = searchParams.get("caseId");

  useEffect(() => {
    if (!caseIdParam) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/superadmin/cases/details/${caseIdParam}`);
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

  const handleSaveDecision = async () => {
    if (!caseIdParam) return;
    try {
      setSaving(true);
      await axios.post(`${API_BASE}/api/superadmin/cases/update-decision`, {
        caseId: caseIdParam,
        decision,
        remarks
      });
      alert("Decision saved successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Save decision error:", err);
      alert("Failed to save decision: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

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
                    <Field label="End Date" value={fmtDate(edu.cand_edu_to_date)} />
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
                          <a 
                            href={getDocUrl(edu.cand_edu_certificate)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition"
                            title="View Document"
                          >
                            <Eye size={18} />
                          </a>
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
                          <a 
                            href={getDocUrl(edu.cand_edu_marksheet)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition"
                            title="View Marksheet"
                          >
                            <Eye size={18} />
                          </a>
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

        {/* Verification Decision Section */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
              <CheckSquare size={20} />
            </div>
            <h2 className="text-lg font-bold text-indigo-900">
              Verification Decision
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              "Verified",
              "Partially Verified",
              "Unable To Verify",
              "Verification Pending"
            ].map((opt) => (
              <label
                key={opt}
                onClick={() => setDecision(opt)}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                  decision === opt
                    ? "border-indigo-600 bg-indigo-50/30 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="education-decision"
                  value={opt}
                  checked={decision === opt}
                  onChange={() => setDecision(opt)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    decision === opt
                      ? "border-indigo-800"
                      : "border-gray-300"
                  }`}
                >
                  {decision === opt && (
                    <div className="w-2.5 h-2.5 bg-indigo-800 rounded-full" />
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    decision === opt ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {opt}
                </span>
              </label>
            ))}
          </div>

          {/* Verification Remarks */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Verification Remarks
            </label>
            <div className="relative">
              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:bg-white resize-none"
                placeholder="Enter remarks or verification notes..."
              />
              <div className="absolute bottom-4 right-4 text-gray-400">
                <Mic size={18} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Back to Cases
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveDecision}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#05058D] hover:bg-blue-800 rounded-xl transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Save Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminEducationDetails;
