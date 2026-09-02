import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  RefreshCw,
  ListFilter,
  Calendar,
  Search,
  Upload,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MoreVertical,
  UserPlus,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkAssignVendorModal from "../../components/superAdmin/cases/BulkAssignVendorModal";

// Exact custom SVG Icons matching the design
const AssignedIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <circle cx="12" cy="11" r="2.5"></circle>
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0"></path>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#8b5cf6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M12 7v5l3 3"></path>
      </svg>
    </div>
  </div>
);

const VerifiedIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <circle cx="12" cy="11" r="2.5"></circle>
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0"></path>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#22c55e" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M8 12l3 3 5-5"></path>
      </svg>
    </div>
  </div>
);

const RefuteIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="14" x2="15" y2="14"></line>
      <line x1="9" y1="18" x2="15" y2="18"></line>
      <line x1="9" y1="10" x2="11" y2="10"></line>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M15 9l-6 6"></path>
        <path d="M9 9l6 6"></path>
      </svg>
    </div>
  </div>
);

const UnverifiedIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="9" y1="14" x2="15" y2="14"></line>
      <line x1="9" y1="18" x2="15" y2="18"></line>
      <line x1="9" y1="10" x2="11" y2="10"></line>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </div>
  </div>
);

const PendingIcon = () => (
  <div className="relative inline-block text-gray-800">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <circle cx="12" cy="11" r="2.5"></circle>
      <path d="M8.5 17a3.5 3.5 0 0 1 7 0"></path>
    </svg>
    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" stroke="none"></circle>
        <circle cx="8" cy="12" r="1.5" fill="white" stroke="none"></circle>
        <circle cx="12" cy="12" r="1.5" fill="white" stroke="none"></circle>
        <circle cx="16" cy="12" r="1.5" fill="white" stroke="none"></circle>
      </svg>
    </div>
  </div>
);

 

const getStatusBadge = (status) => {
  switch (status) {
    case "Assigned":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F3E8FF] text-[#7E22CE]">
          {status}
        </span>
      );
    case "Verified":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#15803D]">
          {status}
        </span>
      );
    case "Refute":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
          {status}
        </span>
      );
    case "Unverified":
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B]">
          {status}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};

