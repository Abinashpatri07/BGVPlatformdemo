// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import CandidateRoutes from "./CandidateRoutes";
// import AdminRoutes from "./AdminRoutes";
// import HRRoutes from "./HRRoutes";

// function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Candidate */}
//         <Route path="/*" element={<CandidateRoutes />} />

//         {/* Admin */}
//         <Route path="/admin/*" element={<AdminRoutes />} />

//          {/* HR */}
//         <Route
//           path="/hr/*"
//           element={<HRRoutes />}
//         />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default AppRoutes;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import CandidateRoutes from "./CandidateRoutes";
import AdminRoutes from "./AdminRoutes";
import HRRoutes from "./HRRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import VendorRoutes from "./VendorRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Candidate */}
        <Route path="/*" element={<CandidateRoutes />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* HR */}
        <Route
          path="/hr/*"
          element={<HRRoutes />}
        />

        {/* Super Admin */}
        <Route
          path="/super-admin/*"
          element={<SuperAdminRoutes />}
        />

        {/* Vendor */}
        <Route
          path="/vendor/*"
          element={<VendorRoutes />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;