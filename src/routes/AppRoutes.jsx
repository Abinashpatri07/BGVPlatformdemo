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
import PortalLoginPage from "../pages/PortalLoginPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing / Unified Portal Login Page */}
        <Route path="/" element={<PortalLoginPage />} />

        {/* Candidate Portal */}
        <Route path="/candidate/*" element={<CandidateRoutes />} />

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

        {/* Candidate Direct Fallback (for existing links like /verification, /setup-password) */}
        <Route path="/*" element={<CandidateRoutes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;