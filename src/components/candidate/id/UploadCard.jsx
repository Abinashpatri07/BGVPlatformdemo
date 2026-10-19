import { Upload, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function UploadCard({
  doc,
  uploaded,
  isUploading,
  open,
  verificationState,
  nameMismatch,
  onUpload,
  onToggle,
}) {
  const isFailed = verificationState?.status === "failed" || !!nameMismatch;
  const isSuccess = uploaded && !isFailed && verificationState?.status === "success";

  return (
    <div className="bg-white border border-[#D8D8F8] rounded-xl shadow-sm px-4 py-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-[#05058D] flex items-center gap-2">
            {doc}
            {isSuccess && <CheckCircle2 size={16} className="text-green-600" />}
            {uploaded && isFailed && <XCircle size={16} className="text-red-500" />}
            {uploaded && !isSuccess && !isFailed && <CheckCircle2 size={16} className="text-green-600" />}
          </h3>

          {!uploaded ? (
            <p className="text-[11px] text-gray-500 mt-0.5">
              Supported format PDF, JPG, PNG, up to 5MB
            </p>
          ) : isFailed ? (
            <p className="text-[11px] mt-0.5 flex items-center gap-1 text-red-500 font-medium">
              {nameMismatch ? "Name mismatch detected" : "Verification failed"}
            </p>
          ) : (
            <p className="text-[11px] mt-0.5 flex items-center gap-1 text-green-600">
              Uploaded successfully
            </p>
          )}
        </div>

        {!uploaded ? (
          isUploading ? (
            <div className="bg-[#05058D] opacity-80 text-white h-9 px-4 rounded-lg flex items-center gap-2 text-[13px] cursor-not-allowed">
              <Loader2 size={16} className="animate-spin" />
              Extracting...
            </div>
          ) : (
            <label className="bg-[#05058D] text-white h-9 px-4 rounded-lg flex items-center gap-2 cursor-pointer text-[13px]">
              <Upload size={16} />
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