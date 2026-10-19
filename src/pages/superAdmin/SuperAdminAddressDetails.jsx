import React, { useState, useEffect } from "react";
import {
  MapPin,
  Home,
  User,
  Eye,
  CheckCircle2,
  FileBadge,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft,
  Loader2,
  ShieldCheck
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

function SuperAdminAddressDetails() {
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
          setRecords(res.data.records || []);
        }
      } catch (err) {
        console.error("Error fetching address case details:", err);
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
      alert("Address verification decision saved successfully!");
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

  const addrRecord = records[0] || {};

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
              {caseData?.caseId || (caseIdParam ? `Case #${caseIdParam}` : "Address Verification")}
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

      <div className="flex items-center gap-3 ml-2">
        <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
          <MapPin size={20} />
        </div>
        <h2 className="text-xl font-semibold text-indigo-900">
          Residential Address Verification
        </h2>
      </div>

      <div className="space-y-8 ml-2">
        {/* Present Address Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">
                  Present Address
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div className="col-span-2">
                  <Field label="Flat / House / Building" value={addrRecord.cand_curr_house} />
                </div>
                <div className="col-span-2">
                  <Field label="Street / Road" value={addrRecord.cand_curr_street} />
                </div>
                <Field label="Landmark" value={addrRecord.cand_curr_landmark} />
                <Field label="Locality" value={addrRecord.cand_curr_locality} />
                <Field label="City" value={addrRecord.cand_curr_city} />
                <Field label="District" value={addrRecord.cand_curr_district} />
                <Field label="State" value={addrRecord.cand_curr_state} />
                <Field label="PIN Code" value={addrRecord.cand_curr_pincode} />
                <Field label="Country" value={addrRecord.cand_curr_country || "India"} />
              </div>
            </div>

            {/* Evidence & Verification Support */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Verification Proof & Identity Source
              </h3>
              <div className="space-y-4">
                {addrRecord.cand_masked_aadhar && (
                  <div className="flex items-center gap-4">
                    <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="text-sm font-semibold text-gray-800">DigiLocker / Aadhaar Source</p>
                      <p className="text-xs font-mono text-gray-500">Masked Aadhaar: {addrRecord.cand_masked_aadhar}</p>
                    </div>
                  </div>
                )}

                {addrRecord.cand_photo ? (
                  <div className="flex items-center gap-4">
                    <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Verified Photo</p>
                        <p className="text-xs text-gray-400">Captured during verification</p>
                      </div>
                      <a 
                        href={(() => {
                          const p = addrRecord.cand_photo.replace(/\\/g, "/");
                          return p.startsWith("http") ? p : `${API_BASE}/${p.startsWith("/") ? p.slice(1) : p}`;
                        })()}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition"
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
                    <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white">
                      <p className="text-sm font-semibold text-gray-800">Physical Evidence</p>
                      <p className="text-xs text-gray-400">Verified electronically via candidate portal</p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
                  <span>Address verified via DigiLocker / Aadhaar e-KYC service.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permanent Address Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
                  <Home size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">
                  Permanent Address
                  {addrRecord.is_add_same === 1 && (
                    <span className="ml-2 text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Same as present address
                    </span>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div className="col-span-2">
                  <Field label="Flat / House / Building" value={addrRecord.cand_perm_house || (addrRecord.is_add_same ? addrRecord.cand_curr_house : null)} />
                </div>
                <div className="col-span-2">
                  <Field label="Street / Road" value={addrRecord.cand_perm_street || (addrRecord.is_add_same ? addrRecord.cand_curr_street : null)} />
                </div>
                <Field label="Landmark" value={addrRecord.cand_perm_landmark || (addrRecord.is_add_same ? addrRecord.cand_curr_landmark : null)} />
                <Field label="Locality" value={addrRecord.cand_perm_locality || (addrRecord.is_add_same ? addrRecord.cand_curr_locality : null)} />
                <Field label="City" value={addrRecord.cand_perm_city || (addrRecord.is_add_same ? addrRecord.cand_curr_city : null)} />
                <Field label="District" value={addrRecord.cand_perm_district || (addrRecord.is_add_same ? addrRecord.cand_curr_district : null)} />
                <Field label="State" value={addrRecord.cand_perm_state || (addrRecord.is_add_same ? addrRecord.cand_curr_state : null)} />
                <Field label="PIN Code" value={addrRecord.cand_perm_pincode || (addrRecord.is_add_same ? addrRecord.cand_curr_pincode : null)} />
                <Field label="Country" value={addrRecord.cand_perm_country || "India"} />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <MapPin size={36} className="text-indigo-600 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-gray-800">
                {addrRecord.is_add_same ? "Permanent Address Identical to Present" : "Separate Permanent Residence Registered"}
              </p>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Candidate confirmed residency records during onboarding submission.
              </p>
            </div>
          </div>
        </div>

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
                  name="address-decision"
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

          {/* Remarks */}
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
                placeholder="Enter address verification remarks..."
              />
              <div className="absolute bottom-4 right-4 text-gray-400">
                <Mic size={18} />
              </div>
            </div>
          </div>

          {/* Actions */}
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

export default SuperAdminAddressDetails;
