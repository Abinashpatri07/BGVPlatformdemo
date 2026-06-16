import { useState } from "react"
import Pagination from "../../components/clientAdmin/home/Pagination"
import ProfileHeader from "../../components/hr/ProfileHeader"
import TableSection from "../../components/hr/TableSection"



const DashBoard = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return (
    <div className="p-4 flex flex-col gap-5">
        <ProfileHeader showExport={true} showAddCandidate={true}/>
        <TableSection 
           isToolBarRequired={false} 
           page={page} 
           onTotalPagesChange={setTotalPages} 
        />
        <Pagination currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}/>
    </div>
)
}

export default DashBoard;


