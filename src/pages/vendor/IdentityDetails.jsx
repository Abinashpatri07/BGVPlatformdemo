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
  FileText
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      await axios.post(
        `${API}/api/vendor/cases/${caseId}/verify`,
        { decision, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
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
      </div>

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
              {doc.cand_ident_name || `Document ${idx + 1}`}
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
                {activeDoc.cand_ident_name || "Identity Document"} Information
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Document Type</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {activeDoc.cand_ident_name || "N/A"}
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
                {activeDoc.cand_ident_front_file && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Front Document File</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText size={18} className="text-indigo-600" />
                      <span className="text-xs text-gray-600 truncate flex-1">
                        {activeDoc.cand_ident_front_file}
                      </span>
                      <a
                        href={getDocUrl(activeDoc.cand_ident_front_file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                      >
                        <Eye size={16} />
                      </a>
                    </div>
                  </div>
                )}
                {activeDoc.cand_ident_back_file && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Back Document File</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText size={18} className="text-indigo-600" />
                      <span className="text-xs text-gray-600 truncate flex-1">
                        {activeDoc.cand_ident_back_file}
                      </span>
                      <a
                        href={getDocUrl(activeDoc.cand_ident_back_file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 p-1"
                      >
                        <Eye size={16} />
                      </a>
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
