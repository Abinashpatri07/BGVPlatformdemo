import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  User, MapPin, IdCard, GraduationCap, Briefcase,
  ShieldCheck, Users, CheckCircle, Eye, Trash2, Pencil, Loader2,
  FileText, Download, XCircle
} from "lucide-react";
import PhoneInputPkg from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputPkg.default || PhoneInputPkg;

const BASE = `${import.meta.env.VITE_API_URL}/api/candidates`;

const resolveDocUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  let clean = trimmed.replace(/\\/g, "/");
  if (clean.startsWith("/")) clean = clean.slice(1);
  if (!clean.startsWith("uploads/")) {
    clean = `uploads/${clean}`;
  }
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${clean}`;
};

const DocumentPreviewCard = ({ url, title = "Document Preview" }) => {
  const resolvedUrl = resolveDocUrl(url);

  if (!resolvedUrl) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <XCircle size={28} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-400 font-medium">No document uploaded</p>
      </div>
    );
  }

  const lUrl = resolvedUrl.toLowerCase();
  const isPdf = lUrl.endsWith(".pdf") || lUrl.includes(".pdf");
  const fileName = resolvedUrl.split("/").pop();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <p className="text-sm font-semibold text-[#01026E]">{title}</p>
        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
          {isPdf ? "PDF" : "Image"}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {isPdf ? (
          <div className="w-full flex flex-col items-center justify-center py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-2 shadow-sm">
              <FileText size={28} />
            </div>
            <p className="text-xs font-semibold text-gray-700 mb-1">PDF Document</p>
            <p className="text-[11px] text-gray-400 mb-3 max-w-[180px] truncate text-center" title={fileName}>
              {fileName}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-white bg-[#01026E] px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition font-medium"
              >
                <Eye size={13} /> View PDF
              </a>
              <a
                href={resolvedUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-700 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition font-medium"
                title="Download"
              >
                <Download size={13} />
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <div className="relative group overflow-hidden rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center min-h-[170px] max-h-[240px] p-1">
              <img
                src={resolvedUrl}
                alt={title}
                className="max-h-[230px] w-auto max-w-full object-contain mx-auto"
                onError={(e) => {
                  e.target.style.display = "none";
                  const parent = e.target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center p-4 text-center">
                        <p class="text-xs text-gray-400 mb-2">Preview unavailable</p>
                        <a href="${resolvedUrl}" target="_blank" class="text-xs font-medium text-indigo-700 underline">
                          Open File &rarr;
                        </a>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 truncate max-w-[140px]" title={fileName}>
                {fileName}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#01026E] hover:underline font-medium"
                >
                  <Eye size={13} /> Full View
                </a>
                <a
                  href={resolvedUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium"
                  title="Download"
                >
                  <Download size={13} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── helpers ─── */
const statusBadge = (s) => {
  switch (Number(s)) {
    case 1: return { label: "Verified",     cls: "bg-green-100 text-green-600" };
    case 2: return { label: "In Progress",  cls: "bg-yellow-100 text-yellow-600" };
    case 3: return { label: "Rejected",     cls: "bg-red-100 text-red-500" };
    default: return { label: "Pending",     cls: "bg-gray-100 text-gray-500" };
  }
};

const docTypeLabel = (t) =>
  ({ 1: "PAN Card", 2: "Aadhaar", 3: "Passport", 4: "Driving License", 5: "Voter ID" }[t] || "Document");

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "—");

/* ─── Skeleton ─── */
const Skeleton = () => (
  <div className="flex flex-col gap-4 mt-2">
    {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
  </div>
);

/* ─── Input (read-only view) ─── */
const Field = ({ label, value }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      defaultValue={value ?? ""}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#01026E] bg-gray-50"
      readOnly
    />
  </div>
);

/* ─── Input (editable) ─── */
const EditField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    {name === "phone" ? (
      <div className="border rounded-lg transition border-gray-300">
        <PhoneInput
          country={'in'}
          value={value}
          onChange={(phone) => onChange({ target: { name: "phone", value: phone } })}
          enableSearch={true}
          disableSearchIcon={true}
          inputStyle={{
            width: '100%',
            height: '38px',
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            paddingLeft: '48px'
          }}
          buttonStyle={{
            border: 'none',
            background: '#f9fafb',
            padding: '0 4px',
            borderRight: '1px solid #e5e7eb'
          }}
        />
      </div>
    ) : (
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#01026E]"
      />
    )}
  </div>
);

/* ════════════════ PERSONAL TAB ════════════════ */
function PersonalTab({ candId }) {
  const [data, setData]     = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  useEffect(() => {
    axios.get(`${BASE}/${candId}/personal`)
      .then(r => setData(r.data.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [candId]);

  const onChange = (e) => setData(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true); setMsg("");
    try {
      await axios.put(`${BASE}/${candId}/personal`, data);
      setMsg("✅ Saved successfully!");
    } catch { setMsg("❌ Save failed."); }
    finally { setSaving(false); }
  };

  if (loading) return <Skeleton />;

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      <p className="text-sm text-gray-500 mb-6">General Profile Details And Contact Information.</p>
      <div className="grid grid-cols-2 gap-5">
        <EditField label="First Name"    name="first_name"    value={data.first_name}   onChange={onChange} />
        <EditField label="Last Name"     name="last_name"     value={data.last_name}    onChange={onChange} />
        <EditField label="Email"         name="email"         value={data.email}         onChange={onChange} type="email" />
        <EditField label="Phone"         name="phone"         value={data.phone}         onChange={onChange} />
        <EditField label="Date of Birth" name="date_of_birth" value={data.date_of_birth?.slice(0,10)} onChange={onChange} type="date" />
        <EditField label="Father Name"   name="father_name"   value={data.father_name}  onChange={onChange} />
        <EditField label="Nationality"   name="nationality"   value={data.nationality}  onChange={onChange} />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Gender</label>
          <select name="gender" value={data.gender ?? ""} onChange={onChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#01026E]">
            <option value="">Select</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">Other</option>
          </select>
        </div>
        <EditField label="Function" name="job_function" value={data.job_function} onChange={onChange} />
        <EditField label="Tag"      name="tag"          value={data.tag}          onChange={onChange} />
      </div>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <div className="flex items-center justify-between mt-8">
        <p className="text-xs text-gray-400">Last edited: {fmtDate(data.updated_at)}</p>
        <button onClick={onSave} disabled={saving}
          className="px-5 py-2 bg-[#01026E] text-white rounded-lg text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-60">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Profile Details"}
        </button>
      </div>
    </>
  );
}

/* ════════════════ ADDRESS TAB ════════════════ */
function AddressTab({ candId }) {
  const [data, setData]     = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  useEffect(() => {
    axios.get(`${BASE}/${candId}/address`)
      .then(r => setData(r.data.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [candId]);

  const onChange = (e) => setData(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async () => {
    setSaving(true); setMsg("");
    try {
      await axios.put(`${BASE}/${candId}/address`, data);
      setMsg("✅ Address saved!");
    } catch { setMsg("❌ Save failed."); }
    finally { setSaving(false); }
  };

  if (loading) return <Skeleton />;

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Present Address</h3>
      <p className="text-sm text-gray-500 mb-6">Current residential address details.</p>
      <div className="grid grid-cols-2 gap-5 mb-8">
        <EditField label="Address Line 1" name="candidate_current_address" value={data.candidate_current_address} onChange={onChange} />
        <EditField label="Pin Code"       name="current_zipcode"           value={data.current_zipcode}           onChange={onChange} />
        <EditField label="City"           name="current_city"              value={data.current_city}              onChange={onChange} />
        <EditField label="Area"           name="current_area"              value={data.current_area}              onChange={onChange} />
        <EditField label="State"          name="current_state"             value={data.current_state}             onChange={onChange} />
        <EditField label="Country"        name="current_country"           value={data.current_country}           onChange={onChange} />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Permanent Address</h3>
      <div className="grid grid-cols-2 gap-5">
        <EditField label="Address"  name="permanent_address"  value={data.permanent_address}  onChange={onChange} />
        <EditField label="Pin Code" name="permanent_zipcode"  value={data.permanent_zipcode}  onChange={onChange} />
        <EditField label="City"     name="permanent_city"     value={data.permanent_city}     onChange={onChange} />
        <EditField label="Area"     name="permanent_area"     value={data.permanent_area}     onChange={onChange} />
        <EditField label="State"    name="permanent_state"    value={data.permanent_state}    onChange={onChange} />
        <EditField label="Country"  name="permanent_country"  value={data.permanent_country}  onChange={onChange} />
      </div>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
      <div className="flex justify-end mt-6">
        <button onClick={onSave} disabled={saving}
          className="px-5 py-2 bg-[#01026E] text-white rounded-lg text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-60">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving..." : "Save Address"}
        </button>
      </div>
    </>
  );
}

/* ════════════════ IDENTITY TAB ════════════════ */
function IdentityTab({ candId }) {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE}/${candId}/identity`)
      .then(r => setDocs(r.data.data || []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [candId]);

  if (loading) return <Skeleton />;

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Identity Information</h3>
      <p className="text-sm text-gray-500 mb-6">Government ID proofs uploaded by candidate.</p>

      {docs.length === 0 ? (
        <p className="text-sm text-gray-400 mt-4">No identity documents found.</p>
      ) : (
        <div className="space-y-6">
          {docs.map((doc) => {
            const { label, cls } = statusBadge(doc.verification_status);
            const docUrl = doc.doc_file_path || doc.cand_iden_docu;
            return (
              <div key={doc.id_doc_id} className="border rounded-xl p-5 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <h4 className="font-medium text-[#01026E] text-base">{docTypeLabel(doc.doc_type)}</h4>
                  <span className={`text-xs px-3 py-1 rounded-full ${cls}`}>{label}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <Field label="ID Number" value={doc.doc_number} />
                    <Field label="Document Type" value={docTypeLabel(doc.doc_type)} />
                    {doc.upload_date && (
                      <div className="text-xs text-gray-400">
                        Uploaded on: <span className="font-medium text-gray-600">{fmtDate(doc.upload_date)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <DocumentPreviewCard
                      url={docUrl}
                      title={`${docTypeLabel(doc.doc_type)} Proof`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ════════════════ EDUCATION TAB ════════════════ */
function EducationTab({ candId }) {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [docType, setDocType]   = useState("certificate");

  useEffect(() => {
    axios.get(`${BASE}/${candId}/education`)
      .then(r => setList(r.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [candId]);

  if (loading) return <Skeleton />;

  if (viewItem) {
    const { label, cls } = statusBadge(viewItem.verification_status);
    const hasCert = Boolean(viewItem.doc_file_path || viewItem.cand_edu_certificate);
    const hasMarksheet = Boolean(viewItem.marksheet_file_path || viewItem.cand_edu_marksheet);
    const certUrl = viewItem.doc_file_path || viewItem.cand_edu_certificate;
    const marksheetUrl = viewItem.marksheet_file_path || viewItem.cand_edu_marksheet;
    const activeUrl = docType === "marksheet" ? marksheetUrl : certUrl;

    return (
      <>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Education Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-[#01026E]">{viewItem.degree} — {viewItem.institution_name}</h4>
              <span className={`text-xs px-3 py-1 rounded-full ${cls}`}>{label}</span>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Institute Name"   value={viewItem.institution_name} />
              <Field label="Degree"           value={viewItem.degree} />
              <Field label="Field of Study"   value={viewItem.field_of_study} />
              <Field label="Board/University" value={viewItem.board_university} />
              <Field label="Start Year"       value={viewItem.start_year} />
              <Field label="End Year"         value={viewItem.end_year} />
              <Field label="Percentage/CGPA"  value={viewItem.percentage_cgpa} />
              <Field label="Roll Number"      value={viewItem.roll_number} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {(hasCert || hasMarksheet) && (
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDocType("certificate")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    docType === "certificate"
                      ? "bg-white text-[#01026E] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Certificate
                </button>
                <button
                  type="button"
                  onClick={() => setDocType("marksheet")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    docType === "marksheet"
                      ? "bg-white text-[#01026E] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Marksheet
                </button>
              </div>
            )}
            <DocumentPreviewCard
              url={activeUrl}
              title={docType === "marksheet" ? "Marksheet Document" : "Degree / Certificate"}
            />
          </div>
        </div>
        <button onClick={() => { setViewItem(null); setDocType("certificate"); }} className="mt-4 text-sm text-[#01026E] underline">← Back to list</button>
      </>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Education Details</h3>
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 mt-4">No education records found.</p>
      ) : (
        <div className="space-y-4 mt-4">
          {list.map((item) => {
            const { label, cls } = statusBadge(item.verification_status);
            return (
              <div key={item.edu_id}
                className="flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  <div>
                    <span className="text-sm font-medium text-[#01026E]">{item.degree || "—"}</span>
                    <p className="text-xs text-gray-400">{item.institution_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                  <Eye size={16} className="cursor-pointer text-gray-500 hover:text-black" onClick={() => setViewItem(item)} />
                  <Trash2 size={16} className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => console.log("delete", item.edu_id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ════════════════ EMPLOYMENT TAB ════════════════ */
function EmploymentTab({ candId }) {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [docType, setDocType]   = useState("joining");

  useEffect(() => {
    axios.get(`${BASE}/${candId}/employment`)
      .then(r => setList(r.data.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [candId]);

  if (loading) return <Skeleton />;

  if (viewItem) {
    const joiningUrl = viewItem.doc_file_path || viewItem.cand_emp_joining;
    const payslipUrl = viewItem.payslip_file_path || viewItem.cand_emp_payslip;
    const serviceUrl = viewItem.service_file_path || viewItem.cand_emp_service;
    const hasAnyDocs = Boolean(joiningUrl || payslipUrl || serviceUrl);
    const activeUrl =
      docType === "payslip" ? payslipUrl :
      docType === "service" ? serviceUrl :
      joiningUrl;

    return (
      <>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow border">
            <div className="grid grid-cols-2 gap-5">
              <Field label="Employee ID"   value={viewItem.employee_id} />
              <Field label="Company Name"  value={viewItem.employer_name} />
              <Field label="Designation"   value={viewItem.designation} />
              <Field label="Department"    value={viewItem.department} />
              <Field label="From Date"     value={fmtDate(viewItem.start_date)} />
              <Field label="To Date"       value={fmtDate(viewItem.end_date)} />
              <Field label="Annual CTC"    value={viewItem.annual_ctc} />
              <Field label="HR Name"       value={viewItem.hr_name} />
              <Field label="HR Email"      value={viewItem.hr_email} />
              <Field label="HR Phone"      value={viewItem.hr_phone} />
            </div>
            {viewItem.reason_for_leaving && (
              <div className="mt-4">
                <label className="text-sm text-gray-600">Reason for Leaving</label>
                <p className="text-sm mt-1 text-gray-700">{viewItem.reason_for_leaving}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {hasAnyDocs && (
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDocType("joining")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    docType === "joining"
                      ? "bg-white text-[#01026E] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Joining
                </button>
                <button
                  type="button"
                  onClick={() => setDocType("payslip")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    docType === "payslip"
                      ? "bg-white text-[#01026E] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Payslip
                </button>
                <button
                  type="button"
                  onClick={() => setDocType("service")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    docType === "service"
                      ? "bg-white text-[#01026E] shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Service
                </button>
              </div>
            )}
            <DocumentPreviewCard
              url={activeUrl}
              title={
                docType === "payslip" ? "Payslip / Relieving" :
                docType === "service" ? "Service Certificate" :
                "Joining Letter"
              }
            />
          </div>
        </div>
        <button onClick={() => { setViewItem(null); setDocType("joining"); }} className="mt-4 text-sm text-[#01026E] underline">← Back to list</button>
      </>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 mt-4">No employment records found.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {list.map((item) => {
            const { label, cls } = statusBadge(item.verification_status);
            return (
              <div key={item.emp_id} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-gray-800">{item.designation || "—"}</h4>
                    <Pencil size={14} className="text-gray-400 cursor-pointer" />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.employer_name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.is_current === 1 ? "Current" : "Full-Time"} | {fmtDate(item.start_date)} – {fmtDate(item.end_date)}
                  </p>
                </div>
                <div onClick={() => setViewItem(item)} className="flex items-center gap-2 text-[#01026E] cursor-pointer">
                  <Eye size={16} /><span className="text-sm">View</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ════════════════ BACKGROUND TAB ════════════════ */
function BackgroundTab({ candId }) {
  const [bgData, setBgData]     = useState({ criminal: [], drug: [] });
  const [loading, setLoading]   = useState(true);
  const [viewItem, setViewItem] = useState(null); // { type, data }

  useEffect(() => {
    axios.get(`${BASE}/${candId}/background`)
      .then(r => setBgData(r.data.data || { criminal: [], drug: [] }))
      .catch(() => setBgData({ criminal: [], drug: [] }))
      .finally(() => setLoading(false));
  }, [candId]);

  if (loading) return <Skeleton />;

  if (viewItem) {
    const isCriminal = viewItem.type === "criminal";
    const docUrl = viewItem.data.doc_file_path || viewItem.data.cand_crim_report || viewItem.data.cand_drug_report;
    return (
      <>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Background Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow border">
            <div className="grid grid-cols-2 gap-5">
              {isCriminal ? (
                <>
                  <Field label="Case Number" value={viewItem.data.case_number} />
                  <Field label="Court Name"  value={viewItem.data.court_name} />
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600 mb-1 block">Case Details</label>
                    <textarea className="w-full border rounded-lg px-3 py-2 text-sm h-28 bg-gray-50"
                      readOnly value={viewItem.data.case_details || ""} />
                  </div>
                </>
              ) : (
                <>
                  <Field label="Test Centre" value={viewItem.data.test_centre} />
                  <Field label="Test Date"   value={fmtDate(viewItem.data.test_date)} />
                </>
              )}
            </div>
          </div>
          <div>
            <DocumentPreviewCard
              url={docUrl}
              title={isCriminal ? "Criminal Check Report" : "Drug Test Report"}
            />
          </div>
        </div>
        <button onClick={() => setViewItem(null)} className="mt-4 text-sm text-[#01026E] underline">← Back</button>
      </>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Criminal Record</h3>
      <div className="mt-4 mb-6 space-y-3">
        {bgData.criminal.length === 0
          ? <p className="text-sm text-gray-400">No criminal records found.</p>
          : bgData.criminal.map((c) => (
            <div key={c.criminal_id} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">Case: {c.case_number || "—"}</p>
                <p className="text-xs text-gray-400 mt-1">{c.court_name || "—"}</p>
              </div>
              <div onClick={() => setViewItem({ type: "criminal", data: c })}
                className="flex items-center gap-2 text-[#01026E] cursor-pointer">
                <Eye size={16} /><span className="text-sm">View</span>
              </div>
            </div>
          ))
        }
      </div>

      <h3 className="text-lg font-semibold text-gray-800">Drug Test Report</h3>
      <div className="mt-4 space-y-3">
        {bgData.drug.length === 0
          ? <p className="text-sm text-gray-400">No drug test records found.</p>
          : bgData.drug.map((d) => (
            <div key={d.drug_id} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">Test Centre: {d.test_centre || "—"}</p>
                <p className="text-xs text-gray-400 mt-1">Date: {fmtDate(d.test_date)}</p>
              </div>
              <div onClick={() => setViewItem({ type: "drug", data: d })}
                className="flex items-center gap-2 text-[#01026E] cursor-pointer">
                <Eye size={16} /><span className="text-sm">View</span>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}

/* ════════════════ REFERENCE TAB ════════════════ */
function ReferenceTab({ candId }) {
  const [refs, setRefs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE}/${candId}/reference`)
      .then(r => setRefs(r.data.data || []))
      .catch(() => setRefs([]))
      .finally(() => setLoading(false));
  }, [candId]);

  if (loading) return <Skeleton />;

  return (
    <>
      <h3 className="text-lg font-semibold text-[#01026E]">Reference Details</h3>
      {refs.length === 0
        ? <p className="text-sm text-gray-400 mt-4">No reference records found.</p>
        : refs.map((ref, i) => (
          <div key={ref.ref_id}>
            <h4 className="mt-4 font-medium text-[#01026E]">Reference {i + 1}</h4>
            <div className="grid grid-cols-2 gap-5 mt-3">
              <Field label="Name"        value={ref.ref_person_name} />
              <Field label="Phone"       value={ref.ref_person_phone} />
              <Field label="Email"       value={ref.ref_email_address} />
              <Field label="Company"     value={ref.ref_person_company} />
              <Field label="Designation" value={ref.ref_person_designation} />
              <Field label="Known Since" value={ref.known_time} />
            </div>
          </div>
        ))
      }
    </>
  );
}

/* ════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════ */
const EditCandidate = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Personal");
  const [candidateName, setCandidateName] = useState("Candidate");

  /* Load candidate name for header */
  useEffect(() => {
    axios.get(`${BASE}/${id}/personal`)
      .then(r => {
        if (r.data.data)
          setCandidateName(`${r.data.data.first_name} ${r.data.data.last_name}`);
      })
      .catch(() => {});
  }, [id]);

  const tabs = [
    { name: "Personal",   icon: User },
    { name: "Address",    icon: MapPin },
    { name: "Identity",   icon: IdCard },
    { name: "Education",  icon: GraduationCap },
    { name: "Employment", icon: Briefcase },
    { name: "Background", icon: ShieldCheck },
    { name: "Reference",  icon: Users },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "Personal":   return <PersonalTab   candId={id} />;
      case "Address":    return <AddressTab     candId={id} />;
      case "Identity":   return <IdentityTab    candId={id} />;
      case "Education":  return <EducationTab   candId={id} />;
      case "Employment": return <EmploymentTab  candId={id} />;
      case "Background": return <BackgroundTab  candId={id} />;
      case "Reference":  return <ReferenceTab   candId={id} />;
      default:           return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#F4F7FE] min-h-screen">

      <h2 className="text-xl font-semibold text-gray-800">Edit Candidate Profile</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Update Information And Manage Verification Status For {candidateName}.
      </p>

      <div className="bg-white rounded-xl shadow-md border">

        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 py-4 border-b text-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap transition ${
                  isActive ? "bg-[#01026E] text-white" : "text-gray-600 hover:text-black"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTab()}</div>

      </div>
    </div>
  );
};

export default EditCandidate;