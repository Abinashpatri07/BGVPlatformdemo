import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  ListFilter,
  Calendar,
  Search,
  Upload,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSmall
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";

const getStatusBadge = (status) => {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#B91C1C]">
      {status}
    </span>
  );
};

function RefuteApplications() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vendorToken");
      const res = await axiosInstance.get("/api/vendor/cases/assigned", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCases(res.data.data.filter(c => c.status === "Refute" || c.status === "Hold"));
      }
    } catch (err) {
      console.error("Failed to fetch refute cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleAll = () => {
    if (selectedRows.length === cases.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(cases.map((row) => row.id));
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in pb-10 px-4">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E1B4B] mb-2">
          Refute Application
        </h1>
        <div className="flex items-center text-sm text-gray-600 font-medium">
          <Link to="/vendor/dashboard" className="hover:text-[#4338CA] transition">Dashboard</Link>
          <ChevronRightSmall size={16} className="mx-1 text-gray-400" />
          <span>Refute Application</span>
        </div>
      </div>

      {/* CONTROLS SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition shadow-sm">
            All
          </button>
          <button onClick={fetchCases} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <ListFilter size={16} />
            Short by Name
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <Calendar size={16} />
            Short by Date
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
              className="pl-10 pr-4 py-2 border border-gray-300 bg-gray-50/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30 w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#4338CA] text-[#4338CA] bg-white rounded-lg text-sm font-medium hover:bg-indigo-50 transition shadow-sm">
            <Upload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mt-4">
        <div className="overflow-x-auto">
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
                <th className="px-3 py-1.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">Loading cases...</td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">No refuted cases found.</td>
                </tr>
              ) : (
                cases.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${selectedRows.includes(row.id) ? "bg-red-50" : ""}`}
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
                          const mode = "view";
                          if (row.caseType.includes("Employment")) {
                            navigate(`/vendor/employment-details?mode=${mode}&caseId=${row.id}`);
                          } else if (row.caseType.includes("Address")) {
                            navigate(`/vendor/address-details?mode=${mode}&caseId=${row.id}`);
                          } else if (row.caseType.includes("Drug")) {
                            navigate(`/vendor/drug-test-details?mode=${mode}&caseId=${row.id}`);
                          } else if (row.caseType.includes("Education")) {
                            navigate(`/vendor/education-details?mode=${mode}&caseId=${row.id}`);
                          } else if (row.caseType.includes("Criminal")) {
                            navigate(`/vendor/criminal-details?mode=${mode}&caseId=${row.id}`);
                          } else if (row.caseType.includes("Identification") || row.caseType.includes("Identity")) {
                            navigate(`/vendor/identity-details?mode=${mode}&caseId=${row.id}`);
                          } else if (row.caseType.includes("Reference")) {
                            navigate(`/vendor/reference-details?mode=${mode}&caseId=${row.id}`);
                          }
                        }}
                      >
                        <Eye size={18} />
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
            <span>out of {cases.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 px-3 py-1 hover:bg-gray-100 rounded transition font-medium text-gray-700">
              <ChevronLeft size={16} />
              Previous
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#EEF2FF] text-[#4338CA] font-semibold border border-[#C7D2FE]">
              1
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

export default RefuteApplications;
