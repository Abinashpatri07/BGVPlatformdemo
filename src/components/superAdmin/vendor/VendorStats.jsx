import React from "react";

import {
  UsersRound,
  UserCheck,
  UserX,
  UserMinus,
  Maximize2,
} from "lucide-react";

export default function VendorStats({ statsData }) {
  const stats = [
    {
      title: "Total",
      value: statsData?.total?.toString().padStart(2, '0') || "00",
      icon: UsersRound,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Active",
      value: statsData?.active?.toString().padStart(2, '0') || "00",
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      title: "Inactive",
      value: statsData?.inactive?.toString().padStart(2, '0') || "00",
      icon: UserX,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      title: "Suspended",
      value: statsData?.suspended?.toString().padStart(2, '0') || "00",
      icon: UserMinus,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
    },
  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {stats.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="relative bg-[#f8f8f8] border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
          >

            {/* TOP */}
            <div className="flex items-center justify-between">

              <h3 className="text-[20px] font-semibold text-gray-800">

                {card.title}

              </h3>

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${card.iconBg}`}
              >

                <Icon
                  size={22}
                  strokeWidth={2}
                  className={card.iconColor}
                />

              </div>

            </div>

            {/* VALUE */}
            <div className="mt-6">

              <h1 className="text-5xl font-bold text-gray-900 tracking-tight">

                {card.value}

              </h1>

            </div>

            {/* BOTTOM BUTTON */}
            <button
              className="absolute bottom-3 right-3 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all"
            >

              <Maximize2
                size={10}
                strokeWidth={2.5}
              />

            </button>

          </div>
        );
      })}

    </div>
  );
}