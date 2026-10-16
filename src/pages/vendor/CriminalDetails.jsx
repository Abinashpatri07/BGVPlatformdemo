import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShieldAlert,
  Eye,
  CheckCircle2,
  FileWarning,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  User,
  Loader2,
  Scale
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getDocUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/\\/g, "/");
  return `${API}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

function CriminalDetails() {
  const [recordIdentified, setRecordIdentified] = useState("No Record Found");
  const [decision, setDecision] = useState("Verified");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState({});
  const [criminal, setCriminal] = useState(null);
  const [error, setError] = useState("");

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
      .get(`${API}/api/vendor/cases/criminal/${caseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (res.data.success) {
          setCandidate(res.data.candidate || {});
          const crim = res.data.criminal || (res.data.records && res.data.records[0]) || null;
          setCriminal(crim);
          if (crim) {
            const hasRecord = crim.cand_crim_record === "Yes" || crim.cand_crim_record === 1;
            setRecordIdentified(hasRecord ? "Yes Record Found" : "No Record Found");
            if (crim.cand_crim_remarks) {
              setRemarks(crim.cand_crim_remarks);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load criminal details:", err);
        setError("Failed to load criminal case data.");
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
      <div className="flex items-center gap-4 border-b border-indigo-100 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
          <ShieldAlert size={24} />
        </div>
        <h1 className="text-2xl font-bold text-indigo-900">
          Criminal Check Details
        </h1>
        {caseId && (
          <span className="ml-auto text-sm text-gray-500 font-medium">
            Case ID: CASE-{String(caseId).padStart(5, "0")}
          </span>
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

      <div className="space-y-8 mt-6">
        {/* Main Details Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Criminal Record Result */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-700">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">
                  Criminal Background Verification
                </h3>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-4">
                  Has a criminal record or active citation been identified?
                </p>
                <div className="space-y-4">
                  {/* Option No Record */}
                  <label
                    onClick={() => setRecordIdentified("No Record Found")}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      recordIdentified === "No Record Found"
                        ? "border-emerald-500 bg-emerald-50/20 shadow-sm"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-900 text-sm">
                          No Record Found
                        </span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          Candidate background is clear
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        recordIdentified === "No Record Found"
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {recordIdentified === "No Record Found" && (
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      )}
                    </div>
                  </label>

                  {/* Option Yes Record */}
                  <label
                    onClick={() => setRecordIdentified("Yes Record Found")}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      recordIdentified === "Yes Record Found"
                        ? "border-red-400 bg-red-50/30 shadow-sm"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-red-100 text-red-500 rounded-full">
                        <FileWarning size={16} />
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-900 text-sm">
                          Yes Record Found
                        </span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          Offence or police case record exists
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        recordIdentified === "Yes Record Found"
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      {recordIdentified === "Yes Record Found" && (
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {criminal && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Candidate Declared Status</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {criminal.cand_crim_record || "None specified"}
                  </p>
                  {criminal.cand_crim_remarks && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Candidate Remarks</p>
                      <p className="text-xs text-gray-700">{criminal.cand_crim_remarks}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Evidence / Report */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Supporting Evidence / Police Report
              </h3>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Candidate or police verification report uploaded for this case.
              </p>

              <div className="space-y-4">
                {criminal && criminal.cand_crim_report ? (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    </div>
                    <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="truncate max-w-[280px]">
                        <p className="text-sm font-semibold text-gray-800">Criminal Verification Document</p>
                        <p className="text-xs text-gray-400 truncate">{criminal.cand_crim_report}</p>
                      </div>
                      <a
                        href={getDocUrl(criminal.cand_crim_report)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 p-2 transition"
                      >
                        <Eye size={18} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                      <Scale size={16} />
                    </div>
                    <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-4 bg-white text-center">
                      <p className="text-sm text-gray-400">No report or document uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
                      name="vendor-criminal-decision"
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

export default CriminalDetails;
