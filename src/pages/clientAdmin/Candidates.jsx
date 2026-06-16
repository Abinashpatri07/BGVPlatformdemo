import { useState } from "react";

import ProfileHeader from "../../components/clientAdmin/home/ProfileHeader";
import CandidateOverviewSection from "../../components/clientAdmin/candidate/CandidateOverviewSection";
import TableToolbar from "../../components/clientAdmin/home/TableToolbar";
import CandidateTable from "../../components/clientAdmin/candidate/CandidateTable";
import Pagination from "../../components/clientAdmin/home/Pagination";

const Candidates = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return (
    <div className="p-5">

      {/* PROFILE HEADER */}
      <ProfileHeader showExport={false} showCreateHR={false} showCreateCandidate={true} />

      {/* CANDIDATE OVERVIEW CARDS */}
      <div className="mt-6">
        <CandidateOverviewSection />
      </div>

      {/* TOOLBAR */}
      <div className="mt-2">
        <TableToolbar />
      </div>

      {/* TABLE */}
      <div className="mt-4">
        <CandidateTable 
          page={page} 
          onTotalPagesChange={setTotalPages} 
        />
      </div>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
};

export default Candidates;