import {
  MoreVertical,
  Mail,
  CheckCircle,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import { candidateTableData } from "../../../components/clientAdmin/data/candidateTableData";

import ActionDropdown from "../candidate/ActionDropdown";
import RejectModal from "../candidate/RejectModal";
import OnHoldModal from "../candidate/OnHoldModal";

// ── ASSIGN VERIFICATION MODAL ─────────────────────────────────────────────────
function AssignVerificationModal({ candidate, onClose, onAssign }) {
  const [success, setSuccess] = useState(false);

  const handleAssign = () => {
    onAssign && onAssign(candidate);
    setSuccess(true);
  };

  // ── SUCCESS STATE ──
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
        <div className="bg-white rounded-3xl w-100 overflow-hidden shadow-2xl text-center">

          {/* GREEN HEADER with concave bowl bottom */}
          <div className="relative bg-green-500" style={{ height: "180px" }}>
            <div
              style={{
                position: "absolute",
                bottom: "-1px",
                left: "-10%",
                width: "120%",
                height: "60px",
                backgroundColor: "white",
                borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ paddingBottom: "30px" }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: "72px",
                  height: "72px",
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderRadius: "18px",
                }}
              >
                <CheckCircle size={42} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-10 pt-2 pb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              "Assigned Successfully"
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              The Candidate Has Been Successfully Assigned<br />
              To A Verifier For The Verification Process.
            </p>
            <button
              onClick={onClose}
              className="border border-green-500 text-green-600 hover:bg-green-50 px-14 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Okay
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── DEFAULT (ASSIGN) STATE ──
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
      <div className="bg-white rounded-3xl w-100 overflow-hidden shadow-2xl text-center">

        {/* BLUE HEADER with concave bowl bottom */}
        <div className="relative bg-blue-500" style={{ height: "180px" }}>
          <div
            style={{
              position: "absolute",
              bottom: "-1px",
              left: "-10%",
              width: "120%",
              height: "60px",
              backgroundColor: "white",
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ paddingBottom: "30px" }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: "72px",
                height: "72px",
                backgroundColor: "rgba(255,255,255,0.25)",
                borderRadius: "18px",
              }}
            >
              <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="9" r="7" fill="white" />
                <path d="M5 28c0-8.284 6.716-13 15-13s15 4.716 15 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="20" cy="35" r="4" fill="white" />
                <path d="M20 39 L20 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-10 pt-2 pb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            "Assign For Verification"
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Assign This Candidate To A Verifier To Initiate<br />
            The Verification Process.
          </p>
          <button
            onClick={handleAssign}
            className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-14 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Assign
          </button>
        </div>

      </div>
    </div>
  );
}

