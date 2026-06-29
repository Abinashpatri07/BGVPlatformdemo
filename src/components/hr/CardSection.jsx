import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  CheckCircle,
  XCircle,
  PauseCircle,
  Loader2,
  Maximize2,
} from "lucide-react";

/* ── Card Config ─────────────────────────────── */
const CARD_CONFIG = [
  {
    key: "total",
    label: "Total Candidates",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Loader2,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    key: "verified",
    label: "Verified",
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    key: "onHold",
    label: "On Hold",
    icon: PauseCircle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-400",
  },
];

/* ── Single Card ─────────────────────────────── */
function StatCard({ label, value, icon: Icon, iconBg, iconColor, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between min-h-27.5 flex-1 min-w-37.5">

      {/* TOP: Title + Icon */}
      <div className="flex items-start justify-between gap-2">

        <h3 className="text-sm font-medium text-gray-800 leading-5">
          {label}
        </h3>

        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>

      </div>

      {/* BOTTOM: Number + Maximize */}
      <div className="flex items-end justify-between mt-3">

        {loading ? (
          <div className="h-8 w-12 bg-gray-100 rounded animate-pulse" />
        ) : (
          <h1 className="text-4xl font-bold text-gray-900 leading-none">
            {String(value).padStart(2, "0")}
          </h1>
        )}

        <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
          <Maximize2 className="w-3 h-3 text-gray-500" />
        </button>

      </div>

    </div>
  );
}

/* ── CardSection ─────────────────────────────── */
const CardSection = () => {
  const [counts, setCounts] = useState({
    total: 0,
    inProgress: 0,
    verified: 0,
    onHold: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/candidates/get_all_candidates"
        );

        if (res.data.success) {
          const candidates = res.data.candidates;

          setCounts({
            total:      candidates.length,
            inProgress: candidates.filter((c) => Number(c.case_status) === 0).length,
            verified:   candidates.filter((c) => Number(c.case_status) === 1).length,
            onHold:     candidates.filter((c) => Number(c.case_status) === 5).length,
            rejected:   candidates.filter((c) => Number(c.case_status) === 3).length,
          });
        }
      } catch (err) {
        console.error("CardSection fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {CARD_CONFIG.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={counts[card.key]}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default CardSection;