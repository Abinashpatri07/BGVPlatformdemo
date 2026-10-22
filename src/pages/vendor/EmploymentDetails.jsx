import { API_BASE_URL } from "../../API/config.js";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import {
  User,
  Briefcase,
  Eye,
  FileBadge,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = API_BASE_URL;

const getDocUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/\\/g, "/");
  return `${API}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN");
}

function EmploymentDetails() {
  const [decision, setDecision] = useState("Verified");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isView = searchParams.get("mode") === "view";
  const caseId = searchParams.get("caseId");

  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState({});
  const [employment, setEmployment] = useState([]);
  const [error, setError] = useState("");
  const [caseStatus, setCaseStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!caseId) { setLoading(false); return; }
    const token = localStorage.getItem("vendorToken");
    axiosInstance.get(`${API}/api/vendor/cases/employment/${caseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data.success) {
        setCandidate(res.data.candidate || {});
        setEmployment(res.data.employment || []);
        setCaseStatus(res.data.caseStatus || res.data.status || "");
      }
    }).catch(err => {
      setError("Failed to load data.");
      console.error(err);
    }).finally(() => setLoading(false));
  }, [caseId]);

  const handleSubmit = async () => {
    if (!remarks.trim()) { alert("Please enter remarks."); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("vendorToken");
      await axiosInstance.post(`${API}/api/vendor/cases/${caseId}/verify`, {
        decision, remarks
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Verification submitted successfully!");
      navigate(-1);
    } catch (e) {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-80">
      <Loader2 size={32} className="animate-spin text-indigo-600" />
    </div>
  );

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10 px-4 mt-4">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
            <ChevronLeft size={20} />
          </button>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Employment Details</h1>
            <span className="text-xs text-gray-500 font-medium">Case ID: CASE-{String(caseId).padStart(5, '0')}</span>
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

      {/* Candidate Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700"><User size={16} /></div>
          <h2 className="text-base font-semibold text-indigo-900">Candidate Information</h2>
        </div>
        <div className="flex flex-wrap gap-10">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">First Name</p>
            <p className="text-sm font-semibold text-gray-900">{candidate.candidate_first_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Last Name</p>
            <p className="text-sm font-semibold text-gray-900">{candidate.candidate_last_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Phone Number</p>
            <p className="text-sm font-semibold text-gray-900">{candidate.candidate_mobile ? `+91 ${candidate.candidate_mobile}` : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Email Id</p>
            <p className="text-sm font-semibold text-gray-900">{candidate.candidate_email || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Tag</p>
            <p className="text-sm font-semibold text-gray-900">{candidate.candidate_tag || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Function</p>
            <p className="text-sm font-semibold text-gray-900">{candidate.candidate_function || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Employment Records */}
      <div className="space-y-6">
        {employment.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center text-gray-500">
            No employment records found.
          </div>
        ) : (
          employment.map((emp, idx) => (
            <div key={emp.cand_emp_id} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    {emp.cand_emp_type || `Employment ${idx + 1}`}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Company Name <span className="text-red-500">*</span></p>
                      <p className="text-sm font-semibold text-gray-900">{emp.cand_emp_company || "N/A"}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                      <p className="text-sm font-semibold text-gray-900">{emp.cand_emp_empid || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Designation</p>
                      <p className="text-sm font-semibold text-gray-900">{emp.cand_emp_designation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">UAN Number</p>
                      <p className="text-sm font-semibold text-gray-900">{emp.cand_emp_uan_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">From Date</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(emp.cand_emp_from_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">To Date</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(emp.cand_emp_to_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Documents */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Documents</h3>
                  <div className="space-y-4">
                    {/* Service Letter */}
                    {emp.cand_emp_service ? (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                          <div className="truncate max-w-[280px]">
                            <p className="text-sm font-semibold text-gray-800">Service Letter</p>
                            <p className="text-xs text-gray-400 truncate">{emp.cand_emp_service}</p>
                          </div>
                          <button
                            onClick={() => setPreviewUrl(getDocUrl(emp.cand_emp_service))}
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 transition flex items-center gap-1 text-xs font-medium"
                            title="Preview Document"
                          >
                            <Eye size={18} />
                            Preview
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                          <FileBadge size={16} />
                        </div>
                        <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white text-center">
                          <p className="text-sm text-gray-400">No service letter uploaded</p>
                        </div>
                      </div>
                    )}

                    {/* Joining Letter */}
                    {emp.cand_emp_joining ? (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                          <div className="truncate max-w-[280px]">
                            <p className="text-sm font-semibold text-gray-800">Joining / Offer Letter</p>
                            <p className="text-xs text-gray-400 truncate">{emp.cand_emp_joining}</p>
                          </div>
                          <button
                            onClick={() => setPreviewUrl(getDocUrl(emp.cand_emp_joining))}
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 transition flex items-center gap-1 text-xs font-medium"
                            title="Preview Document"
                          >
                            <Eye size={18} />
                            Preview
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                          <FileBadge size={16} />
                        </div>
                        <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white text-center">
                          <p className="text-sm text-gray-400">No joining letter uploaded</p>
                        </div>
                      </div>
                    )}

                    {/* Payslip / Relieving */}
                    {emp.cand_emp_payslip ? (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                          <div className="truncate max-w-[280px]">
                            <p className="text-sm font-semibold text-gray-800">Relieving Letter / Payslip</p>
                            <p className="text-xs text-gray-400 truncate">{emp.cand_emp_payslip}</p>
                          </div>
                          <button
                            onClick={() => setPreviewUrl(getDocUrl(emp.cand_emp_payslip))}
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 transition flex items-center gap-1 text-xs font-medium"
                            title="Preview Document"
                          >
                            <Eye size={18} />
                            Preview
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                          <FileBadge size={16} />
                        </div>
                        <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white text-center">
                          <p className="text-sm text-gray-400">No relieving / payslip uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Decision (only edit mode) */}
      {!isView && (
        <>
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="p-1.5 bg-indigo-50 rounded text-indigo-700"><CheckSquare size={20} /></div>
              <h2 className="text-lg font-bold text-indigo-900">Verification Decision</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Verified", "Partially Verified", "Unable To Verify", "Verification Pending"].map((opt) => (
                <label key={opt} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${decision === opt ? "border-indigo-600 bg-indigo-50/30 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${decision === opt ? "border-indigo-800" : "border-gray-300"}`}>
                    {decision === opt && <div className="w-2.5 h-2.5 bg-indigo-800 rounded-full" />}
                  </div>
                  <input type="radio" className="hidden" value={opt} checked={decision === opt} onChange={() => setDecision(opt)} />
                  <span className={`text-sm font-semibold ${decision === opt ? "text-gray-900" : "text-gray-700"}`}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="p-1.5 bg-indigo-50 rounded text-indigo-700"><MessageSquare size={20} /></div>
              <h2 className="text-lg font-bold text-indigo-900">Verification Remarks</h2>
            </div>
            <div className="relative">
              <textarea
                rows="4"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value.slice(0, 1000))}
                className="w-full rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                placeholder="Enter remarks..."
              />
              <div className="absolute bottom-4 right-4 text-gray-400"><Mic size={18} /></div>
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
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Submit Verification
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default EmploymentDetails;
