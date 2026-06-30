import React from "react";
import { X } from "lucide-react";

export default function DocumentFields({
  fileName,
  size,
  fields,
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
                className="w-full h-10 border rounded px-3 text-sm"
              />

              <span className="absolute right-2 top-3 text-[10px] text-green-600">
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>

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