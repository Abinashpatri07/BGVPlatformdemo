// src/pages/clientAdmin/Analytics.jsx

import { useState, useMemo, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import { Loader2 } from "lucide-react";
import AnalyticsTabs from "../../components/clientAdmin/analytics/AnalyticsTabs";
import AnalyticsToolbar from "../../components/clientAdmin/analytics/AnalyticsToolbar";
import SLABreachTable from "../../components/clientAdmin/analytics/SLABreachTable";
import TATTable from "../../components/clientAdmin/analytics/TATTable";
import MISTable from "../../components/clientAdmin/analytics/MISTable";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("MIS");
  const [search, setSearch] = useState("");
  const [misList, setMisList] = useState([]);
  const [caseAnalytics, setCaseAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real client admin analytics data from backend
  useEffect(() => {
    let isMounted = true;
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [misRes, casesRes] = await Promise.all([
          axiosInstance.get("/api/client-admin/analytics/mis"),
          axiosInstance.get("/api/client-admin/analytics/cases"),
        ]);

        if (isMounted) {
          if (misRes.data?.success && Array.isArray(misRes.data.data)) {
            setMisList(misRes.data.data);
          }
          if (casesRes.data?.success && Array.isArray(casesRes.data.data)) {
            setCaseAnalytics(casesRes.data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching client admin analytics data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalyticsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter SLA data
  const filteredSLA = useMemo(() => {
    const list = caseAnalytics;
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.hr && r.hr.toLowerCase().includes(q)) ||
        (r.candId && String(r.candId).toLowerCase().includes(q)) ||
        (r.checkType && r.checkType.toLowerCase().includes(q))
    );
  }, [search, caseAnalytics]);

  // Filter TAT data
  const filteredTAT = useMemo(() => {
    const list = caseAnalytics;
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.hr && r.hr.toLowerCase().includes(q)) ||
        (r.candId && String(r.candId).toLowerCase().includes(q)) ||
        (r.checkType && r.checkType.toLowerCase().includes(q))
    );
  }, [search, caseAnalytics]);

  // Filter MIS data
  const filteredMIS = useMemo(() => {
    if (!search.trim()) return misList;
    const q = search.toLowerCase();
    return misList.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.hr && r.hr.toLowerCase().includes(q)) ||
        (r.candId && String(r.candId).toLowerCase().includes(q))
    );
  }, [search, misList]);

  // CSV download handler
  const handleDownload = () => {
    let headers = [];
    let rows = [];

    if (activeTab === "SLA Breach") {
      headers = [
        "Cand ID,Candidate Name,Email,Phone,Assign HR,Status,Check ID,Check Type,Initiation Day,SLA Date,Breached Day",
      ];
      rows = filteredSLA.map(
        (r) =>
          `"${r.candId || ''}","${r.name || ''}","${r.email || ''}","${r.phone || ''}","${r.hr || ''}","${r.status || ''}","${r.checkId || ''}","${r.checkType || ''}","${r.initiationDay || ''}","${r.slaDate || ''}","${r.breachedDay || ''}"`
      );
    } else if (activeTab === "MIS") {
      headers = [
        "Cand ID,Candidate Name,Email,Phone,Assign HR,Status,Permanent Address,Present Address,Driving License,Passport,PAN Card,Voter ID,Employment 1,Employment 2,Last Education,Criminal Record,Drug Test",
      ];
      rows = filteredMIS.map(
        (r) =>
          `"${r.candId || ''}","${r.name || ''}","${r.email || ''}","${r.phone || ''}","${r.hr || ''}","${r.status || ''}","${r.permanentAddress || ''}","${r.presentAddress || ''}","${r.drivingLicense || ''}","${r.passport || ''}","${r.panCard || ''}","${r.voterId || ''}","${r.employment1 || ''}","${r.employment2 || ''}","${r.lastEducation || ''}","${r.criminalRecord || ''}","${r.drugTest || ''}"`
      );
    } else if (activeTab === "TAT") {
      headers = [
        "Cand ID,Candidate Name,Email,Phone,Assign HR,Status,Check ID,Check Type,Initiation Day,Actual Days,Target Days",
      ];
      rows = filteredTAT.map(
        (r) =>
          `"${r.candId || ''}","${r.name || ''}","${r.email || ''}","${r.phone || ''}","${r.hr || ''}","${r.status || ''}","${r.checkId || ''}","${r.checkType || ''}","${r.initiationDay || ''}","${r.actual || ''}","${r.target || ''}"`
      );
    }

    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `client_admin_${activeTab.toLowerCase().replace(/\s+/g, "_")}_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Candidate Analytics
      </h1>
      <p className="text-sm text-gray-400 mb-5">
        Track And Manage Verification Data Efficiently.
      </p>

      {/* TABS */}
      <AnalyticsTabs active={activeTab} onChange={setActiveTab} />

      {/* TOOLBAR */}
      <AnalyticsToolbar
        search={search}
        onSearch={setSearch}
        onDownload={handleDownload}
      />

      {/* LOADING STATE */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="animate-spin text-[#02027A] mb-3" size={36} />
          <p className="text-sm font-medium text-gray-600">Loading client analytics data...</p>
        </div>
      ) : (
        <>
          {/* TABLES */}
          {activeTab === "MIS" && <MISTable data={filteredMIS} />}
          {activeTab === "SLA Breach" && <SLABreachTable data={filteredSLA} />}
          {activeTab === "TAT" && <TATTable data={filteredTAT} />}
        </>
      )}
    </div>
  );
}
