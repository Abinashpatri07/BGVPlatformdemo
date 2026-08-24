import React from "react";

const COLUMNS = [
  "Transaction ID",
  "Date & Time",
  "Candidate Name",
  "Package",
  "Unit",
  "Status",
];

function getStatusStyle(status) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-orange-100 text-orange-500";
    case "Failed":
      return "bg-red-100 text-red-500";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

export default function UsageLogTable({ logs = [] }) {

  return (
    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            User Activity Overview
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Track Recent Platform Interactions And User Activities.
          </p>

        </div>

        <button className="border border-indigo-700 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-lg bg-white hover:bg-indigo-50 transition">

          Export CSV

        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

        <table className="w-full border-collapse">

          {/* HEADER */}
          <thead>

            <tr className="bg-[#F3F4F6] border-b border-gray-200">

              {COLUMNS.map((col) => (

                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {col}
                </th>

              ))}

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No usage logs found.
                </td>
              </tr>
            ) : (
              logs.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* TRANSACTION */}
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {item.transactionId}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.date}
                  </td>

                  {/* CANDIDATE */}
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {item.candidate}
                  </td>

                  {/* PACKAGE */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.package}
                  </td>

                  {/* UNIT */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.unit}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}