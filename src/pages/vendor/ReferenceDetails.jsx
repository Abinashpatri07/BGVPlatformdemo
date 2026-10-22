import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import {
  Users,
  User,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  Loader2,
  Building2,
  HeartHandshake,
  FileText,
  Upload,
  CloudUpload,
  Trash2,
  Eye
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function ReferenceDetails() {
  const [decision, setDecision] = useState("Verified");
  const [remarks, setRemarks] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState({});
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [caseStatus, setCaseStatus] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isView = searchParams.get("mode") === "view";
  const caseId = searchParams.get("caseId");

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("vendorToken");
    axios
      .get(`${API}/api/vendor/cases/reference/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (res.data.success) {
          setCandidate(res.data.candidate || {});
          setRecords(res.data.records || []);
          setCaseStatus(res.data.caseStatus || res.data.status || "");
        }
      })
      .catch((err) => {
        console.error("Failed to load reference details:", err);
        setError("Failed to load reference check data.");
      })
      .finally(() => setLoading(false));
  }, [caseId]);

  const handleSubmit = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("vendorToken");
      const formData = new FormData();
      formData.append("decision", decision);
      formData.append("remarks", remarks);
      if (evidenceFile) {
        formData.append("evidenceFile", evidenceFile);
      }
      await axiosInstance.post(
        `${API}/api/vendor/cases/${caseId}/verify`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          } 
        }
      );
      alert("Verification submitted successfully!");
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert("Failed to submit verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in pb-10 px-4 mt-4">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-4 border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">
              Reference Check Details
            </h1>
            {caseId && (
              <p className="text-xs text-gray-500 font-medium">
                Case ID: CASE-{String(caseId).padStart(5, "0")}
              </p>
            )}
          </div>
        </div>
        {/* Case Status Badge at Top */}
        {caseStatus && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Case Status:</span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              caseStatus === "Verified" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
              caseStatus === "Assigned" ? "bg-purple-100 text-purple-700 border border-purple-200" :
              caseStatus === "Refute" ? "bg-red-100 text-red-700 border border-red-200" :
              caseStatus === "Unverified" ? "bg-amber-100 text-amber-700 border border-amber-200" :
              "bg-gray-100 text-gray-700 border border-gray-200"
            }`}>
              {caseStatus}
            </span>
          </div>
        )}
      </div>

      {/* CANDIDATE INFO CARD */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
            <User size={16} />
          </div>
          <h2 className="text-base font-semibold text-indigo-900">
            Candidate Information
          </h2>
        </div>
        <div className="flex flex-wrap gap-10">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">First Name</p>
            <p className="text-sm font-semibold text-gray-900">
              {candidate.candidate_first_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Last Name</p>
            <p className="text-sm font-semibold text-gray-900">
              {candidate.candidate_last_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Phone Number</p>
            <p className="text-sm font-semibold text-gray-900">
              {candidate.candidate_mobile ? `+91 ${candidate.candidate_mobile}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Email Id</p>
            <p className="text-sm font-semibold text-gray-900">
              {candidate.candidate_email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Tag</p>
            <p className="text-sm font-semibold text-gray-900">
              {candidate.candidate_tag || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Function</p>
            <p className="text-sm font-semibold text-gray-900">
              {candidate.candidate_function || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* REFERENCE RECORDS */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-semibold text-indigo-900">
            Reference List
            {records.length > 0 && (
              <span className="ml-2 text-sm font-medium text-indigo-400">
                ({records.length} record{records.length > 1 ? "s" : ""})
              </span>
            )}
          </h2>
        </div>

        {records.length > 0 ? (
          records.map((ref, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    {ref.cand_ref_type === "Organization" ? (
                      <Building2 size={20} />
                    ) : (
                      <HeartHandshake size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {ref.cand_ref_name || `Reference ${idx + 1}`}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {ref.cand_ref_type || "Professional"} Reference
                    </p>
                  </div>
                </div>
                {ref.cand_ref_relation && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold">
                    {ref.cand_ref_relation}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="Reference Name" value={ref.cand_ref_name} />
                <Field label="Reference Type" value={ref.cand_ref_type} />
                <Field label="Relationship / Role" value={ref.cand_ref_relation} />
                <Field label="Designation" value={ref.cand_ref_designation} />
                <Field
                  label="Phone Number"
                  value={ref.cand_ref_phone ? `+91 ${ref.cand_ref_phone}` : null}
                />
                <Field label="Email Address" value={ref.cand_ref_email} />
                <Field
                  label={
                    ref.cand_ref_type === "Organization"
                      ? "Company / Institution"
                      : "Associated Org"
                  }
                  value={ref.cand_ref_org}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm text-gray-500">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700">No Reference Records Found</p>
            <p className="text-xs text-gray-400 mt-1">
              Candidate has not submitted reference records yet.
            </p>
          </div>
        )}

        {/* Verification Decision (only in non-view mode) */}
        {!isView && (
          <>
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
                  <CheckSquare size={20} />
                </div>
                <h2 className="text-lg font-bold text-indigo-900">
                  Verification Decision
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      name="vendor-ref-decision"
                      value={opt}
                      checked={decision === opt}
                      onChange={() => setDecision(opt)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        decision === opt ? "border-indigo-800" : "border-gray-300"
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
            </div>

            {/* Evidence Upload Screen */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
                  <Upload size={20} />
                </div>
                <h2 className="text-lg font-bold text-indigo-900">
                  Evidence Upload (HR/Manager Email Confirmation / Reference Call Notes)
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-500">
                  Attach reference confirmation email, feedback form, or call verification notes (PDF, PNG, JPG up to 10MB).
                </p>

                {evidenceFile ? (
                  <div className="flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="text-indigo-600" size={24} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{evidenceFile.name}</p>
                        <p className="text-xs text-gray-500">{(evidenceFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEvidenceFile(null)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                      title="Remove file"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-xl cursor-pointer transition">
                    <CloudUpload size={36} className="text-indigo-600 mb-2" />
                    <span className="text-sm font-semibold text-indigo-950">Click to upload reference verification evidence</span>
                    <span className="text-xs text-gray-400 mt-1">PDF, JPG, JPEG, PNG</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEvidenceFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Verification Remarks & Submit */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-lg font-bold text-indigo-900">
                  Verification Remarks
                </h2>
              </div>

              <div className="relative">
                <textarea
                  rows="4"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value.slice(0, 1000))}
                  className="w-full rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                  placeholder="Enter remarks..."
                />
                <div className="absolute bottom-4 right-4 text-gray-400">
                  <Mic size={18} />
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 px-1 mb-4">
                <span className="text-xs text-gray-500">Max 1000 Characters</span>
                <span className="text-xs text-gray-500">{remarks.length} / 1000</span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-700 text-white rounded-lg font-semibold text-sm hover:bg-indigo-800 transition disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Submit Verification
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReferenceDetails;
