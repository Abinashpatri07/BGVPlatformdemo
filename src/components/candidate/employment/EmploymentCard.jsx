import React from "react";
import { Pencil } from "lucide-react";

function EmploymentCard({ data, onAddNew, onNext }) {
  const from = new Date(data.fromDate);
  const to = new Date(data.toDate);

  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());

  const formatDate = (date) =>
    date.toLocaleString("default", { month: "short" }) +
    " " +
    date.getFullYear();

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

      <div className="bg-white rounded-2xl border shadow-sm px-6 py-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#0B1437]">
            {data.designation}
          </h3>
          <Pencil size={14} className="text-gray-400" />
        </div>

        <p className="text-sm font-semibold mt-2">
          {data.companyName}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Full-Time | {formatDate(from)} To {formatDate(to)} ({months} Months)
        </p>
        
        {data.uanNumber && (
          <p className="text-sm text-gray-500 mt-1">
            UAN: <span className="font-medium text-gray-700">{data.uanNumber}</span>
          </p>
        )}
      </div>

      <div className="flex-1 flex items-end justify-center pb-6">
        <button
          onClick={onNext}
          className="bg-blue-700 text-white px-12 py-2.5 rounded-xl"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EmploymentCard;