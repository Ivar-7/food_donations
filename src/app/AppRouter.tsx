import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./authContext";
import AppLayout from "./AppLayout";
import { EmptyState } from "../shared/ui/Elements";

const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const DonationsPage = lazy(
  () => import("../features/donations/pages/DonationsPage"),
);
const NewDonationPage = lazy(
  () => import("../features/donations/pages/NewDonationPage"),
);
const OrganizationsPage = lazy(
  () => import("../features/organizations/pages/OrganizationsPage"),
);
const ApplyPage = lazy(
  () => import("../features/organizations/pages/ApplyPage"),
);
const AuthPage = lazy(() => import("../features/auth/pages/AuthPage"));
const ProfilePage = lazy(() => import("../features/auth/pages/ProfilePage"));
const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage"),
);
const AboutPage = lazy(() => import("../features/home/pages/AboutPage"));

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">Loading your account…</div>
    );
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={<div className="mx-auto max-w-7xl px-4 py-16">Loading…</div>}
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route
              path="/donations/new"
              element={
                <Protected>
                  <NewDonationPage />
                </Protected>
              }
            />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route
              path="/organizations/apply"
              element={
                <Protected>
                  <ApplyPage />
                </Protected>
              }
            />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route
              path="/profile"
              element={
                <Protected>
                  <ProfilePage />
                </Protected>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <DashboardPage />
                </Protected>
              }
            />
            <Route
              path="*"
              element={
                <div className="mx-auto max-w-4xl px-4 py-16">
                  <EmptyState
                    title="Page not found"
                    description="The page you requested does not exist."
                    action="Go home"
                    href="/"
                  />
                </div>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
