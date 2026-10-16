import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function VendorBilling() {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("All Time");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSettled: "₹ 0.00",
    totalUnsettled: "₹ 0.00",
    settledGrowth: "+0%",
    unsettledGrowth: "+0%"
  });
  const [settlements, setSettlements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const dateRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("vendorToken");
        const res = await axios.get(`${API}/api/vendor/billing/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.stats || {});
          setSettlements(res.data.settlements || []);
        }
      } catch (err) {
        console.error("Error fetching vendor billing overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const dateOptions = ["All Time", "Today", "Last 7 Days", "This Month", "Last Month"];
  const statusOptions = ["All Status", "Processed", "In Progress"];

  // Filtered rows
  const filteredData = settlements.filter((row) => {
    const matchesStatus =
      selectedStatus === "All Status" || row.status.toLowerCase() === selectedStatus.toLowerCase();
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (row.utr && row.utr.toLowerCase().includes(query)) ||
      (row.caseId && row.caseId.toLowerCase().includes(query)) ||
      (row.candidateName && row.candidateName.toLowerCase().includes(query)) ||
      (row.serviceName && row.serviceName.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-2 md:px-8 md:pt-2 md:pb-8 space-y-8 animate-fade-in text-gray-800">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Settlement Overview</h1>
        <p className="text-gray-600 font-medium mt-1">Track And Manage Your Payment Settlements Efficiently.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settled Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-100">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
              <TrendingUp size={14} />
              <span>{stats.settledGrowth || "+12.5%"}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Total Settled Amount</p>
            <h2 className="text-4xl font-bold text-gray-900">{stats.totalSettled || "₹ 0.00"}</h2>
          </div>
        </div>

        {/* Unsettled Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4 border border-amber-100">
              <AlertCircle size={24} />
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
              <TrendingUp size={14} />
              <span>{stats.unsettledGrowth || "+3.2%"}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Total Unsettled / In-Progress Amount</p>
            <h2 className="text-4xl font-bold text-gray-900">{stats.totalUnsettled || "₹ 0.00"}</h2>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 relative z-10">
          
          {/* Date Filter Dropdown */}
          <div className="relative" ref={dateRef}>
            <button 
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              <Calendar size={18} />
              {selectedDate}
              <ChevronDown size={16} />
            </button>
            {isDateOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                {dateOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedDate(opt); setIsDateOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              <Filter size={18} />
              {selectedStatus}
              <ChevronDown size={16} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedStatus(opt); setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search Case, Candidate, UTR..." 
            className="w-full pl-4 pr-10 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-indigo-600">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-[#EBEBEB] border-b border-gray-200 text-sm font-bold text-gray-800">
                <th className="py-4 px-6 whitespace-nowrap">Case ID / Service</th>
                <th className="py-4 px-6 whitespace-nowrap">Candidate</th>
                <th className="py-4 px-6 whitespace-nowrap">Transaction Period</th>
                <th className="py-4 px-6 whitespace-nowrap">UTR / Ref</th>
                <th className="py-4 px-6 whitespace-nowrap">Settled Amount</th>
                <th className="py-4 px-6 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm font-medium">
                    No settlement records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-indigo-900">{row.caseId}</div>
                      <div className="text-xs text-gray-500 font-semibold">{row.serviceName}</div>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                      {row.candidateName}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-600">
                      {row.transactionPeriod}
                    </td>
                    <td className="py-4 px-6 text-sm font-mono font-medium text-gray-700">
                      {row.utr}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      {row.amount}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold rounded border ${
                          row.status === "Processed"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-gray-600 pt-2">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <select 
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="border border-gray-200 rounded px-2 py-1 bg-white outline-none focus:border-indigo-500 font-semibold text-gray-800"
          >
            <option value={5}>5</option>
            <option value={9}>9</option>
            <option value={20}>20</option>
          </select>
          <span>out of {filteredData.length}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="flex items-center gap-1 px-3 py-1 hover:text-indigo-600 transition disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs transition ${
                  currentPage === page
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-1 hover:text-indigo-600 transition disabled:opacity-40"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}

export default VendorBilling;
