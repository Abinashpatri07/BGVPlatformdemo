import React from "react";
import {
  Upload,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

function Input({ label, value, type = "text" }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        value={value}
        readOnly
        className="w-full border rounded-md px-3 py-2 text-sm"
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
  inputRef,
  onOpenFile,
  onOk,
}) {
  return (
    <div>
      <div className="border border-[#b9b8ff] rounded-2xl px-5 py-4 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-[#05058D] font-semibold text-lg">{doc}</h3>

          {item?.success ? (
            <p className="text-green-600 text-xs mt-1">Upload Successful</p>
          ) : item?.error ? (
            <p className="text-red-500 text-xs mt-1 flex gap-1 items-center">
              <AlertCircle size={12} />
              {item.error}
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-1">
              Supported format PDF, JPG, PNG, up to 5MB
            </p>
          )}
        </div>

        {item?.success ? (
          <button onClick={onToggle}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        ) : (
          <>
            <button
              onClick={onOpenFile}
              className="flex items-center gap-2 bg-[#05058D] text-white px-5 py-2.5 rounded-xl"
            >
              <Upload size={16} />
              Upload
            </button>

            <input
              type="file"
              hidden
              ref={inputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={onUpload}
            />
          </>
        )}
      </div>

      {isOpen && item?.success && (
        <div className="border border-[#b9b8ff] rounded-2xl mt-4 p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="border border-[#05058D] text-[#05058D] rounded-xl px-4 py-1 text-sm flex items-center gap-2">
              {item.fileName}
              <X size={14} />
            </div>

            <p className="text-xs text-gray-400 mt-2">{item.size} MB</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input label="Institute Name" value={item.fields.institute} />
            <Input label="Degree" value={item.fields.degree} />
            <Input label="Start Date" value={item.fields.startDate} type="date" />
            <Input label="End Date" value={item.fields.endDate} type="date" />
            <Input label="Course" value={item.fields.course} />
            <Input label="Percentage/CGPA" value={item.fields.percentage} />
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
      )}
    </div>
  );
}

export default EducationCard;