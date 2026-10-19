import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Trash2,
  Check,
  CreditCard,
  Building,
  Calendar,
  User,
  Hash
} from "lucide-react";

export default function DocumentFields({
  docType,
  fileName,
  size,
  fields = {},
  preview,
  verificationState,
  nameMismatch,
  onChangeField,
  onRemove,
  onOk,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isFailed = verificationState?.status === "failed" || !!nameMismatch;
  const isVerified = !isFailed && verificationState?.status === "success";

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.6));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

  const isPdf = preview?.type === "application/pdf" || fileName?.toLowerCase().endsWith(".pdf");
  const hasLivePreview = !!preview?.url;

  // Render realistic ID card mockup when no live image file is available
  const renderDocumentMockup = () => {
    const fullName = fields.full_name || `${fields.first_name || ""} ${fields.last_name || ""}`.trim() || "CANDIDATE NAME";
    const idNumber = fields.pan_number || fields.driving_licence_number || fields.voter_id_number || fields.passport_number || "XXXXXXXXXX";
    const dob = fields.date_of_birth || "DD/MM/YYYY";

    return (
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-slate-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative select-none">
        {/* Holographic Watermark Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        {/* Card Header */}
        <div className="flex justify-between items-start border-b border-white/15 pb-3 mb-4 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-semibold">Government of India</p>
            <h4 className="text-sm font-bold tracking-tight text-white">{docType.toUpperCase()}</h4>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <CreditCard className="w-4 h-4 text-indigo-300" />
          </div>
        </div>

        {/* Card Body */}
        <div className="flex gap-4 items-center mb-4 relative z-10">
          {/* Photo Box */}
          <div className="w-20 h-24 rounded-lg bg-slate-800 border-2 border-indigo-400/40 flex flex-col items-center justify-center text-slate-400 shrink-0 shadow-inner">
            <User className="w-8 h-8 text-indigo-200/60 mb-1" />
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Photo</span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1.5 min-w-0">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder Name</p>
              <p className="text-xs font-semibold text-white truncate">{fullName}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">Document Number</p>
              <p className="text-xs font-mono font-bold text-amber-300 tracking-wider truncate">{idNumber}</p>
            </div>
            <div className="flex gap-3">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-slate-400">DOB</p>
                <p className="text-[10px] text-slate-200">{dob}</p>
              </div>
              {fields.gender && (
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-slate-400">Gender</p>
                  <p className="text-[10px] text-slate-200">{fields.gender}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-white/10 pt-2 flex justify-between items-center text-[9px] text-slate-400 relative z-10">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3 h-3" /> OCR Verified
          </span>
          <span className="font-mono text-[9px] text-slate-400">{fileName}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 border border-[#D8D8F8] rounded-2xl bg-white p-6 shadow-sm">
      <div className="w-full flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#05058D]">Extracted Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review the extracted details below. You can verify or make corrections if required.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Uploaded Successfully
            </span>
          </div>

          {/* Status Banners */}
          {nameMismatch && (
            <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700">Name Mismatch Detected</p>
                <p className="text-[11px] text-red-600 mt-0.5 leading-relaxed">
                  The name on this document does not match your registered candidate profile name. 
                  Please re-upload a document that has your matching name to proceed.
                </p>
              </div>
            </div>
          )}

          {/* Fields Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
            {Object.entries(fields).map(([key, value]) => {
              const isNameKey = key === "full_name" || key === "first_name" || key === "last_name";
              const isMismatchField = nameMismatch && isNameKey;

              return (
                <div key={key} className={key === "address" ? "sm:col-span-2 lg:col-span-3" : ""}>
                  <label className="text-xs font-medium text-slate-600 block mb-1 capitalize">
                    {key.replaceAll("_", " ")}
                  </label>
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChangeField && onChangeField(key, e.target.value)}
                    readOnly={!onChangeField}
                    className={`w-full h-9 border rounded-lg px-3 text-xs transition focus:outline-none ${
                      isMismatchField
                        ? "border-red-400 bg-red-50/50 text-red-900 focus:ring-1 focus:ring-red-400"
                        : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-5 mt-6 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove / Re-upload
          </button>

          {onOk && (
            <button
              type="button"
              onClick={nameMismatch ? undefined : onOk}
              disabled={nameMismatch}
              title={nameMismatch ? "Please resolve name mismatch to proceed" : ""}
              className={`flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm ${
                nameMismatch
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-[#05058D] hover:bg-blue-800 active:scale-95"
              }`}
            >
              <Check className="w-4 h-4" />
              Confirm & Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}