import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Loader2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Tag,
  Briefcase,
  Calendar,
  Hash,
  Users,
  MapPin,
} from "lucide-react";

/* ── Helpers ──────────────────────────────────── */
const getStatusLabel = (status) => {
  switch (Number(status)) {
    case 1: return "Awaiting Input";
    case 2: return "Profile Complete";
    case 3: return "Verification In Progress";
    case 4: return "Verified";
    case 5: return "On Hold";
    case 6: return "Rejected";
    default: return "In Progress";
  }
};

const getStatusStyle = (label) => {
  switch (label) {
    case "Verified":                  return "bg-green-100 text-green-600";
    case "On Hold":                   return "bg-yellow-100 text-yellow-600";
    case "Rejected":                  return "bg-red-100 text-red-500";
    case "Verification In Progress":  return "bg-indigo-100 text-indigo-600";
    case "Profile Complete":          return "bg-teal-100 text-teal-600";
    default:                          return "bg-orange-100 text-orange-500";
  }
};

/* ── Sub-components ───────────────────────────── */
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <h3 className="text-[#2B3674] font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const LabelRow = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-xs text-gray-400 flex items-center gap-1">
      {Icon && <Icon size={12} />}
      {label}
    </p>
    <p className="text-sm font-medium text-gray-700">
      {value || <span className="text-gray-300 italic">Not provided</span>}
    </p>
  </div>
);

const EmptySection = ({ message = "No data submitted yet." }) => (
  <div className="flex flex-col items-center py-8 gap-2 text-gray-300">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
      <CheckCircle size={20} className="text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

/* ── Main Component ───────────────────────────── */
const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/candidates/get_candidate/${id}`
        );
        if (res.data.success) {
          setCandidate(res.data.candidate);
        }
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Candidate not found."
            : "Failed to load candidate details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-[#F4F7FE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-[#4338CA] animate-spin" />
          <p className="text-sm text-gray-400">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="p-6 min-h-screen bg-[#F4F7FE] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-[#01026E] underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = getStatusLabel(candidate.case_status);

  return (
    <div className="p-4 max-w-6xl mx-auto bg-[#F4F7FE] min-h-[80vh] space-y-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white transition"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {candidate.first_name} {candidate.last_name}
            </h2>
            <p className="text-xs text-gray-400">Case ID: {candidate.case_id}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(statusLabel)}`}>
          {statusLabel}
        </span>
      </div>

      {/* ── Top Grid ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Personal Details */}
        <SectionCard title="👤 Personal Details">
          <div className="grid grid-cols-2 gap-4">
            <LabelRow icon={User}     label="First Name"    value={candidate.first_name} />
            <LabelRow icon={User}     label="Last Name"     value={candidate.last_name} />
            <LabelRow icon={Phone}    label="Phone Number"  value={candidate.phone} />
            <LabelRow icon={Mail}     label="Email ID"      value={candidate.email} />
            <LabelRow icon={Calendar} label="Date of Birth" value={candidate.date_of_birth
              ? new Date(candidate.date_of_birth).toLocaleDateString("en-IN")
              : null}
            />
            <LabelRow icon={Users}    label="Gender"        value={
              candidate.gender === 1 ? "Male"
              : candidate.gender === 2 ? "Female"
              : candidate.gender === 3 ? "Other"
              : null
            } />
            <LabelRow icon={User}     label="Father Name"   value={candidate.father_name} />
            <LabelRow icon={User}     label="Nationality"   value={candidate.nationality} />
            <LabelRow icon={Tag}      label="Tag"           value={candidate.tag} />
            <LabelRow icon={Briefcase} label="Function"     value={candidate.job_function} />
            <LabelRow icon={Hash}     label="Candidate ID"  value={`#${candidate.cand_id}`} />
          </div>
        </SectionCard>

        {/* Address Details */}
        <SectionCard title="📍 Address Details">
          <EmptySection message="Candidate has not submitted address details yet." />
        </SectionCard>
      </div>

      {/* ── Identity Verification ── */}
      <SectionCard title="🪪 Identity Document Verification">
        <EmptySection message="No identity documents submitted yet." />
      </SectionCard>

      {/* ── Education ── */}
      <SectionCard title="🎓 Education Details">
        <EmptySection message="No education details submitted yet." />
      </SectionCard>

      {/* ── Employment ── */}
      <SectionCard title="💼 Employment Details">
        <EmptySection message="No employment details submitted yet." />
      </SectionCard>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-2 gap-4">
        <SectionCard title="🧪 Drug Test">
          <EmptySection message="Drug test report not available." />
        </SectionCard>

        <SectionCard title="🚔 Criminal Record">
          <EmptySection message="Criminal record check not done yet." />
        </SectionCard>
      </div>

      {/* ── Location Verification ── */}
      <SectionCard title="📍 Location Verification">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ON-SITE PHOTO */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">On-Site Photo</p>
            <div className="rounded-xl w-full h-48 bg-gray-100 border flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <MapPin size={28} />
                <p className="text-xs text-gray-400">Not uploaded yet</p>
              </div>
            </div>
          </div>

          {/* IDENTITY SELFIE */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">Identity Selfie</p>
            <div className="rounded-xl w-full h-48 bg-gray-100 border flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <User size={28} />
                <p className="text-xs text-gray-400">Not uploaded yet</p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-3">Status</p>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={16} className="text-gray-300" />
                On-Site Photo — Pending
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={16} className="text-gray-300" />
                Identity Selfie — Pending
              </p>
            </div>
          </div>

        </div>
      </SectionCard>

      {/* ── Meta Info ── */}
      <div className="text-xs text-gray-400 text-right pb-4">
        Created: {new Date(candidate.created_at).toLocaleString("en-IN")} &nbsp;|&nbsp;
        Updated: {new Date(candidate.updated_at).toLocaleString("en-IN")}
      </div>

    </div>
  );
};

export default CandidateDetails;