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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    caseType: "Reference Check",
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
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Address Verification",
    name: "Niten Sharma",
    email: "nitenkumar34@gmail.com",
    phone: "1234567890",
    tat: "5 Days",
    status: "Assigned",
  },
  {
    id: 9,
    caseId: "CASE-6567FAFB",
    candidateId: "CAND_100421",
    caseType: "Education Verification",
    name: "Ishaan Verma",
    email: "ishaan.verma@talent.io",
    phone: "1234567890",
    tat: "3 Days",
    status: "Unverified",
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

function VendorHome() {
  const [selectedRows, setSelectedRows] = useState([]);
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
          Hi Rohit Good Morning!
        </h1>
        <p className="text-gray-600 mt-2 font-medium">
          "Power Your Ecosystem With Verified Partners And Real-Time Insights."
        </p>
      </div>

      {/* CONTROLS SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            <ListFilter size={16} />
            Sort by Name
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            <Calendar size={16} />
            Sort by Date
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#4338CA] text-[#4338CA] rounded-lg text-sm font-medium hover:bg-indigo-50 transition">
            <Upload size={16} />
            Export
          </button>
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
                    <button 
                      className="p-1 hover:bg-gray-200 rounded transition inline-flex justify-center items-center"
                      onClick={() => {
                        if (row.caseType.includes("Employment Verification")) {
                          navigate('/vendor/employment-details');
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

export default VendorHome;
