// import { lazy } from "react";

// // Admin Pages
// const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
// const Students = lazy(() => import("../pages/admin/Students"));
// const Companies = lazy(() => import("../pages/admin/Companies"));
// const JNF = lazy(() => import("../pages/admin/JNF"));
// const Placements = lazy(() => import("../pages/admin/Placements"));
// const Templates = lazy(() => import("../pages/admin/Templates"));
// const Reports = lazy(() => import("../pages/admin/Reports"));
// const Profile = lazy(() => import("../pages/admin/Profile"));
// const Settings = lazy(() => import("../pages/admin/Settings"));
// const Audit = lazy(() => import("../pages/admin/Audit"));
// const Automation = lazy(() => import("../pages/admin/Automation"));
// // Auth Pages
// const AdminLogin = lazy(() => import("../pages/auth/Login"));
// const Login = lazy(() => import("../components/auth/Login"));
// const Signup = lazy(() => import("../components/auth/Signup"));
// const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
// const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
// const Notifications = lazy(() => import("../pages/admin/Notifications"));
// const CompanyDashboard = lazy(
//   () => import("../components/company/CompanyDashboard")
// );
// const AuthLayout = lazy(() => import("../components/layout/AuthLayout"));
// // Error Pages
// const Error404 = lazy(() => import("../pages/Error404"));
// const LandingPage = lazy(() => import("../pages/Landing/LandingPage"));
// // studentdashborad
// const StudentDashboard = lazy(
//   () => import("../components/student/StudentDashboard")
// );
// // const StudentRegistration = lazy(() => import('../components/student/StudentRegistration'));
// const routes = [
//   {
//     path: "/admin",
//     children: [
//       {
//         path: "dashboard",
//         element: Dashboard,
//       },
//       {
//         path: "students",
//         element: Students,
//       },
//       {
//         path: "companies",
//         element: Companies,
//       },
//       {
//         path: "jnf", // Added JNF route
//         element: JNF,
//       },
//       {
//         path: "placements",
//         element: Placements,
//       },
//       {
//         path: "notifications",
//         element: Notifications,
//       },
//       {
//         path: "templates",
//         element: Templates,
//       },
//       {
//         path: "automation",
//         element: Automation,
//       },
//       {
//         path: "audit",
//         element: Audit,
//       },
//       {
//         path: "reports",
//         element: Reports,
//       },
//       {
//         path: "profile",
//         element: Profile,
//       },
//       {
//         path: "settings",
//         element: Settings,
//       },
//     ],
//   },
//   {
//     path: "/auth",
//     children: [
//       // {
//       //   path: "student",
//       //   children: [
//       //     {
//       //       path: "login",
//       //       element: Login,
//       //     },
//       //     {
//       //       path: "initiate",
//       //       element: Signup,
//       //     },
//       //     {
//       //       path: "reset-password",
//       //       element: ResetPassword,
//       //     },
//       //   ],
//       // },
//       {
//         path: "recruiter",
//         children: [
//           {
//             path: "login",
//             element: Login,
//           },
//           {
//             path: "initiate",
//             element: Signup,
//           },
//           {
//             path: "reset-password",
//             element: ResetPassword,
//           },
//         ],
//       },
//       {
//         path: "admin",
//         children: [
//           {
//             path: "login",
//             element: Login,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: "/company",
//     children: [
//       {
//         path: "dashboard",
//         element: CompanyDashboard,
//       },
//     ],
//   },

//   // {
//   //   path: "/student",
//   //   children: [
//   //     {
//   //       path: "dashboard",
//   //       element: StudentDashboard,
//   //     },
//   //     // {
//   //     //   path: 'complete-profile',
//   //     //   element: StudentRegistration,
//   //     // },
//   //   ],
//   // },
//   {
//     path: "*",
//     element: Error404,
//   },
// ];

// export default routes;

//testing after adding student part (working )

import { element } from "prop-types";
import { lazy } from "react";

