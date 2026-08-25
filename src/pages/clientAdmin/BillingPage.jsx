import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { downloadCSV } from "../../utils/exportCsv";
import { downloadPDF } from "../../utils/exportPdf";
import { Upload, FileText, FileDown } from "lucide-react";
import StatCard from "../../components/clientAdmin/billing/StatCard";
import TabBar from "../../components/clientAdmin/billing/TabBar";
import SectionHeader from "../../components/clientAdmin/billing/SectionHeader";
import InvoiceTable from "../../components/clientAdmin/billing/InvoiceTable";
import PurchaseCredits from "../../components/clientAdmin/billing/PurchaseCredits";
import UsageLogTable from "../../components/clientAdmin/billing/UsageLogTable";

const TABS = ["Purchase History", "Usage Log", "Purchase Credits"];

// Mock data removed, we fetch from API now.

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("Purchase History");
  
  const [historyData, setHistoryData] = useState({ invoices: [], stats: {} });
  const [usageData, setUsageData] = useState({ logs: [], stats: {} });

  useEffect(() => {
    if (activeTab === "Purchase History") {
      axios.get("http://localhost:5000/api/client-admin/billing/history", { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            setHistoryData({
              invoices: res.data.invoices,
              stats: res.data.stats
            });
          }
        })
        .catch(err => console.error("Error fetching history:", err));
    } else if (activeTab === "Usage Log") {
      axios.get("http://localhost:5000/api/client-admin/billing/usage-logs", { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            setUsageData({
              logs: res.data.logs,
              stats: res.data.stats
            });
          }
        })
        .catch(err => console.error("Error fetching usage logs:", err));
    }
  }, [activeTab]);

  // Derived Cards
  const statCards = [
    { title: "Total Credits",     value: historyData.stats.totalCredits || "0", icon: "🪙", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
    { title: "Consume Credits",   value: historyData.stats.consumeCredits || "0", icon: "📉", iconBg: "bg-red-50",    iconColor: "text-red-500" },
    { title: "Available Credits", value: historyData.stats.availableCredits || "0", icon: "💳", iconBg: "bg-green-50",  iconColor: "text-green-500" },
    { title: "Total Invoice",     value: historyData.stats.totalInvoice || "0",    icon: "🗒️", iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
  ];

  const usageLogCards = [
    { title: "Consumed Credit", value: usageData.stats.consumedCredit || "0", icon: "🪙", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
    { title: "Available Credit", value: usageData.stats.availableCredit || "0", icon: "📁", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
    { title: "Total Credit", value: usageData.stats.totalCredit || "0", icon: "🧾", iconBg: "bg-yellow-50", iconColor: "text-yellow-500" },
  ];

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const exportBtnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportBtnRef.current && !exportBtnRef.current.contains(event.target)) {
        setShowExportModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportInvoices = () => {
    if (!historyData.invoices.length) return alert("No invoices to export.");
    const exportData = historyData.invoices.map(inv => ({
      "Invoice Number": inv.invoice,
      "Date": inv.date,
      "Package": inv.description,
      "Type": inv.subdescription,
      "Status": inv.status,
      "Amount": inv.amount
    }));
    downloadCSV(exportData, "Purchase_History.csv");
  };

  const handleDownload = () => {
    if (selectedType === "CSV") {
      handleExportInvoices();
    } else if (selectedType === "PDF") {
      if (!historyData.invoices.length) return alert("No invoices to export.");
      const exportData = historyData.invoices.map(inv => ({
        "Invoice Number": inv.invoice,
        "Date": inv.date,
        "Package": inv.description,
        "Type": inv.subdescription,
        "Status": inv.status,
        "Amount": inv.amount
      }));
      downloadPDF(exportData, "Purchase History Report", "Purchase_History.pdf");
    }
    setShowExportModal(false);
    setSelectedType("");
  };

  return (
    <div className="min-h-screen  px-10 py-9 font-sans">

      {/* Page Title */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Billing &amp; Subscriptions
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage Your Wallet Balance, Monitor Package Usage, And Review Payment Requests.
        </p>
      </div>

            {/* PURCHASE HISTORY CARDS */}
        {activeTab === "Purchase History" && (

          <div className="flex gap-4 flex-wrap mb-8">

            {statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        )}

        {/* USAGE LOG CARDS */}
        {activeTab === "Usage Log" && (
          <div className="flex gap-4 flex-wrap mb-8">
            {usageLogCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        )}

      {/* Tabs */}
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "Purchase History" && (
        <div>
          <SectionHeader
            title="Billing & Payments"
            subtitle="All Transactions For This Account"
            action={
              <div className="relative" ref={exportBtnRef}>
                <button 
                  onClick={() => setShowExportModal(!showExportModal)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition shadow-sm"
                >
                  <Upload size={16} />
                  Export
                </button>
                
                {showExportModal && (
                  <div className="absolute right-0 top-full mt-3 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64 z-50">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">Select File Type</h2>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedType("PDF")}
                        className={`flex flex-col items-center justify-center gap-1 border rounded-xl p-3 transition ${
                          selectedType === "PDF"
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FileText size={22} className="text-indigo-600" />
                        <span className="text-xs font-medium text-gray-700">PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedType("CSV")}
                        className={`flex flex-col items-center justify-center gap-1 border rounded-xl p-3 transition ${
                          selectedType === "CSV"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <FileDown size={22} className="text-orange-500" />
                        <span className="text-xs font-medium text-gray-700">CSV</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!selectedType}
                      className={`w-full py-2.5 rounded-lg text-sm text-white font-semibold transition ${
                        selectedType
                          ? "bg-[#5E3BEE] hover:bg-[#4d30c4] cursor-pointer"
                          : "bg-[#E6E8EA] text-[#A6ACBE] cursor-not-allowed"
                      }`}
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
            }
          />
          <InvoiceTable rows={historyData.invoices} />
        </div>
      )}

      {activeTab === "Usage Log" && (
        <UsageLogTable logs={usageData.logs} />
      )}

      {activeTab === "Purchase Credits" && <PurchaseCredits />}
    </div>
  );
}