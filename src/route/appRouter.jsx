import { Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ClientLayout } from '../components/layout/ClientLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { ROLES } from '../config/constants';
import dashboardRouter from './dashboardRouter';
import agencyRouter from './agencyRouter';
import employeeRouter from './employeeRouter';
import userRouter from './userRouter';
import clientRouter from './clientRouter';
import shipmentRouter from './shipmentRouter';
import routeModuleRouter from './routeModuleRouter';
import pricingRouter from './pricingRouter';
import trackingRouter from './trackingRouter';
import paymentRouter from './paymentRouter';
import packagesRouter from './packagesRouter';
import subscriptionRouter from './subscriptionRouter';
import adminRouter from './adminRouter';
import ClientDashboardPage from '../pages/dashboard/client/ClientDashboardPage';
import DepotDashboardPage from '../pages/dashboard/depot/DepotDashboardPage';
import RetraitDashboardPage from '../pages/dashboard/retrait/RetraitDashboardPage';
import ExpeditionsPage from '../pages/dashboard/client/ExpeditionsPage';
import ColisPage from '../pages/dashboard/client/ColisPage';
import PaiementsPage from '../pages/dashboard/client/PaiementsPage';
import ShipmentDetailPage from '../pages/dashboard/client/ShipmentDetailPage';
import ParcelDetailPage from '../pages/dashboard/client/ParcelDetailPage';
import TrackingPage from '../pages/dashboard/client/TrackingPage';
import PaymentDetailPage from '../pages/dashboard/client/PaymentDetailPage';
import ProfilPage from '../pages/dashboard/client/ProfilPage';

// All roles that can access the employee dashboard (DashboardLayout)
const EMPLOYEE_ROLES = [
  ROLES.COMPANY_ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.DEPOT_AGENT,
  ROLES.RETRAIT_AGENT,
  'manager',
  'supervisor',
  'accountant',
  'delivery_driver',
];

// Roles restricted to admin-only sections (agencies, employees, pricing, etc.)
const ADMIN_ONLY_ROLES = [ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN];

const appRouter = [
  // ── Single DashboardLayout group for ALL employee roles ──
  {
    element: (
      <ProtectedRoute allowedRoles={EMPLOYEE_ROLES}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Super-admin sub-section
      {
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [...adminRouter],
      },
      // Admin-only sections (company admin + super admin)
      {
        element: (
          <ProtectedRoute allowedRoles={ADMIN_ONLY_ROLES}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          ...agencyRouter,
          ...employeeRouter,
          ...userRouter,
          ...routeModuleRouter,
          ...pricingRouter,
          ...subscriptionRouter,
        ],
      },
      // Shared routes accessible by all employee roles
      ...dashboardRouter,
      ...clientRouter,
      ...shipmentRouter,
      ...trackingRouter,
      ...paymentRouter,
      ...packagesRouter,

      // Agent-specific dashboard pages
      { path: '/dashboard/depot', element: <DepotDashboardPage /> },
      { path: '/dashboard/retrait', element: <RetraitDashboardPage /> },
    ],
  },

  // ── Client portal ──
  {
    path: '/dashboard/client',
    element: (
      <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="tableau-de-bord" replace /> },
      { path: 'tableau-de-bord', element: <ClientDashboardPage /> },
      { path: 'expeditions', element: <ExpeditionsPage /> },
      { path: 'expeditions/:id', element: <ShipmentDetailPage /> },
      { path: 'colis', element: <ColisPage /> },
      { path: 'colis/:id', element: <ParcelDetailPage /> },
      { path: 'suivi', element: <TrackingPage /> },
      { path: 'paiements', element: <PaiementsPage /> },
      { path: 'paiements/:id', element: <PaymentDetailPage /> },
      { path: 'profil', element: <ProfilPage /> },
    ],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
];

export default appRouter;
