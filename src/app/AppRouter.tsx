import { lazy, useEffect } from "react";
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
const DonationDetailPage = lazy(
  () => import("../features/donations/pages/DonationDetailPage"),
);
const EditDonationPage = lazy(
  () => import("../features/donations/pages/EditDonationPage"),
);
const OrganizationsPage = lazy(
  () => import("../features/organizations/pages/OrganizationsPage"),
);
const ApplyPage = lazy(
  () => import("../features/organizations/pages/ApplyPage"),
);
const AdminApplicationsPage = lazy(
  () => import("../features/organizations/pages/AdminApplicationsPage"),
);
const OrdersPage = lazy(() => import("../features/orders/pages/OrdersPage"));
const OrderPage = lazy(() => import("../features/orders/pages/OrderPage"));
const SponsorshipsPage = lazy(
  () => import("../features/sponsorships/pages/SponsorshipsPage"),
);
const NewSponsorshipPage = lazy(
  () => import("../features/sponsorships/pages/NewSponsorshipPage"),
);
const SponsorshipPage = lazy(
  () => import("../features/sponsorships/pages/SponsorshipPage"),
);
const NotificationsPage = lazy(
  () => import("../features/notifications/pages/NotificationsPage"),
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
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route
            path="/donations/:donationId"
            element={<DonationDetailPage />}
          />
          <Route
            path="/donations/:donationId/edit"
            element={
              <Protected>
                <EditDonationPage />
              </Protected>
            }
          />
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
            path="/admin/applications"
            element={
              <Protected>
                <AdminApplicationsPage />
              </Protected>
            }
          />
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
            path="/orders"
            element={
              <Protected>
                <OrdersPage />
              </Protected>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <Protected>
                <OrderPage />
              </Protected>
            }
          />
          <Route path="/sponsorships" element={<SponsorshipsPage />} />
          <Route
            path="/sponsorships/new"
            element={
              <Protected>
                <NewSponsorshipPage />
              </Protected>
            }
          />
          <Route
            path="/sponsorships/:sponsorshipId"
            element={<SponsorshipPage />}
          />
          <Route
            path="/notifications"
            element={
              <Protected>
                <NotificationsPage />
              </Protected>
            }
          />
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
    </BrowserRouter>
  );
}
