import Loader from "../ui/Loader";
import { Navigate } from "react-router-dom";
import { useToken } from "../features/useToken";

function ProtectedRoute({ children }) {
  const { data: accessToken, isLoading } = useToken();

  if (isLoading) return <Loader />;

  if (!isLoading && !accessToken) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
