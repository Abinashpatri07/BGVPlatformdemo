import React, { useState, useEffect } from "react";
import {
  Users,
  User,
  CheckCircle2,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  Loader2,
  Building2,
  Phone,
  Mail,
  HeartHandshake
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
);

function SuperAdminReferenceDetails() {
  const [decision, setDecision] = useState("Verified");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [records, setRecords] = useState([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
          const recs = res.data.records || [];
          setRecords(recs);
          if (recs.length > 0 && recs[0].ref_verification_comment) {
            setRemarks(recs[0].ref_verification_comment);
          }
        }
      } catch (err) {
        console.error("Error fetching reference check case details:", err);
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
      alert("Reference check verification decision saved successfully!");
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
      {/* Header Profile Section */}
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
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Reference Check Verification")}
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
          <Field label="Function / Dept" value={candidate?.department} />
          {candidate?.dob && <Field label="Date of Birth" value={new Date(candidate.dob).toLocaleDateString()} />}
        </div>
      </div>

      {/* Reference Header */}
      <div className="flex items-center gap-3 ml-2">
        <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
          <Users size={20} />
        </div>
        <h2 className="text-xl font-semibold text-indigo-900">
          Reference Check Details
          {records.length > 0 && (
            <span className="ml-2 text-sm font-medium text-indigo-400">
              ({records.length} record{records.length > 1 ? "s" : ""})
            </span>
          )}
        </h2>
      </div>

      {/* Reference Records List */}
      <div className="space-y-6 ml-2">
        {records.length > 0 ? (
          records.map((ref, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    {ref.cand_ref_type === "Organization" ? <Building2 size={20} /> : <HeartHandshake size={20} />}
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
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold">
                  {ref.cand_ref_relation || "Verified Reference"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="Reference Name" value={ref.cand_ref_name} />
                <Field label="Reference Type" value={ref.cand_ref_type} />
                <Field label="Relationship / Role" value={ref.cand_ref_relation} />
                <Field label="Designation" value={ref.cand_ref_designation} />
                <Field label="Phone Number" value={ref.cand_ref_phone ? `+91 ${ref.cand_ref_phone}` : null} />
                <Field label="Email Address" value={ref.cand_ref_email} />
                <Field 
                  label={ref.cand_ref_type === "Organization" ? "Company / Institution" : "Associated Org"} 
                  value={ref.cand_ref_org} 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm text-gray-500">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700">No Reference Records Found</p>
            <p className="text-xs text-gray-400 mt-1">This candidate has not submitted reference check details yet.</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              "Verified",
              "Partially Verified",
              "Unable To Verify",
              "Verification Pending"
            ].map((option) => (
              <label 
                key={option}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  decision === option 
                    ? "border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500/20" 
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setDecision(option)}
              >
                <span className={`text-sm font-semibold ${decision === option ? "text-indigo-900" : "text-gray-700"}`}>
                  {option}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  decision === option ? "border-indigo-600" : "border-gray-300"
                }`}>
                  {decision === option && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
              </label>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <MessageSquare size={18} className="text-indigo-600" />
              <label className="text-sm font-bold text-gray-900">
                Verification Remarks &amp; Feedback
              </label>
            </div>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official reference feedback or telephonic verification summary notes..."
              className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveDecision}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Save Decision
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminReferenceDetails;
