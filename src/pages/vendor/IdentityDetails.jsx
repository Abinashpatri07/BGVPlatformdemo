import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IdCard,
  User,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Calendar,
  CreditCard,
  Building,
  CheckSquare,
  MessageSquare,
  Loader2,
  FileText,
  Upload,
  CloudUpload,
  Trash2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getDocUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/\\/g, "/");
  return `${API}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

export default function IdentityDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get("caseId");
  const isView = searchParams.get("mode") === "view";

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState({});
  const [records, setRecords] = useState([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [decision, setDecision] = useState("Verified");
  const [remarks, setRemarks] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [caseStatus, setCaseStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("vendorToken");
    axios
      .get(`${API}/api/vendor/cases/identity/${caseId}`, {
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
        console.error("Failed to load identity details:", err);
        setError("Failed to load identity verification data.");
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
      await axios.post(
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

  const activeDoc = records[selectedDocIndex] || records[0] || null;

  const getIdNumber = (doc) => {
    if (!doc) return "N/A";
    return (
      doc.pan_number ||
      doc.driving_number ||
      doc.voter_number ||
      doc.passport_number ||
      doc.uan_number ||
      doc.cand_ident_number ||
      "N/A"
    );
  };

  const getIssueDate = (doc) => {
    if (!doc) return "N/A";
    const d = doc.driv_issue_date || doc.pass_issue_date || doc.voter_issue_date;
    return d ? new Date(d).toLocaleDateString() : "N/A";
  };

  const getExpiryDate = (doc) => {
    if (!doc) return "N/A";
    const d = doc.pass_expiry_date || doc.driv_expiry_date;
    return d ? new Date(d).toLocaleDateString() : "N/A";
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
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in pb-12 px-4 mt-4">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-700 border border-indigo-100">
            <IdCard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-950">
              Identification Verification Details
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Case ID: CASE-{String(caseId).padStart(5, "0")}
            </p>
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

      {/* Document Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Document Preview</h3>
              <button onClick={() => setPreviewUrl(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                ✕
              </button>
            </div>
            <div className="p-4">
              {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img src={previewUrl} alt="Document preview" className="w-full rounded-lg" />
              ) : previewUrl.match(/\.pdf$/i) ? (
                <iframe src={previewUrl} className="w-full h-[60vh] rounded-lg border border-gray-100" title="PDF Preview" />
              ) : (
                <div className="text-center py-10">
                  <FileText size={40} className="mx-auto text-indigo-400 mb-3" />
                  <p className="text-gray-600 mb-4">Cannot preview this file type directly.</p>
                  <a href={previewUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                    Open in New Tab
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE INFO */}
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

      {/* DOCUMENT TABS */}
      {records.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {records.map((doc, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDocIndex(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                selectedDocIndex === idx
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <CreditCard size={14} />
              {doc.cand_iden_type || doc.cand_ident_name || `Document ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* DOCUMENT DETAILS CARD */}
      {!activeDoc ? (
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center text-gray-500">
          No identification records found.
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Document Metadata */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {activeDoc.cand_iden_type || activeDoc.cand_ident_name || "Identity Document"} Information
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Document Type</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {activeDoc.cand_iden_type || activeDoc.cand_ident_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID Number</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getIdNumber(activeDoc)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getIssueDate(activeDoc)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getExpiryDate(activeDoc)}
                  </p>
                </div>
                {activeDoc.cand_iden_docu && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Identity Document File</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText size={18} className="text-indigo-600" />
                      <span className="text-xs text-gray-600 truncate flex-1 font-mono">
                        {activeDoc.cand_iden_docu.split("/").pop() || activeDoc.cand_iden_docu}
                      </span>
                      <button
                        onClick={() => setPreviewUrl(getDocUrl(activeDoc.cand_iden_docu))}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition flex items-center gap-1 text-xs font-medium"
                        title="Preview document"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                    </div>
                  </div>
                )}
                {activeDoc.cand_ident_front_file && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Front Document File</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText size={18} className="text-indigo-600" />
                      <span className="text-xs text-gray-600 truncate flex-1 font-mono">
                        {activeDoc.cand_ident_front_file.split("/").pop() || activeDoc.cand_ident_front_file}
                      </span>
                      <button
                        onClick={() => setPreviewUrl(getDocUrl(activeDoc.cand_ident_front_file))}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition flex items-center gap-1 text-xs font-medium"
                        title="Preview document"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                    </div>
                  </div>
                )}
                {activeDoc.cand_ident_back_file && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Back Document File</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText size={18} className="text-indigo-600" />
                      <span className="text-xs text-gray-600 truncate flex-1 font-mono">
                        {activeDoc.cand_ident_back_file.split("/").pop() || activeDoc.cand_ident_back_file}
                      </span>
                      <button
                        onClick={() => setPreviewUrl(getDocUrl(activeDoc.cand_ident_back_file))}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition flex items-center gap-1 text-xs font-medium"
                        title="Preview document"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Verification Status / Preview */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Verification Details
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                <div>
                  <span className="text-xs text-gray-500">System Verification Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      {activeDoc.iden_verification_status === 2
                        ? "Verified"
                        : activeDoc.iden_verification_status === 3
                        ? "Rejected"
                        : "Pending Verification"}
                    </span>
                  </div>
                </div>
                {activeDoc.iden_verification_comment && (
                  <div>
                    <span className="text-xs text-gray-500">Comments</span>
                    <p className="text-xs text-gray-700 mt-0.5">
                      {activeDoc.iden_verification_comment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                    name="vendor-ident-decision"
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
                Evidence Upload (ID Match Proof / Offline Verification)
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Attach verification report, official portal confirmation screenshot, or field check proof (PDF, PNG, JPG up to 10MB).
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
                  <span className="text-sm font-semibold text-indigo-950">Click to upload verification evidence</span>
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
  );
}
