import {
  Eye,
  Pencil,
  Mail,
  Ban,
  PauseCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TableToolbar from "./TableToolbar";
import { tableData } from "../data/tableData";
import HRActionDropdown from "../hr/HRActionDropdown";

function TableSection({ isToolBarRequired }) {
  const [data, setData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();

  // LOAD DUMMY DATA
  useEffect(() => {
    setData(tableData);
  }, []);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(
        data.map((item) => item.cand_id)
      );
    } else {
      setSelectedRows([]);
    }
  };

  // SELECT SINGLE ROW
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-visible relative">

      {/* TOOLBAR */}
      {isToolBarRequired && <TableToolbar />}

      {/* TABLE */}
      <table className="w-full text-sm border-collapse">

        {/* HEADER */}
        <thead className="bg-[#F7F7F7] text-gray-700">
          <tr className="border-b border-gray-200">

            <th className="px-4 py-4 w-10">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  data.length > 0 &&
                  selectedRows.length === data.length
                }
              />
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Employee ID
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Name
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              E-Mail
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Status
            </th>

            <th className="px-4 py-4 text-left font-semibold">
              Phone
            </th>

            <th className="px-4 py-4 text-center font-semibold">
              Action
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >

              {/* CHECKBOX */}
              <td className="px-4 py-5">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(
                    item.cand_id
                  )}
                  onChange={() =>
                    handleSelectRow(item.cand_id)
                  }
                />
              </td>

              {/* EMPLOYEE ID */}
              <td className="px-4 py-5 text-gray-700">
                {item.cand_id}
              </td>

              {/* NAME */}
              <td className="px-4 py-5 font-semibold text-gray-900">
                {item.first_name} {item.last_name}
              </td>

              {/* EMAIL */}
              <td className="px-4 py-5 text-gray-600">
                {item.Email}
              </td>

              {/* PHONE */}
              <td className="px-4 py-5 text-gray-700">
                {item.Phone}
              </td>
              
              {/* STATUS */}
            <td className="px-4 py-4">

              <span
                className={`px-4 py-1 rounded-full text-xs font-medium ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-600"

                    : item.status === "Inactive"
                    ? "bg-orange-100 text-orange-500"

                    : item.status === "Terminated"
                    ? "bg-red-100 text-red-500"

                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.status}
              </span>

            </td>


              {/* ACTION */}
              <td className="px-4 py-5 text-center relative overflow-visible">

                <div
                  className="relative inline-block"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  {/* 3 DOT MENU */}
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === index
                          ? null
                          : index
                      )
                    }
                    className="text-gray-500 hover:text-black transition"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* DROPDOWN */}
                 {openMenu === index && (

                    <div className="absolute right-10 top-0 z-9999">

                      <HRActionDropdown

                        onView={() => {

                          setOpenMenu(null);

                          navigate("/admin/view-hr");
                        }}

                        onEdit={() => {

                          setOpenMenu(null);

                          navigate("/admin/edit-hr");
                        }}

                        onEmail={() => {

                          console.log("Send Email");

                          setOpenMenu(null);
                        }}

                        onTerminate={() => {

                          console.log("Terminate");

                          setOpenMenu(null);
                        }}

                      />

                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSection;