import { Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { lazy } from "react";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import CompanyLayout from "../components/layout/company/CompanyLayout";
import routes from "./routes";
import Error404 from "../pages/Error404";
import Settings from "../pages/admin/Settings";
import LandingPage from "../pages/Landing/LandingPage";
import StudentDashboard from "../components/student/StudentDashboard";
import ProfileEdit from "../components/student/sections/Profile/ProfileEdit/ProfileEdit";
import ApplicationsSection from "../components/student/sections/Applications/ApplicationSection";
import ResumeBuilder from "../components/student/sections/resume/ResumeBuilder";
import ProfileSection from "../components/student/sections/Profile/ProfileSection";
import JobSection from "../components/student/sections/jobs/JobSection";
import NotificationsSection from "../components/student/sections/NotificationSection";
import QuerySection from "../components/student/sections/QuerySection";

import StudentLogin from "../components/student/auth_referal_for_student/Login";
import StudentSignup from "../components/student/auth_referal_for_student/Signup";
import CompanyDashboard from "../components/company/CompanyDashboard";
import CompanyProfile from "../components/company/CompanyProfile";
import JNFPosting from "../components/company/JNFPosting/index";
import Login from "../pages/auth/Login";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/admin/Dashboard";
import Profile from "../pages/admin/Profile";
import Placements from "../pages/admin/Placements";
import DriveManagement from "../pages/admin/DriveManagement";
import PlacementPolicyManager from "../components/admin/placements/PlacementPolicyManager";
// const Placements = lazy(() => import("../pages/admin/Placements"));
// const DriveManagement = lazy(() => import("../pages/admin/DriveManagement"));

const Loading = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="admin">
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="student">
            <Route path="login" element={<StudentLogin />} />
            <Route path="signup" element={<StudentSignup />} />
          </Route>
          {routes
            .find((r) => r.path === "/auth")
            ?.children.map((route) => {
              if (route.children) {
                return (
                  <Route key={route.path} path={route.path}>
                    {route.children.map((childRoute) => (
                      <Route
                        key={childRoute.path}
                        path={childRoute.path}
                        element={<childRoute.element />}
                      />
                    ))}
                  </Route>
                );
              }
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.element />}
                />
              );
            })}
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          {routes
            .find((r) => r.path === "/admin")
            ?.children.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
          <Route path="settings" element={<Settings />} />
          <Route path="/admin/placements" element={<Placements />} />
          <Route
            path="/admin/placements/:placementId"
            element={<DriveManagement />}
          />
             <Route path="placement-policies" element={<PlacementPolicyManager />} />
        </Route>
      </Route>

      <Route path="/company" element={<CompanyLayout />}>
          {/* <Route index element={<Navigate to="post-jnf" replace />} /> */}
          {/* <Route index element={<Navigate to="/company/profile" replace />} /> */}
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="post-jnf" element={<JNFPosting />} />
      </Route>

      <Route path="/student" element={<StudentDashboard />}>
        <Route index element={<ProfileSection />} />
        <Route path="profile" element={<ProfileSection />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="applications" element={<ApplicationsSection />} />
        <Route path="resume" element={<ResumeBuilder />} />
        <Route path="jobs" element={<JobSection />} />
        <Route path="notifications" element={<NotificationsSection />} />
        <Route path="queries" element={<QuerySection />} />
      </Route>

      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;
