import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../../utility/adminAuth";

export default function ProtectedAdminRoute({ children }) {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/admin/login"  replace />;
}
