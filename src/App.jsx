import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import {
  AccountVerification,
  AddDeveloper,
  AgreementContract,
  Agreements,
  CreateContract,
  Expenses,
  ForgotPassword,
  FullTimeContract,
  GigBasedContract,
  Login,
  Overview,
  Payroll,
  ResetPassword,
  SignUp,
  StaticPage,
  Teams,
  AuthSuccess
} from './pages'
import ProtectedRoutes from './utility/ProtectedRoutes'
import PageNotFound from './pages/PageNotFound'
import AppLayout from './components/AppLayout'
import { SideBarProvider } from './context/SideBarContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './context/UserContext'

import ProtectedAdminRoute from './components/admin/common/ProtectedAdminRoute';
import LoginPage from "./pages/admin/login";
import SignupPage from "./pages/admin/signup";
import DashboardPage from "./pages/admin/dashboard";
import ContractsPage from "./pages/admin/contracts";
import DevelopersPage from "./pages/admin/developers";
import AssignmentPage from "./pages/admin/assignments";
import SettingsPage from "./pages/admin/settings";
import { NotificationProvider } from './utility/notificationBus.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    retry: 1,
    refetchOnWindowFocus: false,
  },
})

const AdminRoutesWrapper = () => {
  return (
    <NotificationProvider>
      <ProtectedAdminRoute />
    </NotificationProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <StaticPage />, // Accessible to all
  },
  {
    path: '/signup',
    element: <SignUp />, // Accessible to all
  },
  {
    path: '/account-verification',
    element: <AccountVerification />, // Accessible to all
  },
  {
    path: '/login',
    element: <Login />, // Accessible to all
  },
  {
    path: '/reset-password',
    element: <ResetPassword />, // Accessible to all
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />, // Accessible to all
  },
  {
    path: '/auth/success',
    element: <AuthSuccess />,
  },

  // Admin routes: login/signup public, other admin pages protected
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin/signup',
    element: <SignupPage />,
  },
  {
    path: '/admin',
    element: <AdminRoutesWrapper />, // Wrapped with NotificationProvider
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'contracts', element: <ContractsPage /> },
      { path: 'developers', element: <DevelopersPage /> },
      { path: 'assignments', element: <AssignmentPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  

  // Protected routes group
  {
    path: '/dashboard',
    element: (
      <ProtectedRoutes>
        <UserProvider>
          <SideBarProvider>
            <AppLayout />
          </SideBarProvider>
        </UserProvider>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: '',
        element: <Overview />,
      },
      {
        path: 'add-developer',
        element: <AddDeveloper />,
      },
      {
        path: 'create-contract',
        element: <CreateContract />,
      },
      {
        path: 'teams',
        element: <Teams />,
      },
      {
        path: 'payroll',
        element: <Payroll />,
      },
      {
        path: 'expenses',
        element: <Expenses />,
      },
      {
        path: 'agreements',
        element: <Agreements />,
      },
      {
        path: 'full-time-form',
        element: <FullTimeContract />,
      },
      {
        path: 'gig-based-form',
        element: <GigBasedContract />,
      },
      {
        path: 'agreement-contract',
        element: <AgreementContract />,
      },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <PageNotFound />,
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