function SuperAdminCases() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showBulkAssignVendorModal, setShowBulkAssignVendorModal] = useState(false);
  const [assignVendorCaseIds, setAssignVendorCaseIds] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const assignedCount = tableData.filter(c => c.status === "Assigned").length;
  const pendingCount = tableData.filter(c => c.status === "Pending").length;
  const verifiedCount = tableData.filter(c => c.status === "Verified").length;
  const refuteCount = tableData.filter(c => c.status === "Refute" || c.status === "Refuted").length;
  const unverifiedCount = tableData.filter(c => c.status === "Unverified" || c.status === "Un-Verified").length;

  const formatCount = (num) => (num < 10 ? `0${num}` : num);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/superadmin/cases/get-all");
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();

    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === tableData.length && tableData.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((row) => row.id));
    }
  };

  return (
    <>
      {showBulkAssignVendorModal && (
        <BulkAssignVendorModal
          caseIds={assignVendorCaseIds}
          onClose={() => {
            setShowBulkAssignVendorModal(false);
            setAssignVendorCaseIds([]);
          }}
          onSuccess={() => {
            setShowBulkAssignVendorModal(false);
            setAssignVendorCaseIds([]);
            setSelectedRows([]);
            // Force table reload
            setLoading(true);
            axios.get("http://localhost:5000/api/superadmin/cases/get-all")
              .then(res => setTableData(res.data))
              .finally(() => setLoading(false));
          }}
        />
      )}

      {selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#02027A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-[9999]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-indigo-200">Selected Cases</p>
              <h3 className="text-lg font-semibold">{selectedRows.length} Cases Selected</h3>
            </div>
          </div>
          <button
            onClick={() => {
              setAssignVendorCaseIds(selectedRows);
              setShowBulkAssignVendorModal(true);
            }}
            className="bg-white text-[#02027A] hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold transition cursor-pointer"
          >
            Assign Vendor
          </button>
        </div>
      )}

      <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-5 pb-10 px-4 mt-4">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hi Super Admin Good Morning!
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          "Power Your Ecosystem With Verified Partners And Real-Time Insights."
        </p>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div 
          onClick={() => navigate('/super-admin/cases/assigned')}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative flex flex-col justify-between min-h-[110px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">Assigned Application</h3>
            <div className="shrink-0"><AssignedIcon /></div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(assignedCount)}</h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/pending')}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative flex flex-col justify-between min-h-[110px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">Pending Application</h3>
            <div className="shrink-0"><PendingIcon /></div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(pendingCount)}</h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/verified')}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative flex flex-col justify-between min-h-[110px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">Verified Application</h3>
            <div className="shrink-0"><VerifiedIcon /></div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(verifiedCount)}</h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/refuted')}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative flex flex-col justify-between min-h-[110px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">Refute Application</h3>
            <div className="shrink-0"><RefuteIcon /></div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(refuteCount)}</h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/unverified')}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative flex flex-col justify-between min-h-[110px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-800 leading-5">Un-Verified Application</h3>
            <div className="shrink-0"><UnverifiedIcon /></div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <h1 className="text-3xl font-bold text-gray-900 leading-none">{formatCount(unverifiedCount)}</h1>
            <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Maximize2 className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 w-12 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                    checked={
                      selectedRows.length === tableData.length &&
                      tableData.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Case ID</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Candidate ID</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Case Type</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Name</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Phone</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">TAT</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Status</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-all duration-150"
                >
                  <td className="px-5 py-2.5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="px-5 py-2.5 text-sm text-gray-700 font-mono">
                    {row.caseId}
                  </td>
                  <td className="px-5 py-2.5 text-sm text-gray-700">{row.candidateId}</td>
                  <td className="px-5 py-2.5">
                    <div className="text-sm text-gray-800 font-medium">
                      {row.caseType.split(" ")[0]}
                    </div>
                    {row.caseType.split(" ")[1] && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {row.caseType.split(" ").slice(1).join(" ")}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="font-semibold text-[15px] text-gray-900 leading-5">{row.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{row.email}</div>
                  </td>
                  <td className="px-5 py-2.5 text-sm text-gray-700">+91 {row.phone}</td>
                  <td className="px-5 py-2.5 text-sm text-gray-700">{row.tat}</td>
                  <td className="px-5 py-2.5">{getStatusBadge(row.status)}</td>
                  <td className="px-5 py-2.5 text-center w-20">
                    <div className="relative inline-block text-left">
                      <button 
                        className="p-2 rounded-lg hover:bg-gray-100 transition inline-flex justify-center items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === row.id ? null : row.id);
                        }}
                      >
                        <MoreVertical size={18} className="text-gray-500" />
                      </button>
                      
                      {openDropdownId === row.id && (
                        <div className="absolute right-8 top-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4338CA] transition-colors first:rounded-t-md"
                            onClick={() => {
                              setOpenDropdownId(null);
                              const isEdit = row.status === "Assigned" || row.status === "Unverified";
                              const mode = isEdit ? "edit" : "view";
                              if (row.caseType.includes("Employment Verification")) {
                                navigate(`/super-admin/employment-details?mode=${mode}`);
                              } else if (row.caseType.includes("Address Verification")) {
                                navigate(`/super-admin/address-details?mode=${mode}`);
                              } else if (row.caseType.includes("Drug Test")) {
                                navigate(`/super-admin/drug-test-details?mode=${mode}`);
                              } else if (row.caseType.includes("Education Verification")) {
                                navigate(`/super-admin/education-details?mode=${mode}`);
                              } else if (row.caseType.includes("Criminal Check")) {
                                navigate(`/super-admin/criminal-details?mode=${mode}`);
                              }
                            }}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4338CA] transition-colors last:rounded-b-md"
                            onClick={() => {
                              setOpenDropdownId(null);
                              setAssignVendorCaseIds([row.id]);
                              setShowBulkAssignVendorModal(true);
                            }}
                          >
                            <UserPlus size={16} />
                            Assign Vendor
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600 bg-white">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4338CA]">
              <option>9</option>
              <option>10</option>
              <option>20</option>
            </select>
            <span>out of 40</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded transition font-medium text-gray-700">
              <ChevronLeft size={16} />
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#EEF2FF] text-[#4338CA] font-semibold border border-[#C7D2FE]">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              4
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              5
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              8
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition">
              9
            </button>
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded transition font-medium text-gray-700">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default SuperAdminCases;
