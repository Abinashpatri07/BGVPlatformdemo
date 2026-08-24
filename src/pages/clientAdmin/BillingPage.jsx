import React, { useState, useEffect } from "react";
import axios from "axios";
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
              <button className="border border-blue-700 text-blue-700 text-sm font-semibold px-4 py-2 rounded-lg bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                Export CSV
              </button>
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