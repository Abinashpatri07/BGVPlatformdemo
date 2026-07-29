import React, { useState } from "react";
import {
  User,
  GraduationCap,
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
import { useNavigate, useSearchParams } from "react-router-dom";

function EducationDetails() {
  const [decision, setDecision] = useState("Verified");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isView = searchParams.get("mode") === "view";

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10 px-4 mt-4">
      
      {isView ? (
        <>
          {/* Personal Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
                <User size={20} />
              </div>
              <h2 className="text-xl font-semibold text-indigo-900">Case ID - CASE1234</h2>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-wrap gap-12 lg:gap-16 justify-start ml-2">
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">First Name</p>
                <p className="text-sm font-semibold text-gray-900">Ramesh</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Last Name</p>
                <p className="text-sm font-semibold text-gray-900">Kumar</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Phone Number</p>
                <p className="text-sm font-semibold text-gray-900">+91 2584369401</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Email Id</p>
                <p className="text-sm font-semibold text-gray-900">ramesh43@gmail.com</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Tag</p>
                <p className="text-sm font-semibold text-gray-900">IT</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Function</p>
                <p className="text-sm font-semibold text-gray-900">May Batch</p>
              </div>
            </div>
          </div>

          {/* Education Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 ml-2 mt-8">
              <div className="p-1.5 bg-indigo-50 rounded-full text-indigo-700">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-xl font-semibold text-indigo-900">Education Details</h2>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4 border-b border-indigo-100 pb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900">
            Education Details
          </h1>
        </div>
      )}

      <div className="space-y-6 mt-4 ml-2">
        
        {/* Matriculation */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Matriculation
              </h3>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Institute Name <span className="text-red-500">*</span></p>
                  <p className="text-sm font-semibold text-gray-900">Nolend Group of Institutions</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Degree</p>
                  <p className="text-sm font-semibold text-gray-900">10th</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-gray-900">25/ 5/ 2013</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-semibold text-gray-900">06/ 04/ 2018</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Course</p>
                  <p className="text-sm font-semibold text-gray-900">English, Hindi, Odia</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Percentage/ CGPA</p>
                  <p className="text-sm font-semibold text-gray-900">89%</p>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Upload Required Document
              </h3>
              <div className="space-y-4">
                {/* Doc 1 - Uploaded */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Mark sheet</p>
                      <p className="text-xs text-gray-400">gachibowli_entrance_gps.jpg • 2.4 MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        <Eye size={18} />
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
                      <p className="text-sm font-semibold text-gray-800">Certifichet</p>
                      <p className="text-xs text-gray-400">Supported formats: CSV, XLSX</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Higher Secondary */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Higher Secondary (12th Standard)
              </h3>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Institute Name <span className="text-red-500">*</span></p>
                  <p className="text-sm font-semibold text-gray-900">Jagabandhu Secondary School</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Degree</p>
                  <p className="text-sm font-semibold text-gray-900">12th</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-gray-900">25/ 5/ 2018</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-semibold text-gray-900">06/ 04/ 2019</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Course</p>
                  <p className="text-sm font-semibold text-gray-900">Science</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Percentage/ CGPA</p>
                  <p className="text-sm font-semibold text-gray-900">89%</p>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Upload Required Document
              </h3>
              <div className="space-y-4">
                {/* Doc 1 - Uploaded */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Mark sheet</p>
                      <p className="text-xs text-gray-400">gachibowli_entrance_gps.jpg • 2.4 MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        <Eye size={18} />
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
                      <p className="text-sm font-semibold text-gray-800">Certifichet</p>
                      <p className="text-xs text-gray-400">Supported formats: CSV, XLSX</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graduation */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Graduation
              </h3>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Institute Name <span className="text-red-500">*</span></p>
                  <p className="text-sm font-semibold text-gray-900">Utkal University</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 mb-1">Degree</p>
                  <p className="text-sm font-semibold text-gray-900">Bachelor of Technology (B.Tech)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-gray-900">25/ 5/ 2020</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-semibold text-gray-900">06/ 04/ 2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Course</p>
                  <p className="text-sm font-semibold text-gray-900">Computer Science & Engineering</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Percentage/ CGPA</p>
                  <p className="text-sm font-semibold text-gray-900">8.64</p>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Upload Required Document
              </h3>
              <div className="space-y-4">
                {/* Doc 1 - Uploaded */}
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Mark sheet</p>
                      <p className="text-xs text-gray-400">gachibowli_entrance_gps.jpg • 2.4 MB</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        <Eye size={18} />
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
                      <p className="text-sm font-semibold text-gray-800">Certifichet</p>
                      <p className="text-xs text-gray-400">Supported formats: CSV, XLSX</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isView && (
          <>
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
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
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

              <div className="flex items-center pt-6 border-t border-gray-100 gap-12">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Verification Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">12 Oct 2023, 14:30 IST</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Verified By</p>
                  <p className="text-sm font-semibold text-gray-900">Amit Kumar (Field Exec)</p>
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
          </>
        )}

      </div>
    </div>
  );
}

export default EducationDetails;
