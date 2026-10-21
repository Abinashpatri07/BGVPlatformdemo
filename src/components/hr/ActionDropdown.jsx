import {
  Eye,
  Pencil,
  Mail,
  PauseCircle,
  XCircle,
} from "lucide-react";

function ActionDropdown({
  onView,
  onEdit,
  onEmail,
  onHold,
  onRemoveHold,
  onReject,
  candidateStatus,
}) {

  // HANDLE CLICK — stop propagation + call callback
  const handleClick = (callback) => (e) => {
    e.stopPropagation();
    if (callback) callback();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-56 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 py-2"
    >

      {/* VIEW */}
      <button
        onClick={handleClick(onView)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition"
      >
        <Eye size={16} />
        View
      </button>

      {/* EDIT */}
      <button
        onClick={handleClick(onEdit)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition"
      >
        <Pencil size={16} />
        Edit
      </button>

      {/* SEND EMAIL */}
      <button
        onClick={handleClick(onEmail)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition"
      >
        <Mail size={16} className="text-blue-500" />
        Send Email
      </button>

      {/* ON HOLD */}
      {candidateStatus !== "Rejected" && candidateStatus !== "On Hold" && (
        <button
          onClick={handleClick(onHold)}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 text-sm text-yellow-600 transition"
        >
          <PauseCircle size={16} />
          On Hold
        </button>
      )}

      {/* REMOVE HOLD */}
      {candidateStatus === "On Hold" && (
        <button
          onClick={handleClick(onRemoveHold)}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 text-sm text-green-600 transition"
        >
          <PauseCircle size={16} />
          Remove Hold
        </button>
      )}

      {/* REJECT */}
      {candidateStatus !== "Verified" && candidateStatus !== "Rejected" && (
        <button
          onClick={handleClick(onReject)}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm text-red-500 transition"
        >
          <XCircle size={16} />
          Reject
        </button>
      )}

    </div>
  );
}

export default ActionDropdown;