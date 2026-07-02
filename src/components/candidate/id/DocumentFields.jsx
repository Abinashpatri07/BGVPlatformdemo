import React from "react";
import { X } from "lucide-react";

export default function DocumentFields({
  docType,
  fileName,
  size,
  fields,
  verificationState,
  onRemove,
  onOk,
}) {
  return (
    <div className="mt-4 border border-[#D8D8F8] rounded-2xl px-6 py-6">
      {/* File Chip */}
      <div className="flex flex-col items-center mb-6">
        <div className="border border-[#6E72E8] px-4 py-2 rounded-xl flex items-center gap-3 text-sm text-[#05058D]">
          {fileName}
          <X
            size={16}
            className="cursor-pointer"
            onClick={onRemove}
          />
        </div>

        <span className="text-xs text-gray-500 mt-2">
          {size} MB
        </span>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {Object.entries(fields).map(([key, value]) => (
          <div key={key}>
            <label className="text-[14px] block mb-1 capitalize">
              {key.replaceAll("_", " ")}
            </label>

            <div className="relative">
              <input
                value={value}
                readOnly
                className="w-full h-10 border rounded px-3 text-sm bg-gray-50"
              />

              {(
                (docType === "PAN card" && key === "pan_number") ||
                (docType === "Driving license" && key === "driving_licence_number") ||
                (docType === "Voter ID" && key === "voter_id_number") ||
                (docType === "Passport" && key === "passport_number")
              ) ? (
                <span className="absolute right-2 top-3 text-[10px] font-medium">
                  {verificationState?.status === "verifying" && <span className="text-blue-500 animate-pulse">Verifying...</span>}
                  {verificationState?.status === "success" && <span className="text-green-600">✔ Verified</span>}
                  {verificationState?.status === "failed" && <span className="text-red-500">❌ Failed</span>}
                </span>
              ) : (
                <span className="absolute right-2 top-3 text-[10px] font-medium">
                  {verificationState?.status === "success" && <span className="text-green-600">✔ Verified</span>}
                  {verificationState?.status === "failed" && <span className="text-red-500">❌ Failed</span>}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Show registered name if verify success and name exists */}
      {verificationState?.status === "success" && verificationState?.registeredName && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <strong>Govt Registered Name:</strong> {verificationState.registeredName}
        </div>
      )}

      {/* OK Button */}
      {onOk && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onOk}
            className="w-28 h-10 rounded-xl bg-[#05058D] text-white text-sm hover:bg-blue-800 transition"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}