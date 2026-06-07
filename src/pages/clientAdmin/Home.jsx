import ProfileHeader from "../../components/clientAdmin/home/ProfileHeader";
import HROverview from "../../components/clientAdmin/home/HROverview";
import CandidateOverview from "../../components/clientAdmin/home/CandidateOverview";
import VerificationCredits from "../../components/clientAdmin/home/VerificationCredits";
import RecentProfiles from "../../components/clientAdmin/home/RecentProfiles";

function Home() {
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
                <HROverview />
              </div>
            </div>

            {/* VERIFICATION CREDITS */}
            <div className="col-span-4">
              <div className="h-full">
                <VerificationCredits />
              </div>
            </div>
          </div>

          {/* CANDIDATE OVERVIEW */}
          <div className="bg-[#EEF1FF] border border-[#E4E8FF] rounded-2xl p-3">
            <CandidateOverview />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3">
          <RecentProfiles />
        </div>
      </div>
    </div>
  );
}

export default Home;
