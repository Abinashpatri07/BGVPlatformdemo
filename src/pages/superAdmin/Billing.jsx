import React, { useState } from "react";
import {
  Banknote,
  History,
  FileText,
  CheckCircle,
  Calendar,
  ChevronDown,
  Building2,
  Wallet,
  User,
  Download,
  Filter,
  CircleDollarSign,
  X,
  MoreVertical
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Billing = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchFilter, setSearchFilter] = useState("Order ID");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const tabs = ["Overview", "Payment", "Refund"]; // "Dispute" commented out for now

  // Line Chart Data
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Payment",
        data: [5000, 17000, 12000, 21000, 9000, 20000, 25000],
        borderColor: "#4F46E5",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Refunds",
        data: [3000, 11000, 9000, 16000, 5000, 24000, 31000],
        borderColor: "#FBBF24",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => (value === 0 ? "0" : `${value / 1000}K`),
          color: "#9CA3AF",
          font: { size: 12 }
        },
        grid: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 12 } }
      },
    },
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Successful", "Pending", "Failed"],
    datasets: [
      {
        data: [896, 156, 98],
        backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 max-w-full">
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-indigo-100 text-indigo-700"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <>
          {/* Header & Date Picker */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Get A Quick Summary Of All Financial Activities Across The Platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50">
          <Calendar size={16} />
          Today 01 May 2025 - 31 May 2025
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Payments */}
        <div className="bg-[#f0fdf4] rounded-2xl p-4 shadow-sm border border-green-50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-white rounded-lg text-green-500 shadow-sm">
              <Banknote size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xs text-gray-600 font-medium">Total Payments</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">₹ 22,13,520.00</h3>
          </div>
        </div>

        {/* Total Refunds */}
        <div className="bg-[#fff1f2] rounded-2xl p-4 shadow-sm border border-red-50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-white rounded-lg text-red-400 shadow-sm">
              <History size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xs text-gray-600 font-medium">Total Refunds</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">₹ 1,20,450.00</h3>
          </div>
        </div>

        {/* Total Settlements */}
        <div className="bg-[#f0f9ff] rounded-2xl p-4 shadow-sm border border-blue-50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-sm">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xs text-gray-600 font-medium">Total Settlements</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">₹ 78,600.00</h3>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            
            {/* Custom Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div> Payment
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div> Refunds
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Settlements
              </div>
            </div>

            <select className="bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-md px-2 py-1 focus:outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Transaction Status Doughnut Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Transaction Status</h3>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="h-40 w-40 relative mb-6">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

            <div className="w-full space-y-3">
              {[
                { label: "Successful", value: "896", percent: "71.8%", color: "bg-green-500" },
                { label: "Pending", value: "156", percent: "12.5%", color: "bg-yellow-400" },
                { label: "Failed", value: "98", percent: "7.8%", color: "bg-red-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <div className="text-gray-900 font-medium">
                    {item.value} <span className="text-gray-400 font-normal">({item.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Lower Section: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        
        {/* Top Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Payment Methods</h3>
          
          <div className="space-y-3">
            {/* UPI */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-900 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-indigo-100 rounded text-indigo-600 flex justify-center items-center text-[9px]">₹</div>
                  UPI
                </div>
                <span>₹ 9,85,420.00</span>
              </div>
              <div className="w-full bg-indigo-50 rounded-full h-1.5">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            {/* Credit Card */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-900 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-green-100 rounded text-green-600 flex justify-center items-center text-[9px]"><Banknote size={10}/></div>
                  Credit Card
                </div>
                <span>₹ 6,45,210.00</span>
              </div>
              <div className="w-full bg-green-50 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>

            {/* Net Banking */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-900 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-yellow-100 rounded text-yellow-600 flex justify-center items-center text-[9px]"><Building2 size={10}/></div>
                  Net Banking
                </div>
                <span>₹ 4,25,110.00</span>
              </div>
              <div className="w-full bg-yellow-50 rounded-full h-1.5">
                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>

            {/* Wallet */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-900 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-purple-100 rounded text-purple-600 flex justify-center items-center text-[9px]"><Wallet size={10}/></div>
                  Wallet
                </div>
                <span>₹ 1,57,780.00</span>
              </div>
              <div className="w-full bg-purple-50 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "15%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Clients By Revenue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Clients By Revenue</h3>
          
          <div className="space-y-2">
            {[
              { name: "TechNova Solutions", amount: "₹ 9,85,420.00" },
              { name: "InnoTech Pvt. Ltd.", amount: "₹ 3,75,400.00" },
              { name: "Bright Future HR", amount: "₹ 3,25,000.00" },
              { name: "PeopleFro Services", amount: "₹ 2,15,700.00" },
              { name: "HR Vision Corp.", amount: "₹ 1,65,250.00" },
            ].map((client, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold text-gray-900 py-1 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-indigo-50 rounded text-indigo-600 flex justify-center items-center">
                    <User size={10} />
                  </div>
                  <span className="font-medium text-gray-700">{client.name}</span>
                </div>
                <span>{client.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activities</h3>
          
          <div className="space-y-0">
            {/* Activity 1 */}
            <div className="flex justify-between items-start py-2 border-b border-gray-100 first:pt-0">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-50 rounded-lg text-green-500 flex justify-center items-center shrink-0">
                  <CheckCircle size={14} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-gray-800 leading-snug">
                    Payment Received From<br/>TechNova Solutions
                  </p>
                  <span className="text-[10px] text-gray-400">31 May 2025</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-900 mt-1">₹ 12,450.00</span>
            </div>

            {/* Activity 2 */}
            <div className="flex justify-between items-start py-2 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-red-50 rounded-lg text-red-500 flex justify-center items-center shrink-0">
                  <History size={14} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-gray-800 leading-snug">
                    Refund Processed For InnoTech<br/>Pvt. Ltd.
                  </p>
                  <span className="text-[10px] text-gray-400">31 May 2025</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-900 mt-1">₹ 2,500.00</span>
            </div>

            {/* Activity 3 */}
            <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-orange-50 rounded-lg text-orange-500 flex justify-center items-center shrink-0">
                  <FileText size={14} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-gray-800 leading-snug">
                    Dispute Raised By Bright Future<br/>HR
                  </p>
                  <span className="text-[10px] text-gray-400">31 May 2025</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-900 mt-1">₹ 5,200.00</span>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === "Payment" && (
        <>
          {/* Header & Date Picker */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Payment</h1>
              <p className="text-sm text-gray-500 mt-1">
                Get A Quick Summary Of All Financial Activities Across The Platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50">
                <Calendar size={16} />
                Today 01 May 2025 - 31 May 2025
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-indigo-600 font-medium shadow-sm hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Payment Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* All Payments */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-blue-50 rounded-xl text-blue-500 flex justify-center items-center">
                <Wallet size={16} strokeWidth={2} />
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">All Payments</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">1,124</h3>
              </div>
            </div>

            {/* Successful */}
            <div className="bg-[#f0fdf4] rounded-2xl p-4 shadow-sm border border-green-50 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-green-100 rounded-xl text-green-600 flex justify-center items-center">
                <Banknote size={16} strokeWidth={2} />
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">Successful</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">896</h3>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-[#fff1f2] rounded-2xl p-4 shadow-sm border border-red-50 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-red-100 rounded-xl text-red-500 flex justify-center items-center">
                <CircleDollarSign size={16} strokeWidth={2} />
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">Pending</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">156</h3>
              </div>
            </div>

            {/* Failed */}
            <div className="bg-[#faf5ff] rounded-2xl p-4 shadow-sm border border-purple-50 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-purple-100 rounded-xl text-purple-500 flex justify-center items-center relative">
                <Banknote size={16} strokeWidth={2} />
                <div className="absolute bottom-1 right-1 bg-purple-100 rounded-full w-2.5 h-2.5 flex items-center justify-center">
                  <X size={8} strokeWidth={4} />
                </div>
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">Failed</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">72</h3>
              </div>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto relative">
              <div 
                className="text-sm text-gray-500 flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 cursor-pointer hover:text-gray-700 select-none"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              >
                {searchFilter} <ChevronDown size={14} />
              </div>
              
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {["All", "Transaction ID", "Order ID"].map((option) => (
                    <div 
                      key={option}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setSearchFilter(option);
                        setIsSearchDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
              
              <input type="text" placeholder="Ex: ORD-2025-5589" className="bg-transparent border-none outline-none text-sm w-full sm:w-48 text-gray-700" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[120px]">
                All Status <ChevronDown size={16} />
              </button>
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[170px]">
                All Payment Methods <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium shadow-sm hover:bg-gray-50">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Client / Company</th>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Payment Method</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium">Payment Ref. No.</th>
                    <th className="px-6 py-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { date: "31 May 2025, 10:45 AM", txnId: "TXN-5267789012", client: "TechNova Solutions", orderId: "ORD-2025-5589", amount: "₹ 12,450.00", method: "UPI", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "UPI/5267789012" },
                    { date: "31 May 2025, 09:30 AM", txnId: "TXN-5264506677", client: "NextGen Solutions", orderId: "ORD-2025-5582", amount: "₹ 12,450.00", method: "Credit Card", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "NB/1122334456" },
                    { date: "30 May 2025, 06:15 PM", txnId: "TXN-5267712233", client: "Global Talent Hub", orderId: "ORD-2025-5583", amount: "₹ 12,450.00", method: "Net Banking", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "CC/8899001122" },
                    { date: "30 May 2025, 06:15 PM", txnId: "TXN-5266457780", client: "Skyline HR", orderId: "ORD-2025-5584", amount: "₹ 12,450.00", method: "UPI", status: "Pending", statusColor: "bg-orange-100 text-orange-700", refNo: "UPI/5265211122" },
                    { date: "30 May 2025, 05:40 PM", txnId: "TXN-5266003321", client: "HR Vision Corp.", orderId: "ORD-2025-5585", amount: "₹ 12,450.00", method: "UPI", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "WLT/889900112" },
                    { date: "29 May 2025, 04:22 PM", txnId: "TXN-5265338890", client: "Bright Future HR", orderId: "ORD-2025-5586", amount: "₹ 12,450.00", method: "Wallet", status: "Failed", statusColor: "bg-red-100 text-red-700", refNo: "UPI/5266003321" },
                    { date: "29 May 2025, 02:10 PM", txnId: "TXN-5265211122", client: "PeopleFro Services", orderId: "ORD-2025-5587", amount: "₹ 12,450.00", method: "UPI", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "CC/4756128890" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600">{row.txnId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.client}</td>
                      <td className="px-6 py-4 text-gray-500">{row.orderId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{row.method}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{row.refNo}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Showing 
                <select className="border border-gray-200 rounded px-1 py-0.5 outline-none bg-white">
                  <option>9</option>
                  <option>10</option>
                  <option>20</option>
                </select> 
                out of 40
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-50">
                  &larr; Previous
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 font-medium">1</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">2</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">3</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">4</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">5</button>
                  <span className="text-gray-400 px-1">...</span>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">8</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">9</button>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-gray-900 font-medium hover:opacity-80">
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "Refund" && (
        <>
          {/* Header & Date Picker */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Refund</h1>
              <p className="text-sm text-gray-500 mt-1">
                View And Manage All Refund Transactions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50">
                <Calendar size={16} />
                Today 01 May 2025 - 31 May 2025
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-indigo-600 font-medium shadow-sm hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto relative">
              <div 
                className="text-sm text-gray-500 flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 cursor-pointer hover:text-gray-700 select-none"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              >
                {searchFilter} <ChevronDown size={14} />
              </div>
              
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {["All", "Transaction ID", "Order ID"].map((option) => (
                    <div 
                      key={option}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setSearchFilter(option);
                        setIsSearchDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
              
              <input type="text" placeholder="Ex: ORD-2025-5589" className="bg-transparent border-none outline-none text-sm w-full sm:w-48 text-gray-700" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[120px]">
                All Status <ChevronDown size={16} />
              </button>
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[170px]">
                All Payment Methods <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium shadow-sm hover:bg-gray-50">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Client / Company</th>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Payment Method</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium">Payment Ref. No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { date: "31 May 2025, 10:45 AM", txnId: "TXN-5267789012", client: "TechNova Solutions", orderId: "ORD-2025-5589", amount: "₹ 12,450.00", method: "UPI", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "UPI/5267789012" },
                    { date: "31 May 2025, 09:30 AM", txnId: "TXN-5264506677", client: "NextGen Solutions", orderId: "ORD-2025-5582", amount: "₹ 12,450.00", method: "Credit Card", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "NB/1122334456" },
                    { date: "30 May 2025, 06:15 PM", txnId: "TXN-5267712233", client: "Global Talent Hub", orderId: "ORD-2025-5583", amount: "₹ 12,450.00", method: "Net Banking", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "CC/8899001122" },
                    { date: "30 May 2025, 06:15 PM", txnId: "TXN-5266457780", client: "Skyline HR", orderId: "ORD-2025-5584", amount: "₹ 12,450.00", method: "UPI", status: "Pending", statusColor: "bg-orange-100 text-orange-700", refNo: "UPI/5265211122" },
                    { date: "30 May 2025, 05:40 PM", txnId: "TXN-5266003321", client: "HR Vision Corp.", orderId: "ORD-2025-5585", amount: "₹ 12,450.00", method: "UPI", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "WLT/889900112" },
                    { date: "29 May 2025, 04:22 PM", txnId: "TXN-5265338890", client: "Bright Future HR", orderId: "ORD-2025-5586", amount: "₹ 12,450.00", method: "Wallet", status: "Failed", statusColor: "bg-red-100 text-red-700", refNo: "UPI/5266003321" },
                    { date: "29 May 2025, 02:10 PM", txnId: "TXN-5265211122", client: "PeopleFro Services", orderId: "ORD-2025-5587", amount: "₹ 12,450.00", method: "UPI", status: "Success", statusColor: "bg-green-100 text-green-700", refNo: "CC/4756128890" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600">{row.txnId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.client}</td>
                      <td className="px-6 py-4 text-gray-500">{row.orderId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{row.method}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{row.refNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Showing 
                <select className="border border-gray-200 rounded px-1 py-0.5 outline-none bg-white">
                  <option>9</option>
                  <option>10</option>
                  <option>20</option>
                </select> 
                out of 40
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-50">
                  &larr; Previous
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 font-medium">1</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">2</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">3</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">4</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">5</button>
                  <span className="text-gray-400 px-1">...</span>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">8</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">9</button>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-gray-900 font-medium hover:opacity-80">
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Billing;
