import {
  MoreVertical,
  Mail,
  CheckCircle,
  Loader2,
  Users,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

// ── LIVE API INTEGRATION ──
import axiosInstance from "../../API/axiosInstance";

import ActionDropdown from "../../components/hr/ActionDropdown";
import RejectModal from "../clientAdmin/candidate/RejectModal";
import OnHoldModal from "../clientAdmin/candidate/OnHoldModal";
import RemoveHoldModal from "../clientAdmin/candidate/RemoveHoldModal";

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
function TableSection({ searchTerm = "", sortBy = "all", page = 1, onTotalPagesChange }) {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOnHoldModal, setShowOnHoldModal] = useState(false);
  const [onHoldCandidate, setOnHoldCandidate] = useState(null);
  const [showRemoveHoldModal, setShowRemoveHoldModal] = useState(false);
  const [removeHoldCandidate, setRemoveHoldCandidate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAssignVerificationModal, setShowAssignVerificationModal] = useState(false);
  const [assignVerificationCandidate, setAssignVerificationCandidate] = useState(null);

  const menuRefs = useRef([]);

  // ── LIVE API ──
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setFetchError("");
      const response = await axiosInstance.get(
        "/api/candidates/get_all_candidates?page=${page}&limit=10"
      );
      if (response.data.success) {
        setCandidates(response.data.candidates);
        if (onTotalPagesChange && response.data.pagination) {
          onTotalPagesChange(response.data.pagination.totalPages);
        }
      }
    } catch (error) {
      setFetchError("Failed to load candidates. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page]);

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

  // ── STATUS LABEL from case_status number ──
  const getStatusLabel = (status) => {
    switch (Number(status)) {
      case 0: return "In Progress";
      case 1: return "Verified";
      case 2: return "Verify";
      case 3: return "Rejected";
      case 4: return "Complete";
      case 5: return "On Hold";
      default: return "In Progress";
    }
  };

  const getStatusStyle = (label) => {
    switch (label) {
      case "In Progress":  return "bg-orange-100 text-orange-500";
      case "Verify":       return "bg-indigo-100 text-indigo-600";
      case "Verified":     return "bg-teal-100 text-teal-600";
      case "Complete":     return "bg-green-100 text-green-600";
      case "On Hold":      return "bg-yellow-100 text-yellow-600";
      case "Rejected":     return "bg-red-100 text-red-500";
      default:             return "bg-gray-100 text-gray-500";
    }
  };

  // ── FILTER + SORT candidates ──
  const filteredCandidates = candidates
    .filter((c) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      return (
        fullName.includes(term) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term)) ||
        (c.case_id && c.case_id.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return `${a.first_name} ${a.last_name}`
          .localeCompare(`${b.first_name} ${b.last_name}`);
      }
      if (sortBy === "date") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(candidates.map((item) => item.cand_id));
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
          onSuccess={() => {
            fetchCandidates();
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
          onSuccess={() => {
            fetchCandidates();
          }}
        />
      )}

      {/* ── REMOVE HOLD MODAL ── */}
      {showRemoveHoldModal && (
        <RemoveHoldModal
          candidate={removeHoldCandidate}
          onClose={() => {
            setShowRemoveHoldModal(false);
            setRemoveHoldCandidate(null);
          }}
          onSuccess={() => {
            fetchCandidates();
          }}
        />
      )}


      {/* ── EMAIL SUCCESS MODAL ── */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl w-120 overflow-hidden shadow-xl text-center">

            <div className="relative bg-purple-600 h-40 flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[50%]" />
              <div className="relative z-10 mb-2">
                <Mail size={56} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            <div className="px-8 py-6">
              <h2 className="text-lg font-bold text-purple-600 mb-2">
                E-Mail has been Sent Successfully
              </h2>
              {/* <p className="text-sm text-gray-500">
                We've Sent You An Email — Check Your Inbox.
              </p> */}
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

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#FAFAFA] border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === candidates.length &&
                    candidates.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                />
              </th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Candidate ID</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Date</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Name</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Phone</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Function / Tag</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-left">Status</th>
              <th className="px-5 py-4 text-sm font-semibold text-[#1F2937] text-center w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={36} className="text-[#4338CA] animate-spin" />
                    <p className="text-sm text-gray-400">Loading candidates...</p>
                  </div>
                </td>
              </tr>
            ) : fetchError ? (
              <tr>
                <td colSpan="8">
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <p className="text-sm text-red-500">{fetchError}</p>
                  </div>
                </td>
              </tr>
            ) : filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Users size={40} className="text-gray-300" />
                    <p className="text-sm text-gray-400">
                      {searchTerm
                        ? `No results for "${searchTerm}"`
                        : "No candidates found. Add one to get started!"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCandidates.map((item, index) => {
                const statusLabel = getStatusLabel(item.case_status);
                return (
              <tr
                key={item.cand_id}
                className="border-b border-gray-100 hover:bg-[#FAFAFA] transition-all duration-150"
              >

                <td className="px-5 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.cand_id)}
                    onChange={() => handleRowSelect(item.cand_id)}
                    className="w-4 h-4 accent-[#4338CA] cursor-pointer"
                  />
                </td>

                <td className="px-5 py-2.5 text-sm text-gray-700 font-mono">{item.case_id}</td>

                <td className="px-5 py-2.5">
                  <div className="text-sm text-gray-700 font-medium">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.created_at ? new Date(item.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""}
                  </div>
                </td>

                <td className="px-5 py-2.5">
                  <div className="font-semibold text-[15px] text-gray-900 leading-5">
                    {item.first_name} {item.last_name}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.email}</div>
                </td>

                <td className="px-5 py-2.5 text-sm text-gray-700">{item.phone}</td>

                <td className="px-5 py-2.5">
                  <div className="text-sm text-gray-800 font-medium">
                    {item.job_function || <span className="text-gray-300">—</span>}
                  </div>
                  {item.tag && (
                    <div className="text-xs text-gray-400 mt-0.5">{item.tag}</div>
                  )}
                </td>

                <td className="px-5 py-2.5">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${getStatusStyle(statusLabel)}`}
                  >
                    {statusLabel}
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
                        className={`absolute right-12 w-56 z-[9999] ${
                          index >= candidates.length - 3 ? "bottom-10" : "top-10"
                        }`}
                      >
                        <ActionDropdown
                          candidateStatus={statusLabel}
                          onView={() => {
                            navigate(`/hr/view/${item.cand_id}`);
                            setOpenMenu(null);
                          }}
                          onEdit={() => {
                            navigate(`/hr/edit-candidate/${item.cand_id}`);
                            setOpenMenu(null);
                          }}
                          onEmail={() => {
                            setShowEmailModal(true);
                            setOpenMenu(null);
                          }}
                          onHold={() => {
                            setOnHoldCandidate(item);
                            setShowOnHoldModal(true);
                            setOpenMenu(null);
                          }}
                          onRemoveHold={() => {
                            setRemoveHoldCandidate(item);
                            setShowRemoveHoldModal(true);
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
              );
            })
          )}
          </tbody>

        </table>
      </div>

    </>
  );
}

export default TableSection;