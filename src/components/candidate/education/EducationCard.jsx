import React from "react";
import {
  Upload,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
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
  inputRef,
  onOpenFile,
  onChangeField,
  onOk,
}) {
  return (
    <div>
      <div className="border border-[#b9b8ff] rounded-xl px-4 py-3 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-[#05058D] font-semibold text-base">{doc}</h3>
          
          {item?.success ? (
            <p className="text-green-600 text-[11px] mt-1">File Uploaded</p>
          ) : (
            <p className="text-gray-400 text-[11px] mt-1">
              Click to add details and upload certificate
            </p>
          )}
        </div>

        <button onClick={onToggle} className="p-2 text-[#05058D] hover:bg-blue-50 rounded-full transition">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border border-[#b9b8ff] rounded-xl mt-3 p-4 bg-gray-50/50">
          <div className="flex flex-col items-center mb-6">
            {item?.success ? (
              <div className="flex flex-col items-center">
                <div className="border border-green-600 text-green-700 bg-green-50 rounded-lg px-4 py-2 text-xs flex items-center gap-2 font-medium">
                  {item.fileName}
                  <button onClick={(e) => {
                    // Quick way to trigger re-upload or clear if needed
                    e.stopPropagation();
                    onOpenFile();
                  }}>
                    <Upload size={14} className="text-blue-700 hover:text-blue-900 ml-2" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">{item.size} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={onOpenFile}
                  className="flex items-center gap-2 bg-white border border-[#05058D] text-[#05058D] px-6 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
                >
                  <Upload size={14} />
                  Upload Certificate
                </button>
                <p className="text-[10px] text-gray-400 mt-2 text-center max-w-[200px]">
                  Supported format PDF, JPG, PNG (Max 5MB)
                </p>
                {item?.error && (
                  <p className="text-red-500 text-[11px] mt-1 flex gap-1 items-center">
                    <AlertCircle size={12} />
                    {item.error}
                  </p>
                )}
              </div>
            )}
            
            <input
              type="file"
              hidden
              ref={inputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={onUpload}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              label="Course" 
              value={item?.fields?.course || ""} 
              onChange={(e) => onChangeField("course", e.target.value)} 
            />
            <Input 
              label="Percentage/CGPA" 
              value={item?.fields?.percentage || ""} 
              onChange={(e) => onChangeField("percentage", e.target.value)} 
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