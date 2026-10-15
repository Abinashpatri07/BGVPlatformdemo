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
    <div className="mt-4 border border-[#D8D8F8] rounded-2xl bg-white p-5 shadow-sm">
      {/* Side-by-Side Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ── LEFT COLUMN: Document Preview ── */}
        <div className="lg:col-span-6 flex flex-col bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Preview Toolbar Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
                <FileText className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate">{docType} Preview</h4>
                <p className="text-[11px] text-slate-500 truncate">{fileName || "Uploaded File"} {size && `(${size} MB)`}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {hasLivePreview && !isPdf && (
                <>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    title="Zoom In"
                    disabled={zoom >= 2.5}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-40"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                    disabled={zoom <= 0.6}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-40"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRotate}
                    title="Rotate 90°"
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </>
              )}
              {hasLivePreview && (
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  title="Expand Fullscreen"
                  className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
              {hasLivePreview && (
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open original file"
                  className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Document Viewer Screen */}
          <div className="relative flex-1 min-h-[380px] max-h-[520px] bg-slate-900/5 overflow-auto flex items-center justify-center p-4">
            {hasLivePreview ? (
              isPdf ? (
                <iframe
                  src={preview.url}
                  title="Document PDF Preview"
                  className="w-full h-full min-h-[360px] rounded-lg border border-slate-200 bg-white shadow-inner"
                />
              ) : (
                <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
                  <img
                    src={preview.url}
                    alt={`${docType} document preview`}
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                    }}
                    className="transition-transform duration-200 max-h-[460px] max-w-full object-contain rounded-lg shadow-md select-none border border-slate-200 bg-white"
                  />
                </div>
              )
            ) : (
              renderDocumentMockup()
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : 'bg-blue-500'}`} />
              {isVerified ? "Verified Document" : isFailed ? "Verification Issue" : "Extracted Document"}
            </span>

            {hasLivePreview && !isPdf && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-500">{Math.round(zoom * 100)}%</span>
                {(zoom !== 1 || rotation !== 0) && (
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="text-[11px] text-indigo-600 hover:underline font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Extracted Fields & Verification ── */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#05058D]">Extracted Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review the OCR-extracted details below. You can verify or make corrections if required.
              </p>
            </div>

            {/* Status Banners */}
            {nameMismatch ? (
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
            ) : isVerified ? (
              <div className="mb-4 flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold text-emerald-800">
                  Government Source Verified • Details match official database
                </p>
              </div>
            ) : null}

            {/* Fields Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {Object.entries(fields).map(([key, value]) => {
                const isNameKey = key === "full_name" || key === "first_name" || key === "last_name";
                const isMismatchField = nameMismatch && isNameKey;

                return (
                  <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
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
          <div className="pt-5 mt-4 border-t border-slate-200 flex items-center justify-between gap-3">
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

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      {isFullscreen && hasLivePreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          {/* Modal Header */}
          <div className="w-full max-w-5xl flex justify-between items-center text-white mb-3 px-2">
            <div>
              <h3 className="text-sm font-bold">{docType} — Full Document View</h3>
              <p className="text-xs text-slate-400">{fileName}</p>
            </div>

            <div className="flex items-center gap-2">
              {!isPdf && (
                <>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                    title="Rotate"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition"
                  >
                    Reset
                  </button>
                </>
              )}
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-white/20 hover:bg-red-600 rounded-lg text-white transition ml-2"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="w-full max-w-5xl h-[82vh] bg-slate-950 rounded-2xl overflow-auto flex items-center justify-center p-4 border border-white/10">
            {isPdf ? (
              <iframe
                src={preview.url}
                title="Full PDF Document"
                className="w-full h-full rounded-xl bg-white"
              />
            ) : (
              <img
                src={preview.url}
                alt={`${docType} full preview`}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-200 rounded select-none"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}