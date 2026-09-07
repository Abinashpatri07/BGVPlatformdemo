import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../../../API/axiosInstance";
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
} from "lucide-react";

const Label = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-700">{value}</p>
  </div>
);

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
        const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/api/client-admin/candidate/get-candidate/${id}`);
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

        {/* ACCOUNT STATUS - RIGHT SIDE */}
        <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3 ${
          candidateData.verification_status === 1 ? 'bg-[#e8fce8] border-green-200' : 
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
                      {candidateData.identity.map((item, idx) => (
                        <div key={idx} className="border rounded-xl p-4 shadow-sm flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-[#01026E] mb-1">{item.cand_ident_type || `Identity Document ${idx + 1}`}</h4>
                            <Label label="ID Number" value={item.cand_ident_number || "N/A"} />
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle size={12} /> Verified
                            </span>
                            <div 
                              onClick={() => setIdentityView(item)}
                              className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                            >
                              <Eye size={16} />
                              <span className="text-sm font-medium">View</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No identity records found.</p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Identity Details
                    </h3>
                    <button 
                      onClick={() => setIdentityView(null)}
                      className="text-sm text-[#01026E] border border-[#01026E] px-4 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      Back to List
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white p-5 rounded-xl shadow border">
                      <div className="grid grid-cols-2 gap-5">
                        <Label label="Name" value={`${candidateData.candidate_first_name} ${candidateData.candidate_last_name || ""}`} />
                        <Label label="Document Type" value={identityView.cand_ident_type || "N/A"} />
                        <Label label="ID Number" value={identityView.cand_ident_number || "N/A"} />
                        <Label label="Issue Date" value={identityView.cand_ident_issue_date ? new Date(identityView.cand_ident_issue_date).toLocaleDateString() : "N/A"} />
                        <Label label="Expiry Date" value={identityView.cand_ident_expiry_date ? new Date(identityView.cand_ident_expiry_date).toLocaleDateString() : "N/A"} />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="document preview"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
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
                        <Label label="Degree" value={showEducationView.cand_edu_type || "N/A"} />
                        <Label label="Start Date" value={showEducationView.cand_edu_from_date ? new Date(showEducationView.cand_edu_from_date).toLocaleDateString() : "N/A"} />
                        <Label label="End Date" value={showEducationView.cand_edu_to_date ? new Date(showEducationView.cand_edu_to_date).toLocaleDateString() : "N/A"} />
                        <Label label="Course" value={showEducationView.cand_edu_course || "N/A"} />
                        <Label label="Percentage/CGPA" value={showEducationView.cand_edu_grade || "N/A"} />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="certificate"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
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
                        <Label label="Drawn CTC" value="N/A" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
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
                      candidateData.criminal.map((item, idx) => (
                        <div key={idx} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Criminal Record Exist</p>
                            <p className="text-xs text-gray-400 mt-1">Case Number: {item.cand_crim_record || "N/A"}</p>
                          </div>

                          <div
                            onClick={() => setCriminalView(item)}
                            className="flex items-center gap-2 text-[#01026E] cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <Eye size={16} />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No criminal records found.</p>
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
                        <Label label="Case No" value={criminalView.cand_crim_record || "N/A"} />
                        <Label label="Date" value={criminalView.cand_crim_date ? new Date(criminalView.cand_crim_date).toLocaleDateString() : "N/A"} />
                        <div className="col-span-2">
                          <Label 
                            label="Case Details/Remarks" 
                            value={criminalView.cand_crim_remarks || "N/A"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="document preview"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
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
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border text-center">
                      <p className="text-sm text-[#01026E] mb-3 font-medium">Document Preview</p>
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4"
                        alt="document preview"
                        className="rounded-lg shadow-sm mx-auto h-64 object-cover"
                      />
                    </div>
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
