import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Eye,
  Trash2,
  CloudUpload,
  CheckCircle2,
  FileText,
  FileBadge,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  Loader2,
  Building2
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

function DocSlot({ label, isView, url }) {
  if (url) {
    return (
      <div className="flex items-center gap-4">
        <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
        <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-gray-800">{label}</p>
            <p className="text-xs text-gray-400">Attached</p>
          </div>
          <a
            href={getDocUrl(url)}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition"
            title={`View ${label}`}
          >
            <Eye size={18} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
        <FileBadge size={16} />
      </div>
      <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400">Not uploaded</p>
        </div>
        <span className="text-gray-300"><Eye size={18} /></span>
      </div>
    </div>
  );
}

function SuperAdminEmploymentDetails() {
  const [decision, setDecision] = useState("Verified");
  const [gpsVerified, setGpsVerified] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
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
        console.error("Error fetching employment case details:", err);
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

      {/* HEADER */}
      {isView ? (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition">
                <ChevronLeft size={20} />
              </button>
              <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700"><User size={20} /></div>
              <h2 className="text-xl font-semibold text-indigo-900">
                {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Employment Details")}
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-10 lg:gap-14 items-start ml-2">
              <Field label="First Name" value={candidate?.firstName} />
              <Field label="Last Name" value={candidate?.lastName} />
              <Field label="Phone Number" value={candidate?.phone} />
              <Field label="Email Id" value={candidate?.email} />
              <Field label="Department / Function" value={candidate?.department} />
              {candidate?.experience && <Field label="Experience" value={`${candidate.experience} yrs`} />}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-2">
            <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700"><Briefcase size={20} /></div>
            <h2 className="text-xl font-semibold text-indigo-900">
              Employment Details
              {records.length > 0 && <span className="ml-2 text-sm font-medium text-indigo-400">({records.length} record{records.length > 1 ? "s" : ""})</span>}
            </h2>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4 border-b border-indigo-100 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
            <ChevronLeft size={20} />
          </button>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100"><Briefcase size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Employment Details</h1>
            {caseData && <p className="text-xs text-gray-500">{caseData.caseId} • {candidate?.fullName}</p>}
          </div>
        </div>
      )}

      {/* RECORDS */}
      <div className="space-y-6 mt-4 ml-2">
        {records.length > 0 ? (
          records.map((emp, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700"><Building2 size={18} /></div>
                    <h3 className="text-lg font-bold text-gray-900">{emp.cand_emp_company || `Employer ${index + 1}`}</h3>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">
                      {emp.cand_emp_type || "Employment"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                    <Field label="Employee ID" value={emp.cand_emp_empid} />
                    <Field label="Company Name" value={emp.cand_emp_company} />
                    <Field label="First Name" value={emp.cand_first_name || candidate?.firstName} />
                    <Field label="Last Name" value={emp.cand_last_name || candidate?.lastName} />
                    <Field label="From Date" value={fmtDate(emp.cand_emp_from_date)} />
                    <Field label="To Date" value={fmtDate(emp.cand_emp_to_date)} />
                    <Field label="Designation" value={emp.cand_emp_designation} />
                    <Field label="UAN Number" value={emp.cand_emp_uan_number} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Company Documents</h3>
                  <div className="space-y-4">
                    <DocSlot 
                      label="Service Letter" 
                      isView={isView} 
                      url={emp.cand_emp_service} 
                    />
                    <DocSlot 
                      label="Joining Letter / Offer Letter" 
                      isView={isView} 
                      url={emp.cand_emp_joining} 
                    />
                    <DocSlot 
                      label="Relieving Letter / Pay Slip" 
                      isView={isView} 
                      url={emp.cand_emp_payslip} 
                    />
                    <DocSlot 
                      label="HR Verification E-mail" 
                      isView={isView} 
                      url={null} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center py-16">
            <Briefcase size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400 font-medium">
              {caseIdParam ? "No employment records found for this case." : "No case selected."}
            </p>
          </div>
        )}

        {/* Verification Decision + Remarks */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded text-indigo-700"><CheckSquare size={20} /></div>
                <h2 className="text-lg font-bold text-indigo-900">Verification Decision</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {["Verified", "Partially Verified", "Unable To Verify", "Verification Pending"].map((opt) => (
                  <label key={opt} onClick={() => setDecision(opt)}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${decision === opt ? "border-indigo-600 bg-indigo-50/30 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${decision === opt ? "border-indigo-800" : "border-gray-300"}`}>
                      {decision === opt && <div className="w-2.5 h-2.5 bg-indigo-800 rounded-full" />}
                    </div>
                    <span className={`text-sm font-semibold ${decision === opt ? "text-gray-900" : "text-gray-700"}`}>{opt}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Verification Date &amp; Time</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleString("en-IN")}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 mb-2 font-medium">GPS Verified</span>
                  <button type="button" onClick={() => setGpsVerified(!gpsVerified)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gpsVerified ? "bg-indigo-600" : "bg-gray-300"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gpsVerified ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded text-indigo-700"><MessageSquare size={20} /></div>
                <h2 className="text-lg font-bold text-indigo-900">Verification Remarks</h2>
              </div>
              <div className="relative">
                <textarea rows="4" value={remarks} onChange={(e) => setRemarks(e.target.value.slice(0, 1000))}
                  className="w-full rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                  placeholder="Enter remarks..." />
                <div className="absolute bottom-4 right-4 text-gray-400"><Mic size={18} /></div>
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs text-gray-500">Max 1000 Characters</span>
                <span className="text-xs text-gray-500">{remarks.length} / 1000</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Back to Cases
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  if (!caseIdParam) return;
                  try {
                    const res = await axios.post(`${API_BASE}/api/superadmin/cases/update-decision`, {
                      caseId: caseIdParam,
                      decision,
                      remarks
                    });
                    if (res.data.success) {
                      alert("Employment verification decision saved successfully!");
                      navigate(-1);
                    }
                  } catch (err) {
                    console.error("Save decision error:", err);
                    alert("Failed to save decision: " + (err.response?.data?.message || err.message));
                  }
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#05058D] hover:bg-blue-800 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                Save Decision
              </button>
            </div>
      </div>
    </div>
  );
}

export default SuperAdminEmploymentDetails;
