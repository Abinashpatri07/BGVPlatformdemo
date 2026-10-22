import { API_BASE_URL } from "../../API/config.js";
import ProfileHeader from "../../components/clientAdmin/home/ProfileHeader";
import HROverview from "../../components/clientAdmin/home/HROverview";
import CandidateOverview from "../../components/clientAdmin/home/CandidateOverview";
import VerificationCredits from "../../components/clientAdmin/home/VerificationCredits";
import RecentProfiles from "../../components/clientAdmin/home/RecentProfiles";
import { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";

function Home() {
  const [hrStats, setHrStats] = useState(null);
  const [candidateStats, setCandidateStats] = useState(null);
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get(`${API_BASE_URL}/api/client-admin/dashboard/metrics`);
        if (res.data.success) {
          setHrStats(res.data.data.hrStats);
          setCandidateStats(res.data.data.candidateStats);
          setRecentProfiles(res.data.data.recentProfiles || []);
          setCredits(res.data.data.credits || null);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="p-3 bg-[#F5F7FF] min-h-screen">
      {/* ───────────────── HEADER ───────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8EBFF] shadow-sm px-5 py-3">
        <ProfileHeader showExport={false} showCreateHR={false} />
      </div>

      {/* ───────────────── MAIN GRID ───────────────── */}
      <div className="grid grid-cols-12 gap-3 mt-3">
        {/* LEFT SIDE */}
        <div className="col-span-9 flex flex-col gap-3">
          {/* TOP SECTION */}
          <div className="grid grid-cols-12 gap-3">
            {/* HR OVERVIEW */}
            <div className="col-span-8">
              <div className="bg-[#EEF1FF] border border-[#E4E8FF] rounded-2xl p-3 h-full">
                <HROverview data={hrStats} />
              </div>
            </div>

            {/* VERIFICATION CREDITS */}
            <div className="col-span-4">
              <div className="h-full">
                <VerificationCredits data={credits} />
              </div>
            </div>
          </div>

          {/* CANDIDATE OVERVIEW */}
          <div className="bg-[#EEF1FF] border border-[#E4E8FF] rounded-2xl p-3">
            <CandidateOverview data={candidateStats} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3">
          <RecentProfiles data={recentProfiles} />
        </div>
      </div>
    </div>
  );
}

export default Home;
