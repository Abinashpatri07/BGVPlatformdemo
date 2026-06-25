import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  ReceiptText,
  BarChart3,
  UserRound,
} from "lucide-react";

export const superAdminMenu = [

  /* HOME */
  {
    name: "Home",
    icon: LayoutDashboard,
    path: "/super-admin/home",

    activePaths: [
      "/super-admin/home",
    ],
  },

  /* CLIENT */
  {
    name: "Client",
    icon: Building2,
    path: "/super-admin/clients",

    activePaths: [
      "/super-admin/clients",
      "/super-admin/create-client",
      "/super-admin/view-client",
      "/super-admin/edit-client",
    ],
  },

  /* VENDOR */
  {
    name: "Vendor",
    icon: Users,
    path: "/super-admin/vendor",

    activePaths: [
      "/super-admin/vendor",
      "/super-admin/create-vendor",
      "/super-admin/view-vendor",
      "/super-admin/edit-vendor",
    ],
  },

  /* HR */
  {
    name: "HR",
    icon: UserCheck,
    path: "/super-admin/hr",

    activePaths: [
      "/super-admin/hr",
      "/super-admin/create-hr",
      "/super-admin/view-hr",
      "/super-admin/edit-hr",
    ],
  },

  /* CANDIDATE */
  {
    name: "Candidate",
    icon: UserRound,
    path: "/super-admin/candidate",

    activePaths: [
      "/super-admin/candidate",
      "/super-admin/create-candidate",
      "/super-admin/view/",
      "/super-admin/edit-candidate",
      "/super-admin/audit",
    ],
  },

  /* BILLING */
  {
    name: "Billing",
    icon: ReceiptText,
    path: "/super-admin/billing",

    activePaths: [
      "/super-admin/billing",
    ],
  },

  /* ANALYTICS */
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/super-admin/analytics",

    activePaths: [
      "/super-admin/analytics",
    ],
  },

];