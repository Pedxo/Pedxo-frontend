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
import ProtectedRoutes from './utlity/ProtectedRoutes'
import PageNotFound from './pages/PageNotFound'
import AppLayout from './components/AppLayout'
import { SideBarProvider } from './context/SideBarContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './context/UserContext'

const queryClient = new QueryClient({
  defaultOptions: {
    retry: 1,
    refetchOnWindowFocus: false,
  },
})

const router = createBrowserRouter([
  //This does all better than putting Error Element
  {
    path: '*',
    element: <PageNotFound />,
  },
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
        path: '/dashboard',
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
        path: 'agreements/:id',
        element: <AgreementContract />,
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  )
}

export default App
