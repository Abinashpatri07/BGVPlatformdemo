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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [userName, setUserName] = useState("Vendor");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vendorToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/cases/assigned`, {
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

      {/* CONTROLS SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
            All
          </button>
          <button onClick={fetchCases} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
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
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>

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
                  <td colSpan="8" className="text-center py-10 text-gray-500">Loading cases...</td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">No cases found.</td>
                </tr>
              ) : (
                cases.slice(0, 10).map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >

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

export default VendorHome;
