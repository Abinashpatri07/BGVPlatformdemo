import React, { useState, useEffect } from "react";
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
  Maximize2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

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

function VendorDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [userName, setUserName] = useState("Vendor");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vendorToken");
      const res = await axiosInstance.get("/api/vendor/cases/assigned", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCases(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    const userStr = localStorage.getItem("vendorUser");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed.name) setUserName(parsed.name);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === cases.length && cases.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(cases.map((row) => row.id));
    }
  };

  const assignedCount = cases.filter(c => c.status === "Assigned" || c.status === "Pending" || c.status === "In Progress").length;
  const verifiedCount = cases.filter(c => c.status === "Verified").length;
  const refuteCount = cases.filter(c => c.status === "Refute" || c.status === "Hold").length;
  const unverifiedCount = cases.filter(c => c.status === "Unverified").length;

  const formatCount = (count) => count.toString().padStart(2, '0');

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-4 animate-fade-in pb-6">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hi {userName} Good Morning!
        </h1>
        <p className="text-gray-600 mt-1 font-medium">
          "Power Your Ecosystem With Verified Partners And Real-Time Insights."
        </p>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/vendor/assigned-applications')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[125px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <AssignedIcon />
            </div>
            <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full border border-gray-100">
              <Maximize2 size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{formatCount(assignedCount)}</h3>
            <p className="text-gray-500 text-sm font-medium">Assigned Application</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/vendor/verified-applications')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[125px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <VerifiedIcon />
            </div>
            <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full border border-gray-100">
              <Maximize2 size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{formatCount(verifiedCount)}</h3>
            <p className="text-gray-500 text-sm font-medium">Verified Application</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/vendor/refute-applications')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[125px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <RefuteIcon />
            </div>
            <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full border border-gray-100">
              <Maximize2 size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{formatCount(refuteCount)}</h3>
            <p className="text-gray-500 text-sm font-medium">Refute Application</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/vendor/unverified-applications')}
          className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[125px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <UnverifiedIcon />
            </div>
            <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-full border border-gray-100">
              <Maximize2 size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{formatCount(unverifiedCount)}</h3>
            <p className="text-gray-500 text-sm font-medium">Un-Verified Application</p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-3 py-1.5 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#4338CA] focus:ring-[#4338CA]"
                    checked={selectedRows.length === cases.length && cases.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-1.5">Case ID</th>
                <th className="px-3 py-1.5">Candidate ID</th>
                <th className="px-3 py-1.5">Case Type</th>
                <th className="px-3 py-1.5">Name</th>
                <th className="px-3 py-1.5">Phone</th>
                <th className="px-3 py-1.5">TAT</th>
                <th className="px-3 py-1.5">Status</th>
                <th className="px-3 py-1.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">Loading cases...</td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">No cases found.</td>
                </tr>
              ) : (
                cases.slice(0, 10).map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${selectedRows.includes(row.id) ? "bg-indigo-50" : ""}`}
                  >
                  <td className="px-3 py-1.5">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#4338CA] focus:ring-[#4338CA]"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="px-3 py-1.5 font-medium text-gray-900">
                    {row.caseId}
                  </td>
                  <td className="px-3 py-1.5 text-gray-700">{row.candidateId}</td>
                  <td className="px-3 py-1.5">
                    <div className="text-gray-900 font-medium">
                      {row.caseType.split(" ")[0]}
                    </div>
                    {row.caseType.split(" ")[1] && (
                      <div className="text-gray-500 text-xs">
                        {row.caseType.split(" ").slice(1).join(" ")}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="text-gray-900 font-medium">{row.name}</div>
                    <div className="text-gray-500 text-xs">{row.email}</div>
                  </td>
                  <td className="px-3 py-1.5 text-gray-700">+91 {row.phone}</td>
                  <td className="px-3 py-1.5 text-gray-700">{row.tat}</td>
                  <td className="px-3 py-1.5">{getStatusBadge(row.status)}</td>
                  <td className="px-3 py-1.5 text-gray-400">
                    <button 
                      className="p-1 hover:bg-gray-200 rounded transition inline-flex justify-center items-center"
                      onClick={() => {
                        const isEdit = row.status === "Assigned" || row.status === "Unverified";
                        const mode = isEdit ? "edit" : "view";
                        if (row.caseType.includes("Employment Verification")) {
                          navigate(`/vendor/employment-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Address Verification")) {
                          navigate(`/vendor/address-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Drug Test")) {
                          navigate(`/vendor/drug-test-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Education Verification")) {
                          navigate(`/vendor/education-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Criminal Check")) {
                          navigate(`/vendor/criminal-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Identification") || row.caseType.includes("Identity")) {
                          navigate(`/vendor/identity-details?mode=${mode}&caseId=${row.id}`);
                        } else if (row.caseType.includes("Reference")) {
                          navigate(`/vendor/reference-details?mode=${mode}&caseId=${row.id}`);
                        }
                      }}
                    >
                      {row.status === "Assigned" || row.status === "Unverified" ? (
                        <Edit size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
              )}
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
  );
}

export default VendorDashboard;
