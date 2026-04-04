import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DonorDashboard } from "./pages/DonorDashboard";
import { OrganizationDashboard } from "./pages/OrganizationDashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/donor",
    Component: DonorDashboard,
  },
  {
    path: "/organization",
    Component: OrganizationDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
