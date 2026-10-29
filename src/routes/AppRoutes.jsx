import { BrowserRouter, Routes, Route } from "react-router-dom";

import CandidateRoutes from "./CandidateRoutes";
import AdminRoutes from "./AdminRoutes";
import HRRoutes from "./HRRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import VendorRoutes from "./VendorRoutes";
import PortalLoginPage from "../pages/PortalLoginPage";
import SetupPasswordPage from "../pages/candidate/SetupPasswordPage";
import SetupHRPasswordPage from "../pages/hr/SetupHRPasswordPage";
import SetupVendorPasswordPage from "../pages/vendor/SetupVendorPasswordPage";
import SetupClientPasswordPage from "../pages/clientAdmin/SetupClientPasswordPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing / Unified Portal Login Page */}
        <Route path="/" element={<PortalLoginPage />} />
        <Route path="/portal-login" element={<PortalLoginPage />} />
        <Route path="/portallogin" element={<PortalLoginPage />} />

        {/* Top-Level Password Reset & Setup Routes (Direct match for all portal emails) */}
        <Route path="/candidate/reset-password" element={<SetupPasswordPage />} />
        <Route path="/candidate/setup-password" element={<SetupPasswordPage />} />
        <Route path="/reset-password" element={<SetupPasswordPage />} />
        <Route path="/setup-password" element={<SetupPasswordPage />} />

        <Route path="/hr/reset-password" element={<SetupHRPasswordPage />} />
        <Route path="/hr/setup-password" element={<SetupHRPasswordPage />} />
        <Route path="/hr-setup-password" element={<SetupHRPasswordPage />} />

        <Route path="/admin/reset-password" element={<SetupClientPasswordPage />} />
        <Route path="/admin/setup-password" element={<SetupClientPasswordPage />} />
        <Route path="/admin/client-setup-password" element={<SetupClientPasswordPage />} />
        <Route path="/client-setup-password" element={<SetupClientPasswordPage />} />

        <Route path="/vendor/reset-password" element={<SetupVendorPasswordPage />} />
        <Route path="/vendor/setup-password" element={<SetupVendorPasswordPage />} />
        <Route path="/vendor-setup-password" element={<SetupVendorPasswordPage />} />

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

        {/* Candidate Direct Fallback (for existing links like /verification) */}
        <Route path="/*" element={<CandidateRoutes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
