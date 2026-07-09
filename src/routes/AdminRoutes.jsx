import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/clientAdmin/AdminLogin";
import Signup from "../pages/clientAdmin/Signup";
import Home from "../pages/clientAdmin/Home";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import Candidates from "../pages/clientAdmin/Candidates";
import Hr from "../pages/clientAdmin/Hr";
import CreateHR from "../pages/clientAdmin/CreateHR";
import EditHr from "../pages/clientAdmin/EditHr";
import ViewHr from "../pages/clientAdmin/ViewHr";
import BillingPage from "../pages/clientAdmin/BillingPage";

import View from "../components/clientAdmin/candidate/View";
import EditCandidate from "../components/clientAdmin/candidate/EditCandidate";
import AuditPage from "../pages/clientAdmin/AuditPage";
import AssignVerificationOfficerPage from "../pages/clientAdmin/AssignVerificationOfficerPage";
import BulkAssignPage from "../pages/clientAdmin/BulkAssignPage";
import CreateCandidateForm from "../components/clientAdmin/candidate/CreateCandidateForm";
import Analytics from "../pages/clientAdmin/Analytics";
import BulkUpload from "../pages/clientAdmin/BulkUpload";

function AdminRoutes() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="login" element={<AdminLogin />} />
      <Route path="signup" element={<Signup />} />

      {/* PROTECTED ADMIN LAYOUT */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* INDEX route → defaults to Home */}
        <Route index element={<Home />} />

        {/* HOME */}
        <Route path="home" element={<Home />} />

        {/* CANDIDATES */}
        <Route path="candidates" element={<Candidates />} />

        {/* HR */}
        <Route path="hr" element={<Hr />} />
        <Route path="create-hr" element={<CreateHR />} />
        <Route path="edit-hr/:id" element={<EditHr />} />
        <Route path="view-hr/:id" element={<ViewHr />} />

        {/* BILLING */}
        <Route path="billing" element={<BillingPage />} />

        {/* CANDIDATE VIEW/EDIT */}
        <Route path="view/:id" element={<View />} />
        <Route path="edit-candidate/:id" element={<EditCandidate />} />
        <Route path="create-candidate" element={<CreateCandidateForm />} />
        <Route path="create-candidate-bulk" element={<BulkUpload />} />

        {/* AUDIT LOG */}
        <Route path="audit-log" element={<AuditPage />} />

        {/* FALLBACK route → redirect to Home */}
        <Route path="*" element={<Navigate to="home" replace />} />
        <Route
          path="assign-verification"
          element={<AssignVerificationOfficerPage />}
        />
        <Route path="bulk-assign" element={<BulkAssignPage />} />

         <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
