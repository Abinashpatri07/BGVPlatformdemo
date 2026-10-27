import { Download, Plus, UserPlus, Users, FileText, Loader2, CheckCircle, XCircle } from "lucide-react";

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
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProfileHeader = ({ showExport, showAddCandidate }) => {
  const navigate = useNavigate();

  /* EXPORT DROPDOWN */
  const [openExport, setOpenExport] = useState(false);
  const [selectedType, setSelectedType] = useState("csv");
  const [exporting, setExporting] = useState(false);
  const [popup, setPopup] = useState(null);

  /* ── Fetch candidates ── */
  const fetchForExport = async () => {
    const res = await axiosInstance.get(
      "/api/candidates/get_all_candidates"
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
      c.cand_id, c.case_id, c.first_name, c.last_name,
      c.email, c.phone, c.job_function || "", c.tag || "",
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
    doc.setFontSize(16);
    doc.setTextColor(1, 2, 110);
    doc.text("BGV Platform — Candidate List", 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Exported: ${new Date().toLocaleString("en-IN")}`, 14, 25);
    doc.text(`Total Records: ${candidates.length}`, 14, 30);
    const tableRows = candidates.map((c) => [
      c.cand_id, c.case_id,
      `${c.first_name} ${c.last_name}`,
      c.email, c.phone,
      c.job_function || "-", c.tag || "-",
      getStatusLabel(c.case_status),
    ]);
    autoTable(doc, {
      startY: 35,
      head: [["ID", "Case ID", "Name", "Email", "Phone", "Function", "Tag", "Status"]],
      body: tableRows,
      headStyles: { fillColor: [1, 2, 110], textColor: 255, fontStyle: "bold", fontSize: 8 },
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
      if (selectedType === "csv") exportCSV(candidates);
      else exportPDF(candidates);
      setOpenExport(false);
      // Removed success popup as per user request
    } catch (err) {
      setPopup({ type: "error", message: "Export failed. Please try again." });
    } finally {
      setExporting(false);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  /* ADD CANDIDATE DROPDOWN */
  const [openCandidateDropdown, setOpenCandidateDropdown] = useState(false);

  const exportRef = useRef();
  const candidateRef = useRef();

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setOpenExport(false);
      }
      if (candidateRef.current && !candidateRef.current.contains(e.target)) {
        setOpenCandidateDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const hrName = storedUser.name || storedUser.first_name || "HR";

  return (
    <>
      {popup && (
        <ExportPopup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    <div className="flex justify-between items-center mb-4">
      {/* LEFT SECTION */}
      <div>
        <h1 className="text-[24px] font-bold text-black leading-tight">
          Welcome Back {hrName} 👋🏻
        </h1>
        <p className="text-[14px] text-gray-600 mt-0.5">
          Let's Customize Your Workspace
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 relative">
        {/* ADD CANDIDATE BUTTON + DROPDOWN */}
        {showAddCandidate && (
          <div className="relative" ref={candidateRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenCandidateDropdown(!openCandidateDropdown);
              }}
              className="flex items-center gap-2 bg-[#02027A] hover:bg-[#00005E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Plus size={18} />
              Add Candidate
            </button>

            {/* DROPDOWN */}
            {openCandidateDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                {/* ADD SINGLE */}
                <button
                  onClick={() => {
                    setOpenCandidateDropdown(false);
                    navigate("/hr/create-candidate");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-[#02027A] transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <UserPlus size={15} className="text-[#02027A]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Add Single</p>
                  </div>
                </button>

                <div className="mx-3 border-t border-gray-100" />

                {/* ADD IN BULK */}
                <button
                  onClick={() => {
                    setOpenCandidateDropdown(false);
                    navigate("/hr/bulk-upload");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-[#02027A] transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Users size={15} className="text-[#02027A]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Add in Bulk</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* EXPORT DROPDOWN */}
        {showExport && (
          <div className="relative" ref={exportRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenExport(!openExport);
              }}
              className="flex items-center gap-2 border border-[#02027A] text-[#02027A] hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Download size={18} />
              Export
            </button>

            {/* EXPORT MODAL */}
            {openExport && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] z-50 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">
                  Select file type
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {/* PDF */}
                  <div
                    onClick={() => setSelectedType("pdf")}
                    className={`flex flex-col items-center justify-center gap-2 border rounded-xl px-3 py-4 cursor-pointer transition-all ${
                      selectedType === "pdf"
                        ? "border-[#01026E] bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={22} className="text-red-500" />
                    <span className="text-xs font-medium text-gray-700">PDF</span>
                  </div>

                  {/* CSV */}
                  <div
                    onClick={() => setSelectedType("csv")}
                    className={`flex flex-col items-center justify-center gap-2 border rounded-xl px-3 py-4 cursor-pointer transition-all ${
                      selectedType === "csv"
                        ? "border-[#01026E] bg-indigo-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={22} className="text-emerald-500" />
                    <span className="text-xs font-medium text-gray-700">CSV</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleDownload}
                    disabled={exporting}
                    className="bg-[#01026E] hover:bg-[#00005E] text-white px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-60"
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
        )}
      </div>
    </div>
    </>
  );
};

export default ProfileHeader;
