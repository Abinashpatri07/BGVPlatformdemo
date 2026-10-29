import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import HRLayout from "../layouts/HRLayout";

import Home from "../pages/hr/Home";
import BulkUpload from "../pages/hr/BulkUpload";
import EditCandidate from "../pages/hr/EditCandidate";
import View from "../components/clientAdmin/candidate/View";
import DashBoard from "../pages/hr/DashBoard";

import CreateCandidateForm from "../components/hr/CreateCandidateForm";


import Login from "../pages/hr/Login";
import ForgotPassword from "../components/hr/login/ForgotPassword";
import Analytics from "../pages/hr/Analytics";
import SetupHRPasswordPage from "../pages/hr/SetupHRPasswordPage";

function HRRoutes() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="login"
        element={<Login/>}
      />

      {/* FORGOT PASSWORD */}
      <Route
        path="forgot-password"
        element={<ForgotPassword />}
      />

      {/* RESET & SETUP PASSWORD */}
      <Route
        path="reset-password"
        element={<SetupHRPasswordPage />}
      />
      <Route
        path="setup-password"
        element={<SetupHRPasswordPage />}
      />
      <Route
        path="hr-setup-password"
        element={<SetupHRPasswordPage />}
      />

      {/* HR LAYOUT */}
      <Route
        path="/"
        element={
          <ProtectedRoute role="hr">

            <HRLayout />

          </ProtectedRoute>
        }
      >

        {/* DEFAULT */}
        <Route
          index
          element={
            <Navigate to="home" />
          }
        />

        {/* HOME */}
        <Route
          path="home"
          element={<Home />}
        />

        {/* DASHBOARD */}
        <Route
          path="dashboard"
          element={<DashBoard />}
        />

        {/* BULK */}
        <Route
          path="bulk-upload"
          element={<BulkUpload />}
        />

        {/* CREATE */}
        <Route
          path="create-candidate"
          element={<CreateCandidateForm />}
        />

        {/* VIEW */}
        <Route
          path="view/:id"
          element={<View />}
        />

        {/* EDIT */}
        <Route
          path="edit-candidate/:id"
          element={<EditCandidate />}
        />
        <Route path="analytics" element={<Analytics />} />

      </Route>

    </Routes>
  );
}

export default HRRoutes;