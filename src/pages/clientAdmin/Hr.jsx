import { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ProfileHeader from "../../components/clientAdmin/home/ProfileHeader";
import HrOverviewSection from "../../components/clientAdmin/hr/HrOverviewSection";
import TableSection from "../../components/clientAdmin/home/TableSection";
import Pagination from "../../components/clientAdmin/home/Pagination";

const Hr = () => {
  const [page, setPage] = useState(1);
  const [hrs, setHrs] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, terminated: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (currentPage) => {
    setLoading(true);
    try {
      const hrRes = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/api/client-admin/hr/get-all?page=${currentPage}&limit=10`
      );
      if (hrRes.data.success) {
        setHrs(hrRes.data.data);
        setStats(hrRes.data.stats || {});
        setTotalPages(hrRes.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch HR data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, id) => {
    try {
      if (action === "terminate") {
        // TerminateModal already made the API call, just refresh
        fetchData(page);
      }
    } catch (err) {
      console.error("Action failed", err);
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const handleExport = (type) => {
    if (hrs.length === 0) return alert("No data to export");

    if (type === "csv") {
      const headers = ["Employee ID", "First Name", "Last Name", "Email", "Phone", "Role", "Status"];
      const csvData = hrs.map((hr) => [
        hr.empId,
        hr.firstName,
        hr.lastName,
        hr.email,
        hr.phone,
        hr.role,
        hr.isActive === 3 ? "Suspended" : "Active",
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        csvData.map((e) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "HR_List.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === "pdf") {
      const doc = new jsPDF();
      doc.text("HR List", 14, 15);

      const tableColumn = ["Emp ID", "Name", "Email", "Phone", "Role", "Status"];
      const tableRows = [];

      hrs.forEach((hr) => {
        const hrData = [
          hr.empId,
          `${hr.firstName} ${hr.lastName}`,
          hr.email,
          hr.phone,
          hr.role,
          hr.isActive === 3 ? "Suspended" : "Active",
        ];
        tableRows.push(hrData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save("HR_List.pdf");
    }
  };

  return (
    <div className="p-4 flex flex-col">

      {/* PROFILE HEADER */}
      <ProfileHeader showExport={true} showCreateHR={true} onExport={handleExport} />

      {/* HR OVERVIEW CARDS */}
      <div className="mt-6">
        <HrOverviewSection overview={stats} />
      </div>

      {/* TABLE */}
      <div className="mt-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading HRs...</div>
        ) : (
          <TableSection data={hrs} onAction={handleAction} />
        )}
      </div>

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
};

export default Hr;