import React from "react";
import {
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
} from "lucide-react";

function Input({ label, value, type = "text", onChange }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-1.5 text-xs outline-none focus:border-[#05058D]"
      />
    </div>
  );
}

function EducationCard({
  doc,
  item,
  isOpen,
  onToggle,
  onUpload,
  onUploadMarksheet,
  inputRef,
  onOpenFile,
  onChangeField,
  onOk,
}) {
  return (
    <div>
      {/* Header row */}
      <div className="border border-[#b9b8ff] rounded-xl px-4 py-3 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-[#05058D] font-semibold text-base">{doc}</h3>

          {item?.success ? (
            <p className="text-green-600 text-[11px] mt-1">Details Added</p>
          ) : (
            <p className="text-gray-400 text-[11px] mt-1">
              Click to add details and upload certificate
            </p>
          )}
        </div>

        <button
          onClick={onToggle}
          className="p-2 text-[#05058D] hover:bg-blue-50 rounded-full transition"
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded panel */}
      {isOpen && (
        <div className="border border-[#b9b8ff] rounded-xl mt-3 p-5 bg-gray-50/50">

          {/* Education Fields */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <Input
              label="Institute Name"
              value={item?.fields?.institute || ""}
              onChange={(e) => onChangeField("institute", e.target.value)}
            />
            <Input
              label="Degree"
              value={item?.fields?.degree || doc}
              onChange={(e) => onChangeField("degree", e.target.value)}
            />
            <Input
              label="Start Date"
              value={item?.fields?.startDate || ""}
              type="date"
              onChange={(e) => onChangeField("startDate", e.target.value)}
            />
            <Input
              label="End Date"
              value={item?.fields?.endDate || ""}
              type="date"
              onChange={(e) => onChangeField("endDate", e.target.value)}
            />
            <Input
              label="Course / Specialization"
              value={item?.fields?.course || ""}
              onChange={(e) => onChangeField("course", e.target.value)}
            />
            <Input
              label="Percentage / CGPA"
              value={item?.fields?.percentage || ""}
              onChange={(e) => onChangeField("percentage", e.target.value)}
            />
          </div>

          {/* Documents Upload Section (Certificate & Marksheet) */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Upload Supporting Documents
            </h4>

            {/* 1. Degree / Passing Certificate */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Degree / Passing Certificate <span className="text-red-500">*</span>
              </p>

              {item?.fileObject || item?.existingFileUrl ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-fit">
                  <FileText size={14} className="text-green-600 shrink-0" />
                  <span className="text-xs text-green-800 font-medium truncate max-w-[220px]">
                    {item?.fileName || "Existing Certificate"}
                  </span>
                  {item?.size && (
                    <span className="text-[10px] text-gray-400 ml-1">
                      {item.size} MB
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFile && onOpenFile();
                    }}
                    title="Re-upload certificate"
                    className="ml-1 text-[#05058D] hover:text-blue-800 transition"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg py-4 cursor-pointer hover:border-[#05058D] hover:bg-blue-50/40 transition">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    Click to upload Certificate
                  </span>
                  <span className="text-[10px] text-gray-400">
                    PDF, JPG, PNG — Max 5 MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={onUpload}
                  />
                </label>
              )}
            </div>

            {/* 2. Final Marksheet */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Final Marksheet <span className="text-xs font-normal text-gray-400">(Optional / Recommended)</span>
              </p>

              {item?.marksheetFileObject || item?.existingMarksheetUrl ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-fit">
                  <FileText size={14} className="text-green-600 shrink-0" />
                  <span className="text-xs text-green-800 font-medium truncate max-w-[220px]">
                    {item?.marksheetFileName || "Existing Marksheet"}
                  </span>
                  {item?.marksheetSize && (
                    <span className="text-[10px] text-gray-400 ml-1">
                      {item.marksheetSize} MB
                    </span>
                  )}
                  <label className="ml-1 text-[#05058D] hover:text-blue-800 transition cursor-pointer">
                    <RotateCcw size={13} />
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => onUploadMarksheet && onUploadMarksheet(e)}
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-lg py-4 cursor-pointer hover:border-[#05058D] hover:bg-blue-50/40 transition">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    Click to upload Marksheet
                  </span>
                  <span className="text-[10px] text-gray-400">
                    PDF, JPG, PNG — Max 5 MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => onUploadMarksheet && onUploadMarksheet(e)}
                  />
                </label>
              )}
            </div>

            {item?.error && (
              <p className="text-red-500 text-[11px] mt-1.5 flex gap-1 items-center">
                <AlertCircle size={12} /> {item.error}
              </p>
            )}

            {/* Hidden input for re-upload via icon click */}
            <input
              type="file"
              hidden
              ref={inputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={onUpload}
            />
          </div>

          {/* OK Button */}
          {onOk && (
            <div className="flex justify-center mt-5">
              <button
                onClick={onOk}
                className="w-24 h-8 rounded-lg bg-[#05058D] text-white text-xs hover:bg-blue-800 transition"
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EducationCard;