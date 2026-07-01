import React from "react";
import { Upload, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function UploadCard({
  doc,
  uploaded,
  isUploading,
  open,
  verificationState,
  onUpload,
  onToggle,
}) {
  return (
    <div className="bg-white border border-[#D8D8F8] rounded-2xl shadow-md px-5 py-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[18px] font-semibold text-[#05058D] flex items-center gap-2">
            {doc}
            {uploaded && verificationState?.status !== "failed" && <CheckCircle2 size={18} className="text-green-600" />}
            {uploaded && verificationState?.status === "failed" && <XCircle size={18} className="text-red-500" />}
          </h3>

          {!uploaded ? (
            <p className="text-xs text-gray-500 mt-1">
              Supported format PDF, JPG, PNG, up to 5MB
            </p>
          ) : (
            <p className={`text-xs mt-1 flex items-center gap-1 ${verificationState?.status === "failed" ? "text-red-500" : "text-green-600"}`}>
              {verificationState?.status === "failed" ? "Verification failed" : "Upload successful"}
            </p>
          )}
        </div>

        {!uploaded ? (
          isUploading ? (
            <div className="bg-[#05058D] opacity-80 text-white h-11 px-6 rounded-xl flex items-center gap-2 text-sm cursor-not-allowed">
              <Loader2 size={18} className="animate-spin" />
              Extracting...
            </div>
          ) : (
            <label className="bg-[#05058D] text-white h-11 px-6 rounded-xl flex items-center gap-2 cursor-pointer text-sm">
              <Upload size={18} />
              Upload
              <input
                hidden
                type="file"
                onChange={onUpload}
              />
            </label>
          )
        ) : (
          <button onClick={onToggle}>
            {open ? (
              <ChevronUp size={26} />
            ) : (
              <ChevronDown size={26} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}