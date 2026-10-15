import { X } from "lucide-react";
import { useState } from "react";

export default function ConsentModal({ onClose, onAgree }) {
  const [modalChecked, setModalChecked] = useState(false);

  const handleAgree = () => {
    if (!modalChecked) return;
    if (onAgree) onAgree();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Background Verification Consent</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto text-sm text-gray-600 space-y-4">
          <p>
            I hereby authorize and give my voluntary consent to <strong>[Company Name]</strong> or any of its authorized third-party background verification agencies to verify my background information.
          </p>
          <p>
            This verification may include, but is not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Educational qualifications and degrees from institutions</li>
            <li>Employment history, including dates of employment, positions held, and reasons for leaving</li>
            <li>Criminal record checks across various jurisdictions</li>
            <li>Identity and address verification</li>
            <li>Professional references</li>
          </ul>
          <p>
            I understand that the information gathered will be kept confidential and will only be used for the purpose of evaluating my suitability for employment or continued employment.
          </p>
          <p>
            I certify that the information provided by me in my application/resume and during the interview process is true, complete, and correct to the best of my knowledge. I understand that any false statements or material omissions may be grounds for rejection of my application or immediate termination of my employment if already employed.
          </p>
          <p>
            I release the Company, its authorized agents, and any person or entity providing information from any liability or damage which may result from providing the requested information.
          </p>
        </div>

        {/* Checkbox + Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl space-y-3">
          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={modalChecked}
              onChange={(e) => setModalChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-indigo-600 shrink-0"
            />
            <span className="text-sm text-gray-700 leading-snug">
              I have read and understood the above consent form and agree to authorize background verification of my information.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAgree}
              disabled={!modalChecked}
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition ${
                modalChecked
                  ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-70"
              }`}
            >
              I Agree & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