// ── CANDIDATE TABLE ───────────────────────────────────────────────────────────
function CandidateTable() {

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOnHoldModal, setShowOnHoldModal] = useState(false);
  const [onHoldCandidate, setOnHoldCandidate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAssignVerificationModal, setShowAssignVerificationModal] = useState(false);
  const [assignVerificationCandidate, setAssignVerificationCandidate] = useState(null);
  const [showAssignHrModal, setShowAssignHrModal] = useState(false);
  const [assignHrCandidate, setAssignHrCandidate] = useState(null);

  const menuRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideAny = menuRefs.current.some(
        (ref) => ref && ref.contains(event.target)
      );
      if (!clickedInsideAny) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Progress": return "bg-orange-100 text-orange-500";
      case "Verify": return "bg-indigo-100 text-indigo-600";
      case "Verified": return "bg-teal-100 text-teal-600";
      case "Complete": return "bg-green-100 text-green-600";
      case "On Hold": return "bg-yellow-100 text-yellow-600";
      case "Rejected": return "bg-red-100 text-red-500";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(candidateTableData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>

      {/* ── REJECT MODAL ── */}
      {showRejectModal && (
        <RejectModal
          candidate={selectedCandidate}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedCandidate(null);
          }}
        />
      )}

      {/* ── ON HOLD MODAL ── */}
      {showOnHoldModal && (
        <OnHoldModal
          candidate={onHoldCandidate}
          onClose={() => {
            setShowOnHoldModal(false);
            setOnHoldCandidate(null);
          }}
        />
      )}

      {/* ── ASSIGN HR SUCCESS MODAL ── */}
      {showAssignHrModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl w-96 overflow-hidden shadow-2xl text-center">

            {/* INDIGO HEADER */}
            <div className="relative bg-indigo-600 flex items-center justify-center" style={{ height: "170px" }}>
              <div
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: "-10%",
                  width: "120%",
                  height: "50px",
                  backgroundColor: "white",
                  borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                }}
              />
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: "68px",
                  height: "68px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "16px",
                  marginBottom: "20px",
                }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="4" fill="white" />
                  <path d="M2 20c0-4 3-7 7-7h4c4 0 7 3 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M19 8l1.5 1.5L23 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* BODY */}
            <div className="px-8 pt-2 pb-8">
              <h2 className="text-lg font-bold text-indigo-600 mb-2">
                HR Assigned Successfully!
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                <span className="font-semibold text-gray-700">
                  {assignHrCandidate?.name || `${assignHrCandidate?.first_name || ""} ${assignHrCandidate?.last_name || ""}`.trim()}
                </span>
                {" "}has been successfully assigned to an HR for verification.
              </p>
              <button
                onClick={() => {
                  setShowAssignHrModal(false);
                  setAssignHrCandidate(null);
                }}
                className="border border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-10 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
              >
                Okay
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── EMAIL SUCCESS MODAL ── */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
          <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center">

            <div className="relative bg-purple-600 h-40 flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
              <div className="relative z-10 mb-2">
                <Mail size={56} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            <div className="px-8 py-6">
              <h2 className="text-lg font-bold text-purple-600 mb-2">
                Invitation E-Mail Sent Successfully
              </h2>
              <p className="text-sm text-gray-500">
                We've Sent You An Email — Check Your Inbox.
              </p>
              <button
                onClick={() => setShowEmailModal(false)}
                className="mt-6 border border-purple-500 text-purple-600 hover:bg-purple-50 px-8 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Okay
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── FLOATING BULK ACTION BAR ── */}
      {selectedRows.length >= 2 && (

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#02027A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-9999 animate-[fadeIn_.2s_ease-in-out]">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* ICON */}
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">

              <CheckCircle
                size={22}
                className="text-white"
              />

            </div>

            {/* TEXT */}
            <div>

              <p className="text-sm text-indigo-200">

                Selected Candidates

              </p>

              <h3 className="text-lg font-semibold">

                {selectedRows.length} Candidates Selected

              </h3>

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => {

              navigate(
                "/admin/bulk-assign",
                {
                  state: {
                    selectedCandidates:
                      candidateTableData.filter(
                        (item) =>
                          selectedRows.includes(item.id)
                      ),
                  },
                }
              );
            }}
            className="bg-white text-[#02027A] hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-semibold transition"
          >

            Bulk Assign

          </button>

        </div>
      )}

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-sm">
        <table className="w-full border-collapse">

          <thead className="bg-[#FAFAFA] border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === candidateTableData.length &&
                    candidateTableData.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                />
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Candidate ID</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Date</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Name</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Phone</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Assigned HR</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Progress</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Status</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-center w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {candidateTableData.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-all duration-150"
              >

                <td className="px-5 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                    className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                  />
                </td>

                <td className="px-5 py-2.5 text-sm text-gray-700">{item.candidateId}</td>

                <td className="px-5 py-2.5">
                  <div className="text-sm text-gray-700 font-medium">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.created_at ? new Date(item.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""}
                  </div>
                </td>

                <td className="px-5 py-2.5">
                  <div className="font-semibold text-[15px] text-gray-900 leading-5">{item.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.email}</div>
                </td>

                <td className="px-5 py-2.5 text-sm text-gray-700">{item.phone}</td>

                <td className="px-5 py-2.5">
                  {item.assigned_hr ? (
                    <>
                      <div className="text-sm text-gray-800 font-medium">{item.assigned_hr.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.assigned_hr.email}</div>
                    </>
                  ) : null}
                </td>

                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4338CA] rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700">{item.progress}%</span>
                  </div>
                </td>

                <td className="px-5 py-2.5">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${getStatusStyle(item.status)}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-2.5 text-center w-20">
                  <div
                    className="relative inline-block"
                    ref={(el) => (menuRefs.current[index] = el)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === index ? null : index);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <MoreVertical size={18} className="text-gray-500" />
                    </button>

                    {openMenu === index && (
                      <div
                        className={`absolute right-12 w-56 z-9999 ${index >= candidateTableData.length - 3 ? "bottom-10" : "top-10"
                          }`}
                      >
                        <ActionDropdown
                          onView={() => {
                            navigate(`/admin/view/${item.candidateId}`);
                            setOpenMenu(null);
                          }}
                          onEdit={() => {
                            navigate(`/admin/edit-candidate/${item.candidateId}`);
                            setOpenMenu(null);
                          }}
                          onEmail={() => {
                            setShowEmailModal(true);
                            setOpenMenu(null);
                          }}
                          onAssignHr={() => {
                            navigate("/admin/assign-verification");
                            setOpenMenu(null);
                          }}
                          onAuditLog={() => {
                            navigate("/admin/audit-log");
                            setOpenMenu(null);
                          }}
                          onAssignVerification={() => {
                            setAssignVerificationCandidate(item);
                            setShowAssignVerificationModal(true);
                            setOpenMenu(null);
                          }}
                          onHold={() => {
                            setOnHoldCandidate(item);
                            setShowOnHoldModal(true);
                            setOpenMenu(null);
                          }}
                          onReject={() => {
                            setSelectedCandidate(item);
                            setShowRejectModal(true);
                            setOpenMenu(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </>
  );
}

export default CandidateTable;