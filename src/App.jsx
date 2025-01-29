import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { SideBarProvider } from "./context/SideBarContext";
import Overview from "./pages/Overview";
import AddDeveloper from "./pages/AddDeveloper";
import CreateContract from "./pages/CreateContract";
import Teams from "./pages/Teams";
import Payroll from "./pages/Payroll";
import Expenses from "./pages/Expenses";
import Agreements from "./pages/Agreements";
import PageNotFound from "./pages/PageNotFound";
import Contract from "./pages/Contract";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <UserProvider>
            <SideBarProvider>
              <AppLayout />
            </SideBarProvider>
          </UserProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "add-developer",
          element: <AddDeveloper />,
        },
        {
          path: "create-contract",
          element: <CreateContract />,
        },
        {
          path: "teams",
          element: <Teams />,
        },
        {
          path: "payroll",
          element: <Payroll />,
        },
        {
          path: "contract",
          element: <Contract />,
        },
        {
          path: "expenses",
          element: <Expenses />,
        },
        {
          path: "agreements",
          element: <Agreements />,
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <SignUp />,
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
