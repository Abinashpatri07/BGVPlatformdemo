import React, { useState } from "react";
import StatCard from "../../components/clientAdmin/billing/StatCard";
import TabBar from "../../components/clientAdmin/billing/TabBar";
import SectionHeader from "../../components/clientAdmin/billing/SectionHeader";
import InvoiceTable from "../../components/clientAdmin/billing/InvoiceTable";
import PurchaseCredits from "../../components/clientAdmin/billing/PurchaseCredits";
import UsageLogTable from "../../components/clientAdmin/billing/UsageLogTable";

const TABS = ["Purchase History", "Usage Log", "Purchase Credits"];

const STAT_CARDS = [
  { title: "Total Credits",     value: "58.78", icon: "🪙", iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { title: "Consume Credits",   value: "42.78", icon: "📉", iconBg: "bg-red-50",    iconColor: "text-red-500" },
  { title: "Available Credits", value: "16.00", icon: "💳", iconBg: "bg-green-50",  iconColor: "text-green-500" },
  { title: "Total Invoice",     value: "80",    icon: "🗒️", iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
];

const USAGE_LOG_CARDS = [
  {
    title: "Consumed Credit",
    value: "42.78L",
    icon: "🪙",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },

  {
    title: "Available Credit",
    value: "80",
    icon: "📁",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },

  {
    title: "Total Credit",
    value: "72.50L",
    icon: "🧾",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
];

const INVOICES = [
  { invoice: "#INV-2025-031", date: "01 Jul 2025", description: "Growth Plan – Jul",  subdescription: "monthly subscription", status: "Pending", amount: "₹14,999" },
  { invoice: "#INV-2025-030", date: "15 Jun 2025", description: "Elite Plan– JUL",    subdescription: "manual recharge",       status: "Paid",    amount: "₹50,000" },
  { invoice: "#INV-2025-029", date: "01 Jun 2025", description: "Growth Plan – Jun",  subdescription: "monthly subscription", status: "Paid",    amount: "₹14,999" },
  { invoice: "#INV-2025-028", date: "08 Jun 2025", description: "Elite Plan– JUL",    subdescription: "package purchase",      status: "Paid",    amount: "₹8,500"  },
  { invoice: "#INV-2025-027", date: "22 May 2025", description: "Growth Plan – May",  subdescription: "monthly subscription", status: "Paid",    amount: "₹14,999" },
  { invoice: "#INV-2025-026", date: "01 Apr 2025", description: "Elite Plan– JUL",    subdescription: "monthly subscription", status: "Pending", amount: "₹14,999" },
  { invoice: "#INV-2025-029", date: "01 Apr 2025", description: "Growth Plan – Apr",  subdescription: "monthly subscription", status: "Failed",  amount: "₹14,999" },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("Purchase History");

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

            {STAT_CARDS.map((card) => (

              <StatCard
                key={card.title}
                {...card}
              />

            ))}

          </div>
        )}

        {/* USAGE LOG CARDS */}
        {activeTab === "Usage Log" && (

          <div className="flex gap-4 flex-wrap mb-8">

            {USAGE_LOG_CARDS.map((card) => (

              <StatCard
                key={card.title}
                {...card}
              />

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
          <InvoiceTable rows={INVOICES} />
        </div>
      )}

      {activeTab === "Usage Log" && (
        <UsageLogTable />
      )}

      {activeTab === "Purchase Credits" && <PurchaseCredits />}
    </div>
  );
}