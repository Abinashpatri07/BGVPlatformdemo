import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const DUMMY_DATA = Array(4).fill(null).map((_, i) => ({
  id: i,
  date: "04 May 2026",
  time: "05:45 PM",
  transactionPeriod: "31st Mar 2026,05:26 PM",
  utr: "HDFCJHOO248IDWJ",
  amount: "₹ 14,254.00",
  status: "Processed"
}));

function VendorBilling() {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedStatus, setSelectedStatus] = useState("Filter");
  
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

  const dateOptions = ["Today", "Last 7 Days", "This Month", "Last Month", "Custom Date Range"];
  const statusOptions = ["Processed", "Failed", "In Progress"];

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
              <span>+15.7%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Total Settled Amount</p>
            <h2 className="text-4xl font-bold text-gray-900">₹ 24,50,000</h2>
          </div>
        </div>

        {/* Unsettled Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between relative">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 border border-red-100">
              <AlertCircle size={24} />
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
              <TrendingUp size={14} />
              <span>+5.1%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Total Unsettled Amount</p>
            <h2 className="text-4xl font-bold text-gray-900">₹ 3,20,000</h2>
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

          <button className="px-5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold text-sm rounded-lg hover:bg-indigo-100 transition">
            Apply Filter
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-4 pr-10 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-[#EBEBEB] border-b border-gray-200 text-sm font-bold text-gray-800">
              <th className="py-4 px-6 whitespace-nowrap">Initiated Date</th>
              <th className="py-4 px-6 whitespace-nowrap">Transaction Period</th>
              <th className="py-4 px-6 whitespace-nowrap">UTR</th>
              <th className="py-4 px-6 whitespace-nowrap">Settled Amount</th>
              <th className="py-4 px-6 whitespace-nowrap text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {DUMMY_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition">
                <td className="py-4 px-6">
                  <div className="text-sm font-bold text-gray-900">{row.date}</div>
                  <div className="text-xs text-gray-500 font-semibold">{row.time}</div>
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-gray-700">
                  {row.transactionPeriod}
                </td>
                <td className="py-4 px-6 text-sm font-semibold text-gray-700">
                  {row.utr}
                </td>
                <td className="py-4 px-6 text-sm font-bold text-gray-900">
                  {row.amount}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-50 text-emerald-500 text-xs font-bold rounded border border-emerald-100">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-gray-600 pt-2">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <select className="border border-gray-200 rounded px-2 py-1 bg-white outline-none focus:border-indigo-500 font-semibold text-gray-800">
            <option>9</option>
            <option>10</option>
            <option>20</option>
          </select>
          <span>out of 40</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1 hover:text-indigo-600 transition">
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center">3</button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center">4</button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center">5</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center">8</button>
            <button className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center">9</button>
          </div>

          <button className="flex items-center gap-1 px-3 py-1 hover:text-indigo-600 transition">
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}

export default VendorBilling;
