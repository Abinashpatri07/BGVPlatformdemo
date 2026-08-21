import React, { useState } from "react";
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
  MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const tableData = [
  {
    id: 1,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Employment Verification",
    name: "Arjun Sharma",
    email: "arjun.sharma@email.com",
    phone: "1234567890",
    tat: "2 Days",
    status: "Assigned",
  },
  {
    id: 2,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Education Verification",
    name: "Ananya Iyer",
    email: "ananya.iyer@email.com",
    phone: "1234567890",
    tat: "5 Days",
    status: "Verified",
  },
  {
    id: 3,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Address Verification",
    name: "Rohan Malhotra",
    email: "rohan.m@workspace.in",
    phone: "1234567890",
    tat: "1 Day",
    status: "Assigned",
  },
  {
    id: 4,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Criminal Check",
    name: "Meera Deshmukh",
    email: "meera.d@talent.io",
    phone: "1234567890",
    tat: "3 Days",
    status: "Refute",
  },
  {
    id: 5,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Education Verification",
    name: "Niten Sharma",
    email: "nitenkumar34@gmail.com",
    phone: "1234567890",
    tat: "2 Days",
    status: "Verified",
  },
  {
    id: 6,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Address Verification",
    name: "Kavya Patel",
    email: "k.patel@company.com",
    phone: "1234567890",
    tat: "1 Day",
    status: "Verified",
  },
  {
    id: 7,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Drug Test",
    name: "Ishaan Verma",
    email: "ishaan.verma@talent.io",
    phone: "1234567890",
    tat: "4 Days",
    status: "Refute",
  },
  {
    id: 8,
    caseId: "CASE-9999XYZ",
    candidateId: "CAND_999999",
    caseType: "Employment Verification",
    name: "Rahul Verma",
    email: "rahul.v@email.com",
    phone: "9876543210",
    tat: "1 Day",
    status: "Verified",
  },
];

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
  const navigate = useNavigate();

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((row) => row.id));
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10 px-4">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Hi Super Admin Good Morning!
        </h1>
        <p className="text-gray-600 mt-2 font-medium">
          "Power Your Ecosystem With Verified Partners And Real-Time Insights."
        </p>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/super-admin/cases/assigned')}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[140px] cursor-pointer hover:shadow-md transition-shadow"
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">20</h3>
            <p className="text-gray-500 text-sm font-medium">Assigned Application</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/verified')}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[140px] cursor-pointer hover:shadow-md transition-shadow"
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">10</h3>
            <p className="text-gray-500 text-sm font-medium">Verified Application</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/refuted')}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[140px] cursor-pointer hover:shadow-md transition-shadow"
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">09</h3>
            <p className="text-gray-500 text-sm font-medium">Refute Application</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/super-admin/cases/unverified')}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative flex flex-col justify-between h-[140px] cursor-pointer hover:shadow-md transition-shadow"
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">18</h3>
            <p className="text-gray-500 text-sm font-medium">Un-Verified Application</p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#4338CA] focus:ring-[#4338CA]"
                    checked={
                      selectedRows.length === tableData.length &&
                      tableData.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Candidate ID</th>
                <th className="px-6 py-4">Case Type</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">TAT</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#4338CA] focus:ring-[#4338CA]"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.caseId}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{row.candidateId}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">
                      {row.caseType.split(" ")[0]}
                    </div>
                    {row.caseType.split(" ")[1] && (
                      <div className="text-gray-500 text-xs">
                        {row.caseType.split(" ").slice(1).join(" ")}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{row.name}</div>
                    <div className="text-gray-500 text-xs">{row.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">+91 {row.phone}</td>
                  <td className="px-6 py-4 text-gray-700">{row.tat}</td>
                  <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="relative inline-block text-left">
                      <button 
                        className="p-1 hover:bg-gray-200 rounded transition inline-flex justify-center items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === row.id ? null : row.id);
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {openDropdownId === row.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4338CA] transition-colors first:rounded-t-md"
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
                            View
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4338CA] transition-colors last:rounded-b-md"
                            onClick={() => {
                              setOpenDropdownId(null);
                              // Assign Vendor Action
                            }}
                          >
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
  );
}

export default SuperAdminCases;
