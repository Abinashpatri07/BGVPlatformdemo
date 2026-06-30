import { X } from "lucide-react";

export default function ConsentModal({ onClose }) {
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

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end bg-gray-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
