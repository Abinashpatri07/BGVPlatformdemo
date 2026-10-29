import { API_BASE_URL } from "../../API/config.js";
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
  ChevronLeft,
  Loader2,
  Building2,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const API_BASE = API_BASE_URL;

const fmtDate = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return String(d); }
};

const getDocUrl = (path) => {
  if (!path) return null;
  let clean = path.replace(/\\/g, "/");
  if (clean.includes("bgvplatform-backend.onrender.com")) {
    clean = clean.replace("https://bgvplatform-backend.onrender.com", API_BASE).replace("http://bgvplatform-backend.onrender.com", API_BASE);
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
        const res = await axiosInstance.get(`${API_BASE}/api/superadmin/cases/details/${caseIdParam}`);
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

        {/* Case Verification Status */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded text-indigo-700"><ShieldCheck size={20} /></div>
            <h2 className="text-lg font-bold text-indigo-900">Case Verification Status</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Current Status</p>
              {(() => {
                const s = parseInt(caseData?.verificationStatus);
                const labels = { 1: "Pending", 2: "Assigned", 3: "In Progress", 4: "Verified", 5: "Refuted", 6: "On Hold" };
                const colors = { 1: "bg-blue-50 text-blue-700", 2: "bg-purple-50 text-purple-700", 3: "bg-blue-50 text-blue-700", 4: "bg-emerald-50 text-emerald-700", 5: "bg-red-50 text-red-700", 6: "bg-amber-50 text-amber-700" };
                return <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors[s] || "bg-gray-100 text-gray-700"}`}>{labels[s] || "Unverified"}</span>;
              })()}
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Assigned Vendor</p>
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-indigo-500 shrink-0" />
                <p className="text-sm font-semibold text-gray-900 truncate">{caseData?.vendorName || "Not Assigned"}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1">Assigned Date</p>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-500 shrink-0" />
                <p className="text-sm font-semibold text-gray-900">
                  {caseData?.assignedDate ? new Date(caseData.assignedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          </div>
          {caseData?.verificationComment && (
            <div className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Verification Remarks (by Vendor)</p>
              <p className="text-sm text-gray-700">{caseData.verificationComment}</p>
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">
              ← Back to Cases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminEmploymentDetails;
