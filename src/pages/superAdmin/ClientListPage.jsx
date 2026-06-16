import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UsersRound,
  UserCheck,
  UserX,
  UserMinus,
} from "lucide-react";

import ClientPageHeader from "../../components/superAdmin/client/ClientPageHeader";
import ClientStatCards from "../../components/superAdmin/client/ClientStatCards";
import ClientTable from "../../components/superAdmin/client/ClientTable";
import ClientPagination from "../../components/superAdmin/client/ClientPagination";

export default function ClientListPage() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [statsData, setStatsData] = useState([
    { title: "Total",     value: "0", icon: UsersRound, iconBg: "bg-indigo-100",  iconColor: "text-indigo-600" },
    { title: "Active",    value: "0", icon: UserCheck,  iconBg: "bg-green-100",   iconColor: "text-green-500" },
    { title: "Inactive",  value: "0", icon: UserX,      iconBg: "bg-orange-100",  iconColor: "text-orange-500" },
    { title: "Suspended", value: "0", icon: UserMinus,  iconBg: "bg-red-100",     iconColor: "text-red-500" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, [currentPage, perPage]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/client/get-all-clients?page=${currentPage}&limit=${perPage}`);
      if (res.data.success) {
        // Map backend data to match ClientTable expected format
        const formattedData = res.data.data.map(client => ({
          id: client.id,                          // raw cm_id (numeric)
          displayId: `CLT${client.id}`,           // formatted for display
          name: client.name,
          gst: client.gst,
          pocName: client.contactPersonName || "—",
          pocEmail: client.contactEmail || "—",
          pocPhone: client.contactPhone || "—",
          city: client.city || "—",
          state: client.state || "—",
          status:
            Number(client.is_active) === 1 ? "Active" :
            Number(client.is_active) === 3 ? "Suspended" :
            "In Active",
        }));
        setClients(formattedData);
        setTotalClients(res.data.pagination.total);

        // Update stats
        if (res.data.stats) {
          setStatsData([
            { title: "Total",     value: res.data.stats.total.toString().padStart(2, '0'),     icon: UsersRound, iconBg: "bg-indigo-100",  iconColor: "text-indigo-600" },
            { title: "Active",    value: res.data.stats.active.toString().padStart(2, '0'),    icon: UserCheck,  iconBg: "bg-green-100",   iconColor: "text-green-500" },
            { title: "Inactive",  value: res.data.stats.inactive.toString().padStart(2, '0'),  icon: UserX,      iconBg: "bg-orange-100",  iconColor: "text-orange-500" },
            { title: "Suspended", value: res.data.stats.suspended.toString().padStart(2, '0'), icon: UserMinus,  iconBg: "bg-red-100",     iconColor: "text-red-500" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-10 py-9 font-sans">

      {/* Header */}
      <ClientPageHeader />

      {/* Stat Cards */}
      <ClientStatCards stats={statsData} />

      {/* Table */}
      {isLoading ? (
        <div className="py-10 text-center text-gray-500 font-medium">Loading clients...</div>
      ) : (
        <ClientTable
          data={clients}
          onView={(row) => navigate(`/super-admin/clients/view/${row.id}`)}
          onEdit={(row) => navigate(`/super-admin/clients/edit/${row.id}`)}
          onEmail={(row) => console.log("Send email to", row.pocEmail)}
          onSuspend={() => fetchClients()}
        />
      )}

      {/* Pagination */}
      {totalClients > 0 && (
        <ClientPagination
          total={totalClients}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPerPageChange={(val) => {
            setPerPage(val);
            setCurrentPage(1);
          }}
        />
      )}

    </div>
  );
}