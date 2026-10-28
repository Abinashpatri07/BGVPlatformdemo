import { API_BASE_URL } from "../../../API/config.js";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../../API/axiosInstance";
import {
  User,
  MapPin,
  IdCard,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Activity,
  Users,
  CheckCircle,
  Eye,
  ArrowLeft,
  Download,
  FileText,
  XCircle,
} from "lucide-react";
import { exportCandidateCompleteReport } from "../../../utils/exportCandidatePdf";

const Label = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-700">{value}</p>
  </div>
);

// Formats file path to full backend URL if relative
const getDocUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/\\/g, "/");
  const base = API_BASE_URL;
  return `${base}/${clean.startsWith("/") ? clean.slice(1) : clean}`;
};

// Renders a document preview: image, pdf link, or empty state
const DocumentPreview = ({ url, noDocMessage }) => {
  const fullUrl = getDocUrl(url);

  if (!fullUrl) {
    return (
      <div className="bg-white p-4 rounded-xl shadow border flex flex-col items-center justify-center min-h-[200px]">
        <XCircle size={40} className="text-gray-300 mb-3" />
        <p className="text-sm text-gray-400 font-medium text-center">
          {noDocMessage || "No Document Available"}
        </p>
      </div>
    );
  }

  const lUrl = fullUrl.toLowerCase();
  const isPdf = lUrl.endsWith(".pdf") || lUrl.includes(".pdf");

  return (
    <div className="bg-white p-4 rounded-xl shadow border text-center">
      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
      {isPdf ? (
        <div className="flex flex-col items-center justify-center min-h-[160px] bg-gray-50 rounded-lg">
          <FileText size={48} className="text-[#01026E] mb-2" />
          <p className="text-xs text-gray-500 mb-3">PDF Document</p>
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-white bg-[#01026E] px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition"
          >
            <Eye size={14} /> View Document
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          <img
            src={fullUrl}
            alt="document"
            className="rounded-lg shadow-sm mx-auto h-56 object-contain w-full bg-gray-50 border"
            onError={(e) => {
              e.target.outerHTML = `<div class="flex flex-col items-center justify-center min-h-[160px] bg-gray-50 rounded-lg"><svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='#6b7280' stroke-width='1.5'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14 2 14 8 20 8'/></svg><a href='${fullUrl}' target='_blank' class='mt-2 text-xs text-indigo-700 underline font-medium'>Open Document</a></div>`;
            }}
          />
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#01026E] hover:underline font-medium"
          >
            <Eye size={13} /> Open Full View
          </a>
        </div>
      )}
    </div>
  );
};

function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Personal");
  const [showEducationView, setShowEducationView] = useState(null);
  const [showEmploymentView, setShowEmploymentView] = useState(null);
  const [criminalView, setCriminalView] = useState(null);
  const [drugView, setDrugView] = useState(null);
  const [identityView, setIdentityView] = useState(null);

  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axiosInstance.get(`/api/candidate/get-candidate/${id}`);
        if (response.data.success) {
          setCandidateData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const tabs = [
    { name: "Personal", icon: User },
    { name: "Address", icon: MapPin },
    { name: "Identity", icon: IdCard },
    { name: "Education", icon: GraduationCap },
    { name: "Employment", icon: Briefcase },
    { name: "Criminal", icon: ShieldAlert },
    { name: "Drug", icon: Activity },
    { name: "Reference", icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FE]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#02027A]"></div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FE]">
        <div className="text-xl text-gray-500 font-medium">Candidate Not Found</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#F4F7FE] min-h-screen">
      {/* TOP */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#02027A] transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* TITLE + STATUS BADGE */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#02027A]">
            Candidate Details
          </h1>
          <p className="text-gray-500 mt-1">
            View Complete Candidate Verification Information
          </p>
        </div>

        {/* ACCOUNT STATUS & EXPORT BUTTON - RIGHT SIDE */}
        <div className="flex flex-col items-end gap-3">
          {/* EXPORT BUTTON - Enabled when status is Complete (4) or Verified (1) */}
          {candidateData && (candidateData.verification_status === 1 || candidateData.verification_status === 4) && (
            <button
              onClick={() => exportCandidateCompleteReport(candidateData, id)}
              className="flex items-center gap-2 px-4 py-2 bg-[#02027A] hover:bg-[#010156] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              title="Download complete verified candidate report as PDF"
            >
              <Download size={16} />
              Export Report
            </button>
          )}

          <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3 ${
            candidateData.verification_status === 1 || candidateData.verification_status === 4 ? 'bg-[#e8fce8] border-green-200' : 
            candidateData.verification_status === 3 ? 'bg-red-50 border-red-200' : 
            'bg-yellow-50 border-yellow-200'
          }`}>
            {candidateData.verification_status === 1 ? (
              <>
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-[#00cc00] text-base font-bold tracking-wide">
                  Account Status: Verified
                </span>
              </>
            ) : candidateData.verification_status === 4 ? (
              <>
                <CheckCircle size={20} className="text-green-500" />
                <span className="text-[#00cc00] text-base font-bold tracking-wide">
                  Account Status: Complete
                </span>
              </>
            ) : candidateData.verification_status === 3 ? (
              <>
                <ShieldAlert size={20} className="text-red-500" />
                <span className="text-red-600 text-base font-bold tracking-wide">
                  Account Status: Rejected
                </span>
              </>
            ) : (
              <>
                <Activity size={20} className="text-yellow-600" />
                <span className="text-yellow-700 text-base font-bold tracking-wide">
                  Account Status: Pending
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CANDIDATE ID */}
      <div className="mb-6">
        <span className="bg-indigo-50 text-[#02027A] px-4 py-2 rounded-xl text-sm font-medium">
          Candidate ID: {id}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md border">
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 py-4 border-b text-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;

            return (
              <button
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setShowEducationView(null);
                  setShowEmploymentView(null);
                  setCriminalView(null);
                  setDrugView(null);
                  setIdentityView(null);
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#01026E] text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "Personal" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                General Profile Details And Contact Information.
              </p>

              <div className="grid grid-cols-2 gap-8 mt-6">
                <Label label="Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                <Label label="Phone no" value={candidateData.candidate_mobile || "Not Available"} />
                <Label label="Email" value={candidateData.candidate_email || "Not Available"} />
                <Label label="Date Of Birth" value="Not Available" />
                <Label label="Function" value={candidateData.candidate_function || "Not Available"} />
                <Label label="Tag" value={candidateData.candidate_tag || "Not Available"} />
              </div>
            </>
          )}

          {activeTab === "Address" && (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                Present Address
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Current Residential Address Details.
              </p>

              <div className="grid grid-cols-2 gap-5 mb-8">
                <Label label="Address Line 1" value={candidateData.address?.cand_curr_add_line1 || "Not Available"} />
                <Label label="Address Line 2" value={candidateData.address?.cand_curr_add_line2 || "Not Available"} />
                <Label label="City" value={candidateData.address?.cand_curr_city || "Not Available"} />
                <Label label="State" value={candidateData.address?.cand_curr_state || "Not Available"} />
                <Label label="Pin Code" value={candidateData.address?.cand_curr_pincode || "Not Available"} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                Permanent Address
              </h3>

              <div className="grid grid-cols-2 gap-5 mt-6">
                <Label label="Address Line 1" value={candidateData.address?.cand_perm_add_line1 || "Not Available"} />
                <Label label="Address Line 2" value={candidateData.address?.cand_perm_add_line2 || "Not Available"} />
                <Label label="City" value={candidateData.address?.cand_perm_city || "Not Available"} />
                <Label label="State" value={candidateData.address?.cand_perm_state || "Not Available"} />
                <Label label="Pin Code" value={candidateData.address?.cand_perm_pincode || "Not Available"} />
              </div>
            </>
          )}

          {activeTab === "Identity" && (
            <>
              {!identityView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Identity Information
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Verification Details For National ID Cards.
                  </p>

                  {candidateData.identity && candidateData.identity.length > 0 ? (
                    <div className="space-y-5">
                      {candidateData.identity.map((item, idx) => {
                        const docType = item.cand_iden_type || item.cand_ident_type || `Identity Document ${idx + 1}`;
                        const docNumber = item.pan_number || item.driving_number || item.voter_number || item.passport_number || item.uan_number || item.cand_ident_number || "N/A";
                        return (
                          <div key={idx} className="border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-indigo-100 transition">
                            <div>
                              <h4 className="font-semibold text-[#01026E] mb-1">{docType}</h4>
                              <Label label="ID Number" value={docNumber} />
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                                <CheckCircle size={12} /> Verified
                              </span>
                              <div 
                                onClick={() => setIdentityView(item)}
                                className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium"
                              >
                                <Eye size={16} />
                                <span className="text-sm">View</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No identity records found.</p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Identity Details - {identityView.cand_iden_type || identityView.cand_ident_type || "National ID"}
                    </h3>
                    <button 
                      onClick={() => setIdentityView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50 font-medium transition"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Info Grid */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                        <div>
                          <h4 className="text-base font-bold text-gray-900">
                            {identityView.cand_iden_type || identityView.cand_ident_type || "National ID"}
                          </h4>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            ID: {identityView.pan_number || identityView.driving_number || identityView.voter_number || identityView.passport_number || identityView.uan_number || identityView.cand_ident_number || "N/A"}
                          </p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                          <CheckCircle size={12} /> Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Cardholder Name" value={identityView.cand_full_name || `${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Document Type" value={identityView.cand_iden_type || identityView.cand_ident_type || "National ID"} />
                        <Label label="ID Number" value={identityView.pan_number || identityView.driving_number || identityView.voter_number || identityView.passport_number || identityView.uan_number || identityView.cand_ident_number || "N/A"} />
                        <Label label="Father / Guardian Name" value={identityView.cand_father_name || "N/A"} />
                        <Label label="Date of Birth" value={identityView.cand_dob ? new Date(identityView.cand_dob).toLocaleDateString() : "N/A"} />
                        <Label label="Gender" value={identityView.cand_gender || "N/A"} />
                        <Label label="Issue Date" value={(identityView.driv_issue_date || identityView.pass_issue_date || identityView.voter_issue_date || identityView.cand_ident_issue_date) ? new Date(identityView.driv_issue_date || identityView.pass_issue_date || identityView.voter_issue_date || identityView.cand_ident_issue_date).toLocaleDateString() : "N/A"} />
                        <Label label="Expiry Date" value={(identityView.pass_expiry_date || identityView.driv_expiry_date || identityView.cand_ident_expiry_date) ? new Date(identityView.pass_expiry_date || identityView.driv_expiry_date || identityView.cand_ident_expiry_date).toLocaleDateString() : "N/A"} />
                        <div className="col-span-2">
                          <Label label="Address on ID" value={identityView.cand_address || "N/A"} />
                        </div>
                      </div>
                    </div>

                    {/* Right: Actual Uploaded Document Image / Preview */}
                    <div className="lg:col-span-5">
                      <DocumentPreview
                        url={identityView.cand_iden_docu || identityView.cand_iden_doc || identityView.doc_file_path || null}
                        noDocMessage="No Identity Document Uploaded"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Education" && (
            <>
              {!showEducationView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Education Details
                  </h3>

                  <div className="space-y-4 mt-4">
                    {candidateData.education && candidateData.education.length > 0 ? (
                      candidateData.education.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-500" />
                            <span className="text-sm font-medium text-[#01026E]">
                              {item.cand_edu_type || `Education Record ${idx + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-gray-500">
                            <div 
                              className="flex items-center gap-1 cursor-pointer hover:text-black text-sm"
                              onClick={() => setShowEducationView(item)}
                            >
                              <Eye size={16} /> View
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No education records found.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Education Details
                    </h3>
                    <button 
                      onClick={() => setShowEducationView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Institute Name" value={showEducationView.cand_edu_institute || "N/A"} />
                        <Label label="Degree" value={showEducationView.cand_edu_type || showEducationView.cand_edu_dgree || "N/A"} />
                        <Label label="Start Date" value={showEducationView.cand_edu_from_date ? new Date(showEducationView.cand_edu_from_date).toLocaleDateString() : "N/A"} />
                        <Label label="End Date" value={showEducationView.cand_edu_to_date ? new Date(showEducationView.cand_edu_to_date).toLocaleDateString() : "N/A"} />
                        <Label label="Course / Specialization" value={showEducationView.cand_specialization || showEducationView.cand_edu_course || "N/A"} />
                        <Label label="Percentage / CGPA" value={showEducationView.cand_edu_grade || "N/A"} />
                      </div>

                      {/* Education Document Links */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attached Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {showEducationView.cand_edu_certificate && (
                            <a
                              href={getDocUrl(showEducationView.cand_edu_certificate)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                            >
                              <FileText size={13} />
                              Certificate
                            </a>
                          )}
                          {showEducationView.cand_edu_marksheet && (
                            <a
                              href={getDocUrl(showEducationView.cand_edu_marksheet)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                            >
                              <FileText size={13} />
                              Marksheet
                            </a>
                          )}
                          {!showEducationView.cand_edu_certificate && !showEducationView.cand_edu_marksheet && (
                            <span className="text-xs text-gray-400 italic">No document links available</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <DocumentPreview
                      url={showEducationView.cand_edu_certificate || showEducationView.cand_edu_marksheet || null}
                      noDocMessage="No Education Document Uploaded"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Employment" && (
            <>
              {!showEmploymentView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Employment Details
                  </h3>

                  <div className="mt-5 space-y-4">
                    {candidateData.employment && candidateData.employment.length > 0 ? (
                      candidateData.employment.map((item, idx) => (
                        <div key={idx} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-base font-semibold text-gray-800">
                                {item.cand_emp_designation || "Designation Not Available"}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.cand_emp_company || "Company Not Available"}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.cand_emp_from_date ? new Date(item.cand_emp_from_date).toLocaleDateString() : "N/A"} - {item.cand_emp_to_date ? new Date(item.cand_emp_to_date).toLocaleDateString() : "Present"}
                            </p>
                          </div>

                          <div
                            onClick={() => setShowEmploymentView(item)}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No employment records found.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Employment Details
                    </h3>
                    <button 
                      onClick={() => setShowEmploymentView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Employee ID" value={showEmploymentView.cand_emp_empid || "N/A"} />
                        <Label label="Company Name" value={showEmploymentView.cand_emp_company || "N/A"} />
                        <Label label="From Date" value={showEmploymentView.cand_emp_from_date ? new Date(showEmploymentView.cand_emp_from_date).toLocaleDateString() : "N/A"} />
                        <Label label="To Date" value={showEmploymentView.cand_emp_to_date ? new Date(showEmploymentView.cand_emp_to_date).toLocaleDateString() : "Present"} />
                        <Label label="Designation" value={showEmploymentView.cand_emp_designation || "N/A"} />
                        <Label label="Employment Type" value={showEmploymentView.cand_emp_type || "N/A"} />
                        {showEmploymentView.cand_emp_uan_number && (
                          <Label label="UAN Number" value={showEmploymentView.cand_emp_uan_number} />
                        )}
                      </div>

                      {/* Documents Section */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Available Documents</p>
                        <div className="flex flex-wrap gap-2">
                          {showEmploymentView.cand_emp_joining && (
                            <a
                              href={getDocUrl(showEmploymentView.cand_emp_joining)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                            >
                              <FileText size={13} />
                              Joining Letter
                            </a>
                          )}
                          {showEmploymentView.cand_emp_payslip && (
                            <a
                              href={getDocUrl(showEmploymentView.cand_emp_payslip)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                            >
                              <FileText size={13} />
                              Relieving / Payslip
                            </a>
                          )}
                          {showEmploymentView.cand_emp_service && (
                            <a
                              href={getDocUrl(showEmploymentView.cand_emp_service)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                            >
                              <FileText size={13} />
                              Service Letter
                            </a>
                          )}
                          {!showEmploymentView.cand_emp_joining && !showEmploymentView.cand_emp_payslip && !showEmploymentView.cand_emp_service && (
                            <span className="text-xs text-gray-400 italic">No document links available</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <DocumentPreview
                      url={
                        showEmploymentView.cand_emp_joining ||
                        showEmploymentView.cand_emp_payslip ||
                        showEmploymentView.cand_emp_service ||
                        null
                      }
                      noDocMessage="No Employment Document Uploaded"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Criminal" && (
            <>
              {!criminalView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Criminal Record
                  </h3>

                  <div className="mt-4 mb-6 space-y-4">
                    {candidateData.criminal && candidateData.criminal.length > 0 ? (
                      candidateData.criminal.map((item, idx) => {
                        const hasCriminal = item.cand_crim_record === "Yes" || !!item.cand_crim_report;
                        return (
                          <div key={idx} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
                            <div>
                              <p className={`text-sm font-medium ${hasCriminal ? "text-red-700" : "text-green-700"}`}>
                                {hasCriminal ? "Criminal Record Report Exists" : "No Criminal Record"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Case / Record: {item.cand_crim_record || "None"}
                              </p>
                              {item.cand_crim_remarks && (
                                <p className="text-xs text-gray-400 mt-0.5">Remarks: {item.cand_crim_remarks}</p>
                              )}
                            </div>

                            <div
                              onClick={() => setCriminalView(item)}
                              className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                            >
                              <Eye size={16} />
                              <span className="text-sm font-medium">View</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-white border rounded-xl shadow-sm p-6 flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-500" />
                        <p className="text-sm font-medium text-green-700">No criminal records found for this candidate.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Criminal Details
                    </h3>
                    <button 
                      onClick={() => setCriminalView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Case No / Record" value={criminalView.cand_crim_record || "N/A"} />
                        <Label label="Date" value={criminalView.cand_crim_date ? new Date(criminalView.cand_crim_date).toLocaleDateString() : "N/A"} />
                        <div className="col-span-2">
                          <Label 
                            label="Case Details/Remarks" 
                            value={criminalView.cand_crim_remarks || "N/A"}
                          />
                        </div>
                      </div>

                      {criminalView.cand_crim_report && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attached Report</p>
                          <a
                            href={getDocUrl(criminalView.cand_crim_report)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                          >
                            <FileText size={13} />
                            Criminal Report Document
                          </a>
                        </div>
                      )}
                    </div>

                    <DocumentPreview
                      url={criminalView.cand_crim_report || null}
                      noDocMessage="No Criminal Document Uploaded"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Drug" && (
            <>
              {!drugView ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Drug Test Report
                  </h3>

                  <div className="mt-4 space-y-4">
                    {candidateData.drug && candidateData.drug.length > 0 ? (
                      candidateData.drug.map((item, idx) => (
                        <div key={idx} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Drug Test Report</p>
                            <p className="text-xs text-gray-400 mt-1">Report Number: {item.cand_drug_test || "N/A"}</p>
                            {item.cand_drug_remarks && (
                              <p className="text-xs text-gray-400 mt-0.5">Remarks: {item.cand_drug_remarks}</p>
                            )}
                          </div>

                          <div
                            onClick={() => setDrugView(item)}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No drug test records found.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Drug Details
                    </h3>
                    <button 
                      onClick={() => setDrugView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Test Id" value={drugView.cand_drug_test || "N/A"} />
                        <Label label="Date" value={drugView.cand_drug_date ? new Date(drugView.cand_drug_date).toLocaleDateString() : "N/A"} />
                        <div className="col-span-2">
                          <Label 
                            label="Test Details/Remarks" 
                            value={drugView.cand_drug_remarks || "N/A"}
                          />
                        </div>
                      </div>

                      {drugView.cand_drug_report && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attached Report</p>
                          <a
                            href={getDocUrl(drugView.cand_drug_report)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                          >
                            <FileText size={13} />
                            Drug Test Report Document
                          </a>
                        </div>
                      )}
                    </div>

                    <DocumentPreview
                      url={drugView.cand_drug_report || null}
                      noDocMessage="No Drug Test Document Uploaded"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "Reference" && (
            <>
              <h3 className="text-lg font-semibold text-[#01026E] mb-2">
                Reference Details
              </h3>

              {candidateData.reference && candidateData.reference.length > 0 ? (
                <div className="space-y-6 mb-6">
                  {candidateData.reference.map((item, idx) => (
                    <div key={idx} className="border rounded-xl p-5">
                      <h4 className="font-medium text-[#01026E] mb-4">Reference {idx + 1}</h4>
                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Name" value={item.cand_ref_name || "N/A"} />
                        <Label label="Phone no" value={item.cand_ref_contact || "N/A"} />
                        <Label label="Email" value={item.cand_ref_email || "N/A"} />
                        <Label label="Gender" value={item.cand_ref_gender || "N/A"} />
                        <Label label="Institute/Company Name" value={item.cand_ref_institute || "N/A"} />
                        <Label label="Designation" value={item.cand_ref_designation || "N/A"} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reference records found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default View;

