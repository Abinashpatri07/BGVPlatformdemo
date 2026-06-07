const profiles = [
  { name: "Deepak Mukherji",  role: "Candidate", time: "2 day ago", img: 10 },
  { name: "Devika Banaji",    role: "Candidate", time: "4 day ago", img: 11 },
  { name: "Rena Biswal",      role: "HR",        time: "4 day ago", img: 12 },
  { name: "Arjun Malhotra",   role: "HR",        time: "4 day ago", img: 13 },
  { name: "Ananya Banerjee",  role: "Candidate", time: "4 day ago", img: 14 },
  { name: "Kyra Pillai",      role: "HR",        time: "4 day ago", img: 15 },
  { name: "Dhruv Verma",      role: "Candidate", time: "4 day ago", img: 16 },
  { name: "Aryan Mehra",      role: "HR",        time: "5 day ago", img: 17 },
  { name: "Rohan Das",        role: "Candidate", time: "4 day ago", img: 18 },
  { name: "Arav Sharma",      role: "Candidate", time: "4 day ago", img: 19 },
  { name: "Navya Sharma",     role: "Candidate", time: "6 day ago", img: 20 },
  { name: "Aavya Hegde",      role: "HR",        time: "6 day ago", img: 21 },
  { name: "Diya Kapoor",      role: "HR",        time: "4 day ago", img: 22 },
  { name: "Diya Kapoor",      role: "HR",        time: "4 day ago", img: 23 },
];

function RecentProfiles() {
  return (
    <div className="bg-[#09004D] rounded-3xl p-4 h-full flex flex-col border border-indigo-900 shadow-xl">

      {/* HEADER */}
      <h2 className="text-[14px] font-semibold text-white mb-3">
        Recent Profiles
      </h2>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}>
        {profiles.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-3"
          >
            {/* LEFT */}
            <div className="flex items-start gap-3 min-w-0">

              {/* IMAGE */}
              <img
                src={`https://i.pravatar.cc/150?img=${item.img}`}
                alt=""
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10"
              />

              {/* INFO */}
              <div className="min-w-0">
                <h4 className="text-[12px] font-medium text-white truncate leading-none">
                  {item.name}
                </h4>
                <div className="mt-1">
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
                      item.role === "HR"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-white text-indigo-700"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>
              </div>

            </div>

            {/* TIME */}
            <span className="text-[9px] text-gray-400 whitespace-nowrap mt-0.5">
              {item.time}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}

export default RecentProfiles;