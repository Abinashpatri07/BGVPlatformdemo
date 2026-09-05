import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/candidate/LoginPage";
import VerificationPage from "../pages/candidate/VerificationPage";
import ForgotPassword from "../components/candidate/login/ForgotPassword";
import DigiLockerPage from "../components/candidate/digilocker/DigiLockerPage";
import SetupPasswordPage from "../pages/candidate/SetupPasswordPage";
import SetupVendorPasswordPage from "../pages/vendor/SetupVendorPasswordPage";
import SetupClientPasswordPage from "../pages/clientAdmin/SetupClientPasswordPage";

function CandidateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="setup-password" element={<SetupPasswordPage />} />
      <Route path="vendor-setup-password" element={<SetupVendorPasswordPage />} />
      <Route path="client-setup-password" element={<SetupClientPasswordPage />} />
      <Route path="verification" element={<VerificationPage />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="digilocker" element={<DigiLockerPage />} />
    </Routes>
  );
}

export default CandidateRoutes;