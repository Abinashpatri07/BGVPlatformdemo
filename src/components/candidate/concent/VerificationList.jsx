import {
  House,
  IdCard,
  BriefcaseBusiness,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import ConsentModal from "./ConsentModal";

const verificationItems = [
  {
    title: "Address",
    description:
      "Your residential address and Aadhaar card information for verification purpose",
    icon: House,
  },
  {
    title: "Identity Documents",
    description:
      "Government-issued ID verification and authentication",
    icon: IdCard,
  },
  {
    title: "Employment History",
    description:
      "Previous employment verification and reference checks",
    icon: BriefcaseBusiness,
  },
  {
    title: "Educational Background",
    description:
      "Degree verification and institutional confirmation",
    icon: GraduationCap,
  },
  {
    title: "Criminal Records",
    description:
      "Criminal background screening",
    icon: ShieldCheck,
  },
];

export default function VerificationList({ onConsentRead }) {
  const [showConsentModal, setShowConsentModal] = useState(false);

  // sessionStorage se read karo taaki wapas aane par bhi yaad rahe
  const [consentRead, setConsentRead] = useState(() => {
    return sessionStorage.getItem("candidate_consentRead") === "true";
  });

  // Parent ko bhi initial value pass karo agar already read tha
  useState(() => {
    if (sessionStorage.getItem("candidate_consentRead") === "true" && onConsentRead) {
      onConsentRead(true);
    }
  });

  const handleAgree = () => {
    setConsentRead(true);
    sessionStorage.setItem("candidate_consentRead", "true");
    if (onConsentRead) onConsentRead(true);
  };

  return (
    <div className="mt-5 space-y-4 max-w-lg mx-auto">

      {/* LIST */}
      {verificationItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-indigo-600" />
            </div>

            <div>
              <h3 className="text-[15px] font-medium text-gray-700">
                {item.title}
              </h3>

              <p className="text-[11px] text-gray-500 mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}

      {/* CONSENT FORM ROW */}
      <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-1.5 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-700">Consent form</span>
          {consentRead && (
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              ✓ Read & Agreed
            </span>
          )}
        </div>
        <button
          onClick={() => setShowConsentModal(true)}
          className="text-indigo-600 text-[13px] font-medium hover:underline"
        >
          {consentRead ? "View Again" : "View"}
        </button>
      </div>

      {showConsentModal && (
        <ConsentModal
          onClose={() => setShowConsentModal(false)}
          onAgree={handleAgree}
        />
      )}

    </div>
  );
}