import React, { useState } from "react";
import {
  MapPin,
  Home,
  Eye,
  Trash2,
  CloudUpload,
  CheckCircle2,
  FileBadge,
  CheckSquare,
  MessageSquare,
  Mic,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddressDetails() {
  const [decision, setDecision] = useState("Verified");
  const [gpsVerified, setGpsVerified] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 animate-fade-in pb-10 px-4">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 border-b border-indigo-100 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
          <MapPin size={24} />
        </div>
        <h1 className="text-2xl font-bold text-indigo-900">
          Address Details
        </h1>
      </div>

      <div className="space-y-8 mt-6">
        {/* Present Address */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Details */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">
                  Present Address
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Flat/House</p>
                  <p className="text-sm font-semibold text-gray-900">Suite 404, Magar Layout, Blankie Road</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Landmark Specified</p>
                  <p className="text-sm font-semibold text-gray-900">Opposite Bio-Diversity Park</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">City</p>
                  <p className="text-sm font-semibold text-gray-900">Bangalore</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">PIN Code</p>
                  <p className="text-sm font-semibold text-gray-900">453218</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">State</p>
                  <p className="text-sm font-semibold text-gray-900">Karnataka</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Residence Since</p>
                  <p className="text-sm font-semibold text-gray-900">September 2021<br/><span className="text-xs font-normal text-gray-600">(Approx 5 Yrs)</span></p>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Upload Verification Evidence
              </h3>
              <div className="space-y-4">
                {/* Doc 1 - Uploaded */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Property Entrance Front Gate</p>
                      <p className="text-xs text-gray-400">gachibowli_entrance_gps.jpg • 2.4 MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        <Eye size={18} />
                      </button>
                      <button className="text-red-300 hover:text-red-500 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Doc 2 */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                    <FileBadge size={16} />
                  </div>
                  <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white flex items-center justify-between hover:bg-indigo-50/30 transition cursor-pointer group">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Candidate Standing Outside Property</p>
                      <p className="text-xs text-gray-400">Supported formats: CSV, XLSX</p>
                    </div>
                    <CloudUpload size={22} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Details */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
                  <Home size={20} />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">
                  Permanent Address
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Flat/House</p>
                  <p className="text-sm font-semibold text-gray-900">Flat No. 12, Shanti Kunj Apartments</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Landmark Specified</p>
                  <p className="text-sm font-semibold text-gray-900">Opposite Bio-Diversity Park</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">City</p>
                  <p className="text-sm font-semibold text-gray-900">Bhubaneswar</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">PIN Code</p>
                  <p className="text-sm font-semibold text-gray-900">453218</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">State</p>
                  <p className="text-sm font-semibold text-gray-900">Odisha</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Residence Since</p>
                  <p className="text-sm font-semibold text-gray-900">Life Long Ancestral<br/>Residence</p>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Upload Verification Evidence
              </h3>
              <div className="space-y-4">
                {/* Doc 1 - Uploaded */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Property Entrance Front Gate</p>
                      <p className="text-xs text-gray-400">gachibowli_entrance_gps.jpg • 2.4 MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        <Eye size={18} />
                      </button>
                      <button className="text-red-300 hover:text-red-500 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Doc 2 */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-400 rounded-md">
                    <FileBadge size={16} />
                  </div>
                  <div className="flex-1 border border-indigo-100 border-dashed rounded-lg p-3 bg-white flex items-center justify-between hover:bg-indigo-50/30 transition cursor-pointer group">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Candidate Standing Outside Property</p>
                      <p className="text-xs text-gray-400">Supported formats: CSV, XLSX</p>
                    </div>
                    <CloudUpload size={22} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Decision */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
              <CheckSquare size={20} />
            </div>
            <h2 className="text-lg font-bold text-indigo-900">
              Verification Decision
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              "Verified",
              "Partially Verified",
              "Unable To Verify",
              "Candidate Shifted",
              "Incorrect Address",
              "Address Not Found",
              "Duplicate Case",
              "Verification Pending"
            ].map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                  decision === opt
                    ? "border-indigo-600 bg-indigo-50/30 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                    decision === opt
                      ? "border-indigo-800"
                      : "border-gray-300"
                  }`}
                >
                  {decision === opt && (
                    <div className="w-2.5 h-2.5 bg-indigo-800 rounded-full" />
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${
                    decision === opt ? "text-gray-900" : "text-gray-700"
                  }`}
                >
                  {opt}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-12">
              <div>
                <p className="text-xs text-gray-500 mb-1">Verification Date & Time</p>
                <p className="text-sm font-semibold text-gray-900">12 Oct 2023, 14:30 IST</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Verified By</p>
                <p className="text-sm font-semibold text-gray-900">Amit Kumar (Field Exec)</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 mb-2 font-medium">GPS Verified</span>
              <button
                type="button"
                onClick={() => setGpsVerified(!gpsVerified)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gpsVerified ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gpsVerified ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Verification Remarks */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="p-1.5 bg-indigo-50 rounded text-indigo-700">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-lg font-bold text-indigo-900">
              Verification Remarks
            </h2>
          </div>
          
          <div className="relative">
            <textarea
              rows="4"
              className="w-full rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
              placeholder="Enter remarks..."
            ></textarea>
            <div className="absolute bottom-4 right-4 text-gray-400">
              <Mic size={18} />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-xs text-gray-500">Max 1000 Characters</span>
            <span className="text-xs text-gray-500">0 / 1000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressDetails;
