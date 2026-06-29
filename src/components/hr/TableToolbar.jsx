import {
  RefreshCw,
  List,
  CalendarDays,
  Search,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

function ExportPopup({ type, message, onClose }) {
  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-[fadeIn_0.3s_ease-out]">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg border-l-4 ${
        isSuccess ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
      }`}>
        {isSuccess ? (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
        )}
        <div className="flex flex-col">
          <span className="font-bold">{isSuccess ? "Export Successful" : "Export Failed"}</span>
          <span className="text-sm">{message}</span>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600 transition">
          ✕
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function TableToolbar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedType, setSelectedType] = useState("csv");
  const [exporting, setExporting] = useState(false);
  const [popup, setPopup] = useState(null);
  const dropdownRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowExportModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const sortButtons = [
    { label: "All",          value: "all",  icon: null },
    { label: "Sort by Name", value: "name", icon: <List size={15} /> },
    { label: "Sort by Date", value: "date", icon: <CalendarDays size={15} /> },
  ];

  /* ── Fetch latest candidates for export ── */
  const fetchForExport = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/candidates/get_all_candidates"
    );
    return res.data.success ? res.data.candidates : [];
  };

  const getStatusLabel = (status) => {
    switch (Number(status)) {
      case 1: return "Awaiting Input";
      case 2: return "Profile Complete";
      case 3: return "Verification In Progress";
      case 4: return "Verified";
      case 5: return "On Hold";
      case 6: return "Rejected";
      default: return "In Progress";
    }
  };

  /* ── CSV Export ── */
  const exportCSV = (candidates) => {
    const headers = ["Cand ID", "Case ID", "First Name", "Last Name", "Email", "Phone", "Function", "Tag", "Status", "Created At"];
    const rows = candidates.map((c) => [
      c.cand_id,
      c.case_id,
      c.first_name,
      c.last_name,
      c.email,
      c.phone,
      c.job_function || "",
      c.tag || "",
      getStatusLabel(c.case_status),
      new Date(c.created_at).toLocaleDateString("en-IN"),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidates_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── PDF Export ── */
  const exportPDF = (candidates) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.setFontSize(16);
    doc.setTextColor(1, 2, 110);
    doc.text("BGV Platform — Candidate List", 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Exported: ${new Date().toLocaleString("en-IN")}`, 14, 25);
    doc.text(`Total Records: ${candidates.length}`, 14, 30);

    const tableRows = candidates.map((c) => [
      c.cand_id,
      c.case_id,
      `${c.first_name} ${c.last_name}`,
      c.email,
      c.phone,
      c.job_function || "-",
      c.tag || "-",
      getStatusLabel(c.case_status),
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["ID", "Case ID", "Name", "Email", "Phone", "Function", "Tag", "Status"]],
      body: tableRows,
      headStyles: {
        fillColor: [1, 2, 110],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 254] },
      styles: { cellPadding: 3 },
    });

    doc.save(`candidates_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  /* ── Handle Download ── */
  const handleDownload = async () => {
    setExporting(true);
    try {
      const candidates = await fetchForExport();
      if (candidates.length === 0) {
        setPopup({ type: "error", message: "No candidates to export." });
        setExporting(false);
        setTimeout(() => setPopup(null), 3000);
        return;
      }
      if (selectedType === "csv") {
        exportCSV(candidates);
      } else {
        exportPDF(candidates);
      }
      setShowExportModal(false);
      // Removed success popup as per user request
    } catch (err) {
      setPopup({ type: "error", message: "Export failed. Please try again." });
    } finally {
      setExporting(false);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <>
      {popup && (
        <ExportPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
      <div className="flex justify-between items-center mb-1 flex-wrap gap-3">

      {/* ── LEFT SIDE ── */}
      <div className="flex gap-2 flex-wrap items-center">

        {sortButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => onSortChange && onSortChange(btn.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
              sortBy === btn.value
                ? "bg-[#01026E] text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}

        <button
          onClick={() => onRefresh && onRefresh()}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="flex items-center bg-white border border-gray-300 hover:border-gray-400 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 px-3 py-2 rounded-lg transition">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="bg-transparent outline-none text-sm w-52 placeholder:text-gray-400"
          />
          {searchTerm ? (
            <button
              onClick={() => onSearchChange && onSearchChange("")}
              className="text-gray-400 hover:text-gray-700 ml-1 text-xs"
            >
              ✕
            </button>
          ) : (
            <Search size={15} className="text-gray-400" />
          )}
        </div>

        {/* Export Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportModal(!showExportModal);
            }}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            <Upload size={15} />
            Export
          </button>

          {showExportModal && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">

              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Select file type
              </h3>

              <div className="flex gap-3 mb-5">
                {/* CSV */}
                <div
                  onClick={() => setSelectedType("csv")}
                  className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition ${
                    selectedType === "csv"
                      ? "border-[#01026E] bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FileText size={16} className="text-green-500" />
                  <span className="text-sm font-medium">CSV</span>
                </div>

                {/* PDF */}
                <div
                  onClick={() => setSelectedType("pdf")}
                  className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer transition ${
                    selectedType === "pdf"
                      ? "border-[#01026E] bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FileText size={16} className="text-red-500" />
                  <span className="text-sm font-medium">PDF</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDownload}
                  disabled={exporting}
                  className="bg-[#01026E] text-white px-5 py-2 rounded-lg text-sm hover:opacity-90 transition flex items-center gap-2 disabled:opacity-60"
                >
                  {exporting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    "Download"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}

export default TableToolbar;