// Admin Pages
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Students = lazy(() => import("../pages/admin/Students"));
const Companies = lazy(() => import("../pages/admin/Companies"));
const JNF = lazy(() => import("../pages/admin/JNF"));
const NotificationForms = lazy(
  () => import("../pages/admin/NotificationForms")
);
const Placements = lazy(() => import("../pages/admin/Placements"));
const Internships = lazy(() => import("../pages/admin/Internships"));
const Templates = lazy(() => import("../pages/admin/Templates"));
const Reports = lazy(() => import("../pages/admin/Reports"));
const Survey = lazy(() => import("../pages/admin/Survey"));
const Query = lazy(() => import("../pages/admin/Query"));
const Profile = lazy(() => import("../pages/admin/Profile"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const Audit = lazy(() => import("../pages/admin/Audit"));
const Automation = lazy(() => import("../pages/admin/Automation"));
// Auth Pages
const AdminLogin = lazy(() => import("../pages/auth/Login"));
const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Notifications = lazy(() => import("../pages/admin/Notifications"));
// const DriveManagement = lazy(() => import("../pages/admin/DriveManagement"));
const CompanyDashboard = lazy(
  () => import("../components/company/CompanyDashboard")
);
const AuthLayout = lazy(() => import("../components/layout/AuthLayout"));
// Error Pages
const Error404 = lazy(() => import("../pages/Error404"));
const LandingPage = lazy(() => import("../pages/Landing/LandingPage"));
const StudentDashboard = lazy(
  () => import("../components/student/StudentDashboard")
);

const routes = [
  {
    path: "/admin",
    children: [
      { path: "dashboard", element: Dashboard },
      { path: "students", element: Students },
      { path: "companies", element: Companies },
      { path: "notificationforms", element: NotificationForms },
      // { path: "jnf", element: JNFManagement },
      { path: "internships", element: Internships },
      // { path: "placements",
      //   element:Placements,
      //   children: [
      //     {
      //     path: ':placementId',
      //     element: lazy(() => import("../pages/admin/DriveManagement")),
      //     },
      //   ],
      // },
      { path: "survey", element: Survey },
      { path: "query", element: Query },
      { path: "notifications", element: Notifications },
      { path: "templates", element: Templates },
      { path: "automation", element: Automation },
      { path: "audit", element: Audit },
      { path: "reports", element: Reports },
      { path: "profile", element: Profile },
      { path: "settings", element: Settings },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "student",
        children: [
          {
            path: "login",
            element: lazy(
              () =>
                import("../components/student/auth_referal_for_student/Login")
            ),
          },
          {
            path: "signup",
            element: lazy(
              () =>
                import("../components/student/auth_referal_for_student/Signup")
            ),
          },
        ],
      },
      {
        path: "recruiter",
        children: [
          {
            path: "login",
            element: lazy(
              () =>
                import("../components/company/auth_referal_for_company/Login")
            ),
          },
          {
            path: "signup",
            element: lazy(
              () =>
                import("../components/company/auth_referal_for_company/Signup")
            ),
          },
          { path: "reset-password", element: ResetPassword },
        ],
      },
      {
        path: "admin",
        children: [{ path: "login", element: Login }],
      },
    ],
  },
  {
    path: "/company",
    element: lazy(() => import("../components/company/CompanyDashboard")), // Main element for /company
    children: [
      // {
      //   path: "", // Default child route (optional, could render a welcome page or redirect)
      //   // element: lazy(() => import("../components/company/CompanyWelcome")), // Example default
      //   index: true, // Or use index route if CompanyDashboard should render something by default
      //   // If CompanyDashboard itself should render the default view, you might not need an index route here.
      //   // If the first navigation should always go to profile or post-jnf, you might redirect in CompanyDashboard's useEffect.
      // },
      {
        path: "profile",
        element: lazy(() => import("../components/company/CompanyProfile")),
      },
      {
        path: "post-jnf",
        element: lazy(
          () => import("../components/company/JNFPosting/index")
        ),
      },
    ],
  },
  {
    path: "/student",
    children: [
      {
        path: ":id",
        element: lazy(() => import("../components/student/StudentDashboard")),
        children: [
          {
            path: "profile",
            element: lazy(
              () =>
                import("../components/student/sections/Profile/ProfileSection")
            ),
          },
          {
            path: "profile/edit",
            element: lazy(
              () =>
                import(
                  "../components/student/sections/Profile/ProfileEdit/ProfileEdit"
                )
            ),
          },
          {
            path: "applications",
            element: lazy(
              () =>
                import(
                  "../components/student/sections/Applications/ApplicationSection"
                )
            ),
          },
          {
            path: "jobs",
            element: lazy(
              () => import("../components/student/sections/jobs/JobSection")
            ),
          },
          {
            path: "notifications",
            element: lazy(
              () => import("../components/student/sections/NotificationSection")
            ),
          },
          {
            path: "queries",
            element: lazy(
              () => import("../components/student/sections/QuerySection")
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: Error404,
  },
];

export default routes;
