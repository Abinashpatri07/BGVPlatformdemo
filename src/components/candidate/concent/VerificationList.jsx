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

export default function VerificationList() {
  const [showConsentModal, setShowConsentModal] = useState(false);

  return (
    <div className="mt-6 space-y-6">

      {/* LIST */}
      {verificationItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <div key={index} className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Icon size={20} className="text-indigo-600" />
            </div>

            <div>
              <h3 className="text-[18px] font-medium text-gray-700">
                {item.title}
              </h3>

              <p className="text-xs text-gray-600 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}

      {/* CONSENT FORM ROW */}
      <div className="flex items-center justify-between border rounded-lg px-4 py-2 max-w-md">
        <span className="text-sm text-gray-700">Consent form</span>
        <button 
          onClick={() => setShowConsentModal(true)}
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          View
        </button>
      </div>

      {showConsentModal && (
        <ConsentModal onClose={() => setShowConsentModal(false)} />
      )}

    </div>
  );
}