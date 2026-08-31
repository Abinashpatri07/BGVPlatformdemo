import React from "react";
import { Pencil } from "lucide-react";

function EmploymentCard({ employments, onAddNew, onFinalSubmit, onEdit }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "short" }) + " " + date.getFullYear();
  };

  const getMonths = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  };

  return (
    <div className="min-h-screen bg-[#EEEEF8] px-10 py-10 flex flex-col">
      
      <div className="flex justify-end mb-6">
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl"
        >
          <span>+</span>
          Add Employment
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {employments.map((data, index) => (
          <div key={index} className="bg-white rounded-2xl border shadow-sm px-6 py-5">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0B1437]">
                {data.designation || "No Designation"}
              </h3>
              <Pencil 
                size={14} 
                className="text-gray-400 cursor-pointer hover:text-blue-600 transition" 
                onClick={() => onEdit(index)}
              />
            </div>

            <p className="text-sm font-semibold mt-2">
              {data.companyName || "No Company"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Full-Time | {formatDate(data.fromDate)} To {formatDate(data.toDate)} ({getMonths(data.fromDate, data.toDate)} Months)
            </p>
            
            {data.employeeId && (
              <p className="text-sm text-gray-500 mt-1">
                Employee ID: <span className="font-medium text-gray-700">{data.employeeId}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-end justify-center pb-6 mt-8">
        <button
          onClick={onFinalSubmit}
          className="bg-blue-700 text-white px-12 py-2.5 rounded-xl hover:bg-blue-800 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EmploymentCard;