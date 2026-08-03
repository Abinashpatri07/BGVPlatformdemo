import { Routes, Route, Navigate } from "react-router-dom";
import VendorLayout from "../layouts/VendorLayout";
import VendorLogin from "../pages/vendor/VendorLogin";
import VendorHome from "../pages/vendor/VendorHome";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorAnalytics from "../pages/vendor/VendorAnalytics";
import VendorBilling from "../pages/vendor/VendorBilling";
import VerifiedApplications from "../pages/vendor/VerifiedApplications";
import RefuteApplications from "../pages/vendor/RefuteApplications";
import AssignedApplications from "../pages/vendor/AssignedApplications";
import UnverifiedApplications from "../pages/vendor/UnverifiedApplications";
import EmploymentDetails from "../pages/vendor/EmploymentDetails";
import AddressDetails from "../pages/vendor/AddressDetails";
import DrugTestDetails from "../pages/vendor/DrugTestDetails";
import EducationDetails from "../pages/vendor/EducationDetails";
import CriminalDetails from "../pages/vendor/CriminalDetails";

function VendorRoutes() {
  return (
    <Routes>
      <Route path="login" element={<VendorLogin />} />
      <Route element={<VendorLayout />}>
        <Route path="home" element={<VendorHome />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="analytics" element={<VendorAnalytics />} />
        <Route path="billing" element={<VendorBilling />} />
        <Route path="verified-applications" element={<VerifiedApplications />} />
        <Route path="refute-applications" element={<RefuteApplications />} />
        <Route path="assigned-applications" element={<AssignedApplications />} />
        <Route path="unverified-applications" element={<UnverifiedApplications />} />
        <Route path="employment-details" element={<EmploymentDetails />} />
        <Route path="address-details" element={<AddressDetails />} />
        <Route path="drug-test-details" element={<DrugTestDetails />} />
        <Route path="education-details" element={<EducationDetails />} />
        <Route path="criminal-details" element={<CriminalDetails />} />
        
        
      </Route>
      
      {/* Default route */}
      <Route path="" element={<Navigate to="login" replace />} />
    </Routes>
  );
}

export default VendorRoutes;
