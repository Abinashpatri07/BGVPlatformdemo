import { useState } from "react";
import Pagination from "../../components/clientAdmin/home/Pagination";
import ProfileHeader from "../../components/hr/ProfileHeader";
import CardSection from "../../components/hr/CardSection";
import TableSection from "../../components/hr/TableSection";
import TableToolbar from "../../components/hr/TableToolbar";

const Home = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-4 flex flex-col gap-5">
      <ProfileHeader showExport={false} showAddCandidate={false} />
      <CardSection />
      <TableToolbar
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
        sortBy={sortBy}
        onSortChange={(val) => { setSortBy(val); setPage(1); }}
        onRefresh={handleRefresh}
      />
      <TableSection
        key={refreshKey}
        searchTerm={searchTerm}
        sortBy={sortBy}
        page={page}
        onTotalPagesChange={setTotalPages}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Home;