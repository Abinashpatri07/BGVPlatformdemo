import { AlignJustify } from "lucide-react";

export default function ManualEntryCard({ onStart }) {
  return (
    <div className="bg-linear-to-br from-white to-[#f9faff] rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col justify-between min-h-105 hover:shadow-lg transition-all">

      <div>
        {/* Icon */}
        <div className="w-14 h-14 bg-linear-to-tr from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
          <AlignJustify size={28} className="text-[#05058D]" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#05058D] mb-2">
          Enter Details Manually
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Fill in your information step-by-step if you prefer to upload your documents manually.
        </p>
      </div>

      <div>
        {/* CTA Button */}
        <button
          onClick={onStart}
          className="w-full bg-linear-to-r bg-[#05058D] text-white text-sm font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-all mt-8"
        >
          Start Manual Entry
        </button>

        {/* Invisible spacer to perfectly align with the DigiLocker card */}
        <p className="text-center text-xs mt-4 invisible">
          Trusted digital verification, powered by{" "}
          <span className="font-medium">DigiLocker</span>
        </p>
      </div>
    </div>
  );
}
